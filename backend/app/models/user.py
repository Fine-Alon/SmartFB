"""
User document model, defined with MongoEngine.

Represents INTERNAL accounts for SmartFB — administrators, business
owners, and support/reviewer staff. Customers submitting public feedback
don't need an account, so they're not modeled here.
"""
from datetime import datetime, timezone

from mongoengine import (
    BooleanField,
    DateTimeField,
    Document,
    EmailField,
    StringField,
)

ROLE_ADMIN = "admin"
ROLE_SUPPORT_EMPLOYEE = "support_employee"
ROLE_HUMAN_REVIEWER = "human_reviewer"
ROLE_BUSINESS_OWNER = "business_owner"
ROLE_CUSTOMER_SERVICE = "customer_service"
ROLE_CUSTOMER = "customer"
USER_ROLES = (
    ROLE_ADMIN,
    ROLE_SUPPORT_EMPLOYEE,
    ROLE_HUMAN_REVIEWER,
    ROLE_BUSINESS_OWNER,
    ROLE_CUSTOMER_SERVICE,
    ROLE_CUSTOMER,
)


class User(Document):
    name = StringField(required=True, max_length=100)
    email = EmailField(required=True, unique=True)
    hashed_password = StringField(required=True)
    role = StringField(choices=USER_ROLES, default=ROLE_CUSTOMER)
    is_active = BooleanField(default=True)

    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    updated_at = DateTimeField(default=lambda: datetime.now(timezone.utc))
    last_login = DateTimeField(null=True)

    meta = {
        "collection": "users",
        "indexes": ["email"],
    }