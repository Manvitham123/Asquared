import os
from googleapiclient.discovery import build
from google.oauth2 import service_account

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
SERVICE_ACCOUNT_FILE = os.path.join(os.path.dirname(__file__), "credentials.json")

# Load service account credentials
creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)

# Create Sheets API client
service = build("sheets", "v4", credentials=creds)

SPREADSHEET_ID = "1831ZFHDEavHfm2IATgl2afXYh3Yrlj5bTghB2iGQslc"   # Replace with your actual sheet ID
RANGE = "Responses!A1"             # The sheet name and range

def append_to_sheet(row_data):
    """Appends a row of data to the Google Sheet."""
    sheet = service.spreadsheets()
    request = sheet.values().append(
        spreadsheetId=SPREADSHEET_ID,
        range=RANGE,
        valueInputOption="RAW",
        body={"values": [row_data]}
    )
    response = request.execute()
    return response
