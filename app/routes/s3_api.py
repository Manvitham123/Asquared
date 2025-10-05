
import os
import json
import boto3
from flask import Blueprint, app, request, jsonify
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from .auth_utils import token_and_user_required

load_dotenv()

s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)
BUCKET_NAME = os.getenv('S3_BUCKET_NAME')

s3_api = Blueprint('s3_api', __name__)
@s3_api.route('/api/member-upload', methods=['POST'])
@token_and_user_required
def upload_member():
    # Validate required fields
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    image = request.files['image']
    name = request.form.get('name')
    position = request.form.get('position', 'N/A')
    year = request.form.get('year')
    team = request.form.get('team')
    if not all([name, team]):
        return jsonify({'error': 'Missing required fields'}), 400

    filename = secure_filename(f"{name}.jpg")
    folder = f"images/team/{team}/"
    image_key = f"{folder}{filename}"
    s3.upload_fileobj(image, BUCKET_NAME, image_key)
    image_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{image_key}"

    # Update metadata.json
    metadata_key = f"{folder}metadata.json"
    try:
        metadata_obj = s3.get_object(Bucket=BUCKET_NAME, Key=metadata_key)
        metadata = json.loads(metadata_obj['Body'].read())
    except Exception:
        metadata = []

    member_info = {
        "name": name,
        "position": position,
        "team": team,
        "image": image_url
    }
    metadata.append(member_info)
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=metadata_key,
        Body=json.dumps(metadata, indent=2),
        ContentType='application/json'
    )

    return jsonify({
        "success": True,
        "message": "Member uploaded successfully",
        "member": member_info,
        "imageUrl": image_url
    }), 200
@s3_api.route('/api/upload', methods=['POST'])
@token_and_user_required
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    filename = secure_filename(file.filename)
    s3.upload_fileobj(file, BUCKET_NAME, f'images/{filename}')
    url = f'https://{BUCKET_NAME}.s3.amazonaws.com/images/{filename}'
    return jsonify({'url': url}), 200

@s3_api.route('/api/blog-upload', methods=['POST'])
@token_and_user_required
def upload_blog():
    # Validate required fields
    if 'thumbnail' not in request.files:
        return jsonify({'error': 'No thumbnail provided'}), 400
    if 'title' not in request.form:
        return jsonify({'error': 'No title provided'}), 400
    if 'content' not in request.form:
        return jsonify({'error': 'No content provided'}), 400
    if 'author' not in request.form:
        return jsonify({'error': 'No author provided'}), 400
    if 'date' not in request.form:
        return jsonify({'error': 'No date provided'}), 400
    
    images = request.files.getlist('images[]')
    pdfs = request.files.getlist('pdfs[]')
    if (not images or len(images) == 0) and (not pdfs or len(pdfs) == 0):
        return jsonify({'error': 'No images or PDFs provided'}), 400

    thumbnail = request.files['thumbnail']
    title = secure_filename(request.form['title'])
    content = request.form['content']
    author = request.form['author']
    content_type = request.form.get('contentType', 'article')
    references = request.form.get('references', '')
    links_json = request.form.get('links', '[]')
    
    # Parse links JSON
    try:
        links = json.loads(links_json) if links_json else []
    except json.JSONDecodeError:
        links = []
    
    date = request.form['date']

    # Upload thumbnail
    thumb_ext = os.path.splitext(thumbnail.filename)[1]
    thumb_key = f'images/blog/{title}/thumbnail{thumb_ext}'
    s3.upload_fileobj(thumbnail, BUCKET_NAME, thumb_key)
    thumb_url = f'https://{BUCKET_NAME}.s3.amazonaws.com/{thumb_key}'

    # Upload each image
    image_urls = []
    for idx, img in enumerate(images):
        img_ext = os.path.splitext(img.filename)[1]
        img_key = f'images/blog/{title}/{date}_{idx}{img_ext}'
        s3.upload_fileobj(img, BUCKET_NAME, img_key)
        img_url = f'https://{BUCKET_NAME}.s3.amazonaws.com/{img_key}'
        image_urls.append(img_url)

    # Upload each PDF
    pdf_urls = []
    for idx, pdf in enumerate(pdfs):
        pdf_ext = os.path.splitext(pdf.filename)[1]
        pdf_key = f'images/blog/{title}/{date}_pdf_{idx}{pdf_ext}'
        s3.upload_fileobj(
            pdf,
            BUCKET_NAME,
            pdf_key,
            ExtraArgs={
                'ContentType': 'application/pdf',
                'ContentDisposition': 'inline'
            }
        )
        pdf_url = f'https://{BUCKET_NAME}.s3.amazonaws.com/{pdf_key}'
        pdf_urls.append(pdf_url)

    # Create metadata JSON
    from datetime import datetime
    metadata = {
        'title': request.form['title'],  # Original title (not secure_filename version)
        'slug': title,  # URL-safe version
        'content': content,
        'author': author,
        'contentType': content_type,
        'references': references.split('\n') if references.strip() else [],
        'links': links,  # Array of {text, url} objects
        'date': date,
        'createdAt': datetime.utcnow().isoformat(),
        'thumbnail': thumb_url,
        'images': image_urls,
        'pdfs': pdf_urls,
        'totalFiles': len(image_urls) + len(pdf_urls)
    }
    
    # Upload metadata JSON file
    metadata_key = f'images/blog/{title}/metadata.json'
    metadata_json = json.dumps(metadata, indent=2)
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=metadata_key,
        Body=metadata_json,
        ContentType='application/json'
    )

    return jsonify({
        'success': True,
        'message': 'Blog post uploaded successfully',
        'metadata': metadata,
        'metadataUrl': f'https://{BUCKET_NAME}.s3.amazonaws.com/{metadata_key}'
    }), 200

@s3_api.route('/api/event-upload', methods=['POST'])
def upload_event():
    # Validate required fields
    if 'title' not in request.form:
        return jsonify({'error': 'No title provided'}), 400
    if 'description' not in request.form:
        return jsonify({'error': 'No description provided'}), 400
    if 'date' not in request.form:
        return jsonify({'error': 'No date provided'}), 400
    
    images = request.files.getlist('images[]')
    if not images or len(images) == 0:
        return jsonify({'error': 'No images provided'}), 400

    title = secure_filename(request.form['title'])
    description = request.form['description']
    date = request.form['date']
    location = request.form.get('location', '')
    is_upcoming = request.form.get('isUpcoming', 'false').lower() == 'true'

    # Determine folder path based on upcoming status
    folder_prefix = 'images/events2/upcoming' if is_upcoming else 'images/events2'

    # Upload each image
    image_urls = []
    for idx, img in enumerate(images):
        img_ext = os.path.splitext(img.filename)[1]
        img_key = f'{folder_prefix}/{title}/{date}_{idx}{img_ext}'
        s3.upload_fileobj(img, BUCKET_NAME, img_key)
        img_url = f'https://{BUCKET_NAME}.s3.amazonaws.com/{img_key}'
        image_urls.append(img_url)

    # Create metadata JSON
    from datetime import datetime
    metadata = {
        'title': request.form['title'],  # Original title (not secure_filename version)
        'slug': title,  # URL-safe version
        'description': description,
        'location': location,
        'date': date,
        'createdAt': datetime.utcnow().isoformat(),
        'isUpcoming': is_upcoming,
        'images': image_urls,
        'totalImages': len(image_urls)
    }
    
    # Upload metadata JSON file
    metadata_key = f'{folder_prefix}/{title}/metadata.json'
    metadata_json = json.dumps(metadata, indent=2)
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=metadata_key,
        Body=metadata_json,
        ContentType='application/json'
    )

    return jsonify({
        'success': True,
        'message': f'Event uploaded successfully to {"upcoming events" if is_upcoming else "past events"}',
        'metadata': metadata,
        'metadataUrl': f'https://{BUCKET_NAME}.s3.amazonaws.com/{metadata_key}'
    }), 200

@s3_api.route('/api/blog-list', methods=['GET'])
def list_blogs():
    """List all blog posts by finding their metadata files"""
    try:
        response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix='images/blog/')
        blog_metadata = []
        
        for obj in response.get('Contents', []):
            if obj['Key'].endswith('/metadata.json'):
                # Get the metadata file
                try:
                    metadata_obj = s3.get_object(Bucket=BUCKET_NAME, Key=obj['Key'])
                    metadata = json.loads(metadata_obj['Body'].read())
                    blog_metadata.append(metadata)
                except Exception as e:
                    print(f"Error reading metadata for {obj['Key']}: {e}")
                    continue
        
        # Sort by date (newest first)
        blog_metadata.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
        
        return jsonify({
            'success': True,
            'blogs': blog_metadata,
            'count': len(blog_metadata)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@s3_api.route('/api/event-edit/<slug>', methods=['PUT'])
@token_and_user_required
def edit_event(slug):
    """Edit an existing event's metadata and reorder images"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('title') or not data.get('description') or not data.get('date'):
            return jsonify({'error': 'Title, description, and date are required'}), 400
        
        # Determine if this is an upcoming event based on the folder path
        is_upcoming = data.get('isUpcoming', False)
        folder_prefix = 'images/events2/upcoming' if is_upcoming else 'images/events2'
        metadata_key = f'{folder_prefix}/{slug}/metadata.json'
        
        # Try to get existing metadata
        try:
            metadata_obj = s3.get_object(Bucket=BUCKET_NAME, Key=metadata_key)
            existing_metadata = json.loads(metadata_obj['Body'].read())
        except s3.exceptions.NoSuchKey:
            return jsonify({'error': 'Event not found'}), 404
        
        # Update metadata with new values
        from datetime import datetime
        updated_metadata = {
            'title': data['title'],
            'slug': slug,  # Keep the original slug
            'description': data['description'],
            'location': data.get('location', existing_metadata.get('location', '')),
            'date': data['date'],
            'createdAt': existing_metadata.get('createdAt', datetime.utcnow().isoformat()),
            'updatedAt': datetime.utcnow().isoformat(),
            'isUpcoming': is_upcoming,
            'images': data.get('images', existing_metadata.get('images', [])),  # Allow reordering
            'totalImages': len(data.get('images', existing_metadata.get('images', [])))
        }
        
        # Upload updated metadata
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=metadata_key,
            Body=json.dumps(updated_metadata, indent=2),
            ContentType='application/json'
        )
        
        return jsonify({
            'success': True,
            'message': 'Event updated successfully',
            'metadata': updated_metadata
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@s3_api.route('/api/event-list', methods=['GET'])
def list_events():
    """List all events by finding their metadata files"""
    try:
        event_type = request.args.get('type', 'all')  # 'all', 'upcoming', 'past'
        
        # Determine which prefixes to search
        prefixes = []
        if event_type == 'upcoming':
            prefixes = ['images/events2/upcoming/']
        elif event_type == 'past':
            prefixes = ['images/events2/']
        else:  # 'all'
            prefixes = ['images/events2/', 'images/events2/upcoming/']
        
        event_metadata = []
        
        for prefix in prefixes:
            response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=prefix)
            
            for obj in response.get('Contents', []):
                if obj['Key'].endswith('/metadata.json'):
                    # Skip if it's a nested upcoming event when searching general events2
                    if prefix == 'images/events2/' and '/upcoming/' in obj['Key']:
                        continue
                    
                    # Get the metadata file
                    try:
                        metadata_obj = s3.get_object(Bucket=BUCKET_NAME, Key=obj['Key'])
                        metadata = json.loads(metadata_obj['Body'].read())
                        
                        # Add folder path info for deletion purposes
                        metadata['folderPath'] = obj['Key'].replace('/metadata.json', '')
                        metadata['isUpcoming'] = '/upcoming/' in obj['Key']
                        
                        event_metadata.append(metadata)
                    except Exception as e:
                        print(f"Error reading metadata for {obj['Key']}: {e}")
                        continue
        
        # Sort by date (newest first) - use the event date, not creation date
        event_metadata.sort(key=lambda x: x.get('date', ''), reverse=True)
        
        return jsonify({
            'success': True,
            'events': event_metadata,
            'count': len(event_metadata),
            'type': event_type
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@s3_api.route('/api/event/<slug>', methods=['GET'])
def get_event(slug):
    """Get a specific event by its slug"""
    try:
        metadata_key = f'images/events2/{slug}/metadata.json'
        metadata_obj = s3.get_object(Bucket=BUCKET_NAME, Key=metadata_key)
        metadata = json.loads(metadata_obj['Body'].read())
        
        return jsonify({
            'success': True,
            'event': metadata
        }), 200
    except s3.exceptions.NoSuchKey:
        return jsonify({'error': 'Event not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@s3_api.route('/api/blog/<slug>', methods=['GET'])
def get_blog(slug):
    """Get a specific blog post by its slug"""
    try:
        metadata_key = f'images/blog/{slug}/metadata.json'
        metadata_obj = s3.get_object(Bucket=BUCKET_NAME, Key=metadata_key)
        metadata = json.loads(metadata_obj['Body'].read())
        
        return jsonify({
            'success': True,
            'blog': metadata
        }), 200
    except s3.exceptions.NoSuchKey:
        return jsonify({'error': 'Blog post not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
'''
@s3_api.route('/api/blog-upload', methods=['POST'])
def upload_blog():
    if 'thumbnail' not in request.form:
        return jsonify({'error': 'No thumbnail provided'}), 400
    thumbnail = request.files['thumbnail']
    if not thumbnail:
        return jsonify({'error': 'Thumbnail cannot be empty'}), 400
    if 'title' not in request.form:
        return jsonify({'error': 'No title provided'}), 400
    title = request.form['title']
    if not title:
        return jsonify({'error': 'Title cannot be empty'}), 400
    if 'file' not in request.form:
        return jsonify({'error': 'No file provided'}), 400
    file = request.files['file']
    if not file:
        return jsonify({'error': 'File cannot be empty'}), 400
    if 'date' not in request.form:
        return jsonify({'error': 'No date provided'}), 400
    date = request.form['date']
    if not date:
        return jsonify({'error': 'Date cannot be empty'}), 400
    filename = secure_filename(file.filename)
    thumbnailname = secure_filename(thumbnail)
    s3.upload_fileobj(file, BUCKET_NAME, f'images/blog/{title}/{date}')
    s3.upload_fileobj(thumbnail, BUCKET_NAME, f'images/blog/{title}/thumbnail')
    url = f'https://{BUCKET_NAME}.s3.amazonaws.com/images/{title}'
    return jsonify({'url': url}), 200
'''
@s3_api.route('/api/delete', methods=['POST'])
def delete_image():
    data = request.get_json()
    key = data.get('key')
    if not key:
        return jsonify({'error': 'No key provided'}), 400
    s3.delete_object(Bucket=BUCKET_NAME, Key=key)
    return jsonify({'message': 'Deleted'}), 200

@s3_api.route('/api/replace', methods=['POST'])
def replace_image():
    if 'file' not in request.files or 'key' not in request.form:
        return jsonify({'error': 'File and key required'}), 400
    file = request.files['file']
    key = request.form['key']
    s3.upload_fileobj(file, BUCKET_NAME, key)
    url = f'https://{BUCKET_NAME}.s3.amazonaws.com/{key}'
    return jsonify({'url': url}), 200

@s3_api.route('/api/list-images', methods=['GET'])
def list_images():
    print("Listing images in S3 bucket")
    try:
        response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix='images/')
        image_keys = [obj['Key'] for obj in response.get('Contents', []) if obj['Key'] != 'images/']
        return jsonify({'images': image_keys}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@s3_api.route('/api/member-delete/<path:folder_path>', methods=['DELETE'])
@token_and_user_required
def delete_member(folder_path):
    """Delete a member and their associated files"""
    try:
        # Remove any leading slashes
        folder_path = folder_path.lstrip('/')
        
        # Split the path into components
        path_parts = folder_path.split('/')
        
        # Extract team and filename
        if len(path_parts) >= 2:
            team = path_parts[0]
            filename = path_parts[1]
        else:
            return jsonify({'error': 'Invalid path format'}), 400
            
        # Construct the file path
        file_path = f'images/team/{team}/{filename}'
        
        # Construct the metadata path
        metadata_path = f'images/team/{team}/metadata.json'
        
        # First, try to read and update the metadata
        try:
            metadata_obj = s3.get_object(Bucket=BUCKET_NAME, Key=metadata_path)
            metadata = json.loads(metadata_obj['Body'].read())
            
            # Remove the member from metadata by matching the name part
            base_filename = os.path.splitext(filename)[0]  # Get filename without extension
            member_name = base_filename.replace('_', ' ')  # Replace underscores with spaces
            print(f"Looking to remove member: {member_name}")  # Debug log
            
            # Filter out the member by name match
            metadata = [m for m in metadata if not m.get('name', '').lower().replace(' ', '') == member_name.lower().replace(' ', '')]
            print(f"Updated metadata count: {len(metadata)}")  # Debug log
            
            # Update metadata file
            s3.put_object(
                Bucket=BUCKET_NAME,
                Key=metadata_path,
                Body=json.dumps(metadata, indent=2),
                ContentType='application/json'
            )
        except Exception as e:
            print(f"Error updating metadata: {e}")
            # Continue with deletion even if metadata update fails
        
        # Now delete the member's image
        try:
            s3.delete_object(Bucket=BUCKET_NAME, Key=file_path)
        except Exception as e:
            return jsonify({'error': f'Failed to delete image: {str(e)}'}), 500
        
        return jsonify({
            'success': True,
            'message': f'Member deleted successfully',
            'deletedImage': file_path,
            'updatedMetadata': metadata_path
        }), 200
        
    except Exception as e:
        print(f"Error in delete_member: {e}")  # Add logging
        return jsonify({'error': str(e)}), 500

@s3_api.route('/api/team-list', methods=['GET'])
def list_team_members():
    """List all team members by finding their metadata files"""
    try:
        team = request.args.get('team', None)  # Optional team filter
        prefix = f'images/team/{team}/' if team else 'images/team/'
        
        # Get all metadata files
        response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=prefix)
        team_metadata = []
        
        for obj in response.get('Contents', []):
            if obj['Key'].endswith('/metadata.json'):
                try:
                    metadata_obj = s3.get_object(Bucket=BUCKET_NAME, Key=obj['Key'])
                    metadata = json.loads(metadata_obj['Body'].read())
                    team_metadata.append(metadata)
                except Exception as e:
                    print(f"Error reading metadata for {obj['Key']}: {e}")
                    continue
        
        return jsonify({
            'success': True,
            'members': team_metadata,
            'count': len(team_metadata)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@s3_api.route('/health')
def health():
    return "OK", 200

from .sheets_utils import append_to_sheet

@s3_api.route('/api/joinus-submit', methods=['POST'])
def joinus_submit():
    data = request.get_json()
    required_fields = ["name", "email", "grade", "gender", "interests", "questions", "hear"]

    # Validate incoming fields
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    # Append to Google Sheet
    try:
        row = [
            data["name"],
            data["email"],
            data["grade"],
            data["gender"],
            data["interests"],
            data.get("questions", ""),
            data.get("hear", "")
        ]
        append_to_sheet(row)
        return jsonify({"success": True, "message": "Data saved to Google Sheets"}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@s3_api.route('/api/event-delete/<path:folder_path>', methods=['DELETE'])
def delete_event(folder_path):
    """Delete an event and all its associated files"""
    try:
        # Ensure the folder_path starts with images/events2/
        if not folder_path.startswith('images/events2/'):
            folder_path = f'images/events2/{folder_path}'
        
        # Add trailing slash if not present
        if not folder_path.endswith('/'):
            folder_path += '/'
        
        # List all objects in the event folder
        response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=folder_path)
        
        if 'Contents' not in response:
            return jsonify({'error': 'Event not found'}), 404
        
        # Delete all files in the event folder
        objects_to_delete = [{'Key': obj['Key']} for obj in response['Contents']]
        
        if objects_to_delete:
            s3.delete_objects(
                Bucket=BUCKET_NAME,
                Delete={'Objects': objects_to_delete}
            )
        
        return jsonify({
            'success': True,
            'message': f'Event deleted successfully',
            'deletedFiles': len(objects_to_delete),
            'folderPath': folder_path
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

from werkzeug.utils import secure_filename

@s3_api.route('/api/blog-delete/<slug>', methods=['DELETE'])
@token_and_user_required
def delete_blog(slug):
    """Delete a blog post folder and all its files"""
    try:
        # Use the slug (already url-safe). If you want extra safety:
        safe_slug = secure_filename(slug)
        prefix = f'images/blog/{safe_slug}/'

        # List everything under the blog folder
        resp = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=prefix)
        if 'Contents' not in resp:
            return jsonify({'error': 'Blog post not found'}), 404

        to_delete = [{'Key': obj['Key']} for obj in resp['Contents']]
        if to_delete:
            s3.delete_objects(Bucket=BUCKET_NAME, Delete={'Objects': to_delete})

        return jsonify({
            'success': True,
            'message': 'Blog post deleted successfully',
            'deletedFiles': len(to_delete),
            'folderPath': prefix
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
