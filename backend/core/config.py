from pydantic import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Student Course Enrollment System"

settings = Settings()
