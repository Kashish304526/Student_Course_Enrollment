import sys
import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# ✅ Add backend root to PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from core.database import Base

# ✅ IMPORT MODELS (THIS IS THE MISSING PIECE)
from models.course import Course
from models.enrollment import Enrollment

SQLALCHEMY_DATABASE_URL = "sqlite:///./unit_test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ✅ NOW tables will be created
Base.metadata.create_all(bind=engine)

@pytest.fixture()
def db():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
