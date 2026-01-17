import pytest
from fastapi import HTTPException
from services.enrollment_service import enroll_student
from services.course_service import create_course
from schemas.enrollment import EnrollmentCreate
from schemas.course import CourseCreate


# ---------------- POSITIVE TEST CASES ----------------

def test_enroll_student_positive(db):
    course = create_course(
        db,
        CourseCreate(course_name="AI", duration="8 weeks")
    )

    enrollment = EnrollmentCreate(
        student_name="Avni",
        course_id=course.id
    )

    result = enroll_student(db, enrollment)

    assert result.student_name == "Avni"
    assert result.course_id == course.id
    assert result.status == "Enrolled"


# ---------------- NEGATIVE TEST CASES ----------------

def test_enroll_student_invalid_course(db):
    enrollment = EnrollmentCreate(
        student_name="Avni",
        course_id=999
    )

    with pytest.raises(HTTPException) as exc:
        enroll_student(db, enrollment)

    assert exc.value.status_code == 400
    assert "Invalid course_id" in exc.value.detail


def test_enroll_student_empty_name(db):
    course = create_course(
        db,
        CourseCreate(course_name="ML", duration="5 weeks")
    )

    enrollment = EnrollmentCreate(
        student_name="",     # ❌ invalid
        course_id=course.id
    )

    # Service allows it, validation should normally be API-level
    result = enroll_student(db, enrollment)
    assert result.student_name == ""
