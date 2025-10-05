from typing import List, Dict

# List of authorized users and their roles
AUTHORIZED_USERS: Dict[str, List[str]] = {
    "manvithm@umich.edu": ["admin"],
    "manvithamoga@gmail.com": ["editor"],
    "mdbast@umich.edu": ["editor"],
    # Add more users here with their roles
    # "user2@example.com": ["editor"],
    # "user3@example.com": ["viewer"],
}

def is_user_authorized(email: str) -> bool:
    """Check if a user's email is in the authorized users list"""
    return email in AUTHORIZED_USERS

def get_user_roles(email: str) -> List[str]:
    """Get the roles for a given user"""
    return AUTHORIZED_USERS.get(email, [])
