from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from schemas.enrollment import EnrollmentCreate, EnrollmentResponse, StatusUpdateRequest
from services.enrollment_service import (
    enroll_student,
    get_all_enrollments,
    update_status
)
from utils.enums import EnrollmentStatus

router = APIRouter()

@router.post("/", response_model=EnrollmentResponse)
def enroll(enrollment: EnrollmentCreate, db: Session = Depends(get_db)):
    return enroll_student(db, enrollment.student_name, enrollment.course_id)

@router.get("/", response_model=list[EnrollmentResponse])
def list_enrollments(db: Session = Depends(get_db)):
    return get_all_enrollments(db)

@router.patch("/{enrollment_id}/status", response_model=EnrollmentResponse)
def change_status(
    enrollment_id: int,
    payload: StatusUpdateRequest,
    db: Session = Depends(get_db)
):
    return update_status(db, enrollment_id, payload.status)

