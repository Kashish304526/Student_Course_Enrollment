from pydantic import BaseModel, ConfigDict
from utils.enums import EnrollmentStatus
from typing import Literal

class EnrollmentCreate(BaseModel):
    student_name: str
    course_id: int

    model_config = ConfigDict(from_attributes=True)


class EnrollmentResponse(BaseModel):
    id: int
    student_name: str
    course_id: int
    status: Literal["Enrolled", "Dropped"]

    model_config = ConfigDict(from_attributes=True)
