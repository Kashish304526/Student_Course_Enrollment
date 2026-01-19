from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.enrollment import Enrollment
from models.course import Course
from schemas.enrollment import EnrollmentStatus

def enroll_student(db, student_name: str, course_id: int):
    # Check if already enrolled (and not dropped)
    existing = (
        db.query(Enrollment)
        .filter(
            Enrollment.student_name == student_name,
            Enrollment.course_id == course_id,
            Enrollment.status != EnrollmentStatus.dropped.value
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Student is already enrolled in this course"
        )

    # Otherwise create new enrollment
    enrollment = Enrollment(
        student_name=student_name,
        course_id=course_id
    )

    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment

def get_all_enrollments(db: Session):
    return db.query(Enrollment).all()

def update_status(db: Session, enrollment_id: int, status: EnrollmentStatus):
    enrollment = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()

    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    enrollment.status = status
    db.commit()
    db.refresh(enrollment)
    return enrollment

