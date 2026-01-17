from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.enrollment import Enrollment
from models.course import Course
from schemas.enrollment import EnrollmentStatus

def enroll_student(db: Session, student_name: str, course_id: int):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=400,
            detail="Invalid course_id. Course does not exist."
        )

    enrollment = Enrollment(
        student_name=student_name,
        course_id=course_id,
        status="Enrolled"
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment

def get_all_enrollments(db: Session):
    return db.query(Enrollment).all()

def update_status(db: Session, enrollment_id: int, status: EnrollmentStatus):
    enrollment = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    enrollment.status = status.value
    db.commit()
    db.refresh(enrollment) 
    return enrollment
