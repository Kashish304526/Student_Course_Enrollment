from sqlalchemy import Column, Integer, String
from core.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    course_name = Column(String, nullable=False)
    duration_value = Column(Integer, nullable=False)
    duration_unit = Column(String, nullable=False)

