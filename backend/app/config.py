import os


class Config:
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
    EMAIL_PROVIDER_API_KEY = os.getenv("EMAIL_PROVIDER_API_KEY", "")
    BUSINESS_INBOX_EMAIL = os.getenv("BUSINESS_INBOX_EMAIL", "orders@cavercat.example")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
    ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = ENV == "development"
