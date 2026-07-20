"""
User document model, defined with MongoEngine.

Represents INTERNAL accounts for SmartFB — admins and support staff only.
Customers submitting public feedback don't need an account.
"""
from mongoengine import Document, EmailField, StringField

ROLE_ADMIN = "admin"
ROLE_SUPPORT = "support"
USER_ROLES = (ROLE_ADMIN, ROLE_SUPPORT)


class User(Document):
    email = EmailField(required=True, unique=True)
    hashed_password = StringField(required=True)
    role = StringField(choices=USER_ROLES, default=ROLE_SUPPORT)

    meta = {
        "collection": "users",
        "indexes": ["email"],
    }