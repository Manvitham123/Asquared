from sheets_utils import append_to_sheet

# Try adding a test row
response = append_to_sheet([
    "Test Name",
    "test@example.com",
    "Senior",
    "she/her",
    "AI",
    "No questions",
    "Instagram"
])

print("✅ Row added successfully!", response)
