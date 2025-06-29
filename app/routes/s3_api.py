import os
import boto3
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

load_dotenv()

s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)
BUCKET_NAME = os.getenv('S3_BUCKET_NAME')

s3_api = Blueprint('s3_api', __name__)

@s3_api.route('/api/upload', methods=['POST'])
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

#check if filename is the same
@s3_api.route('/api/blog-upload', methods=['POST'])
def upload_blog():
    # ...validation...
    file = request.files['file']
    thumbnail = request.files['thumbnail']
    title = secure_filename(request.form['title'])
    date = request.form['date']
    # Get file extensions
    file_ext = os.path.splitext(file.filename)[1]
    thumb_ext = os.path.splitext(thumbnail.filename)[1]
    # S3 keys
    main_key = f'images/blog/{title}/{date}{file_ext}'
    thumb_key = f'images/blog/{title}/thumbnail{thumb_ext}'
    # Upload
    s3.upload_fileobj(file, BUCKET_NAME, main_key)
    s3.upload_fileobj(thumbnail, BUCKET_NAME, thumb_key)
    # URLs
    main_url = f'https://{BUCKET_NAME}.s3.amazonaws.com/{main_key}'
    thumb_url = f'https://{BUCKET_NAME}.s3.amazonaws.com/{thumb_key}'
    return jsonify({'main_url': main_url, 'thumbnail_url': thumb_url}), 200

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
    try:
        response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix='images/')
        image_keys = [obj['Key'] for obj in response.get('Contents', []) if obj['Key'] != 'images/']
        return jsonify({'images': image_keys}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
