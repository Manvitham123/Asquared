import os
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
    if 'date' not in request.form:
        return jsonify({'error': 'No date provided'}), 400
    images = request.files.getlist('images[]')
    if not images or len(images) == 0:
        return jsonify({'error': 'No images provided'}), 400

    thumbnail = request.files['thumbnail']
    title = secure_filename(request.form['title'])
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

    return jsonify({'thumbnail_url': thumb_url, 'image_urls': image_urls}), 200
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
