import pytest
from fastapi import HTTPException
from services.course_service import (
    create_course,
    get_all_courses,
    get_course_by_id,
    update_course,
    delete_course
)
from schemas.course import CourseCreate, CourseUpdate


# ---------------- POSITIVE TEST CASES ----------------

def test_create_course_positive(db):
    course = CourseCreate(course_name="Python", duration="6 weeks")
    result = create_course(db, course)

    assert result.id is not None
    assert result.course_name == "Python"


def test_get_all_courses_positive(db):
    courses = get_all_courses(db)
    assert isinstance(courses, list)


def test_get_course_by_id_positive(db):
    course = create_course(
        db, CourseCreate(course_name="FastAPI", duration="4 weeks")
    )
    fetched = get_course_by_id(db, course.id)

    assert fetched.id == course.id


def test_update_course_positive(db):
    course = create_course(
        db, CourseCreate(course_name="Old", duration="2 weeks")
    )

    updated = update_course(
        db,
        course.id,
        CourseUpdate(course_name="New", duration="5 weeks")
    )

    assert updated.course_name == "New"


def test_delete_course_positive(db):
    course = create_course(
        db, CourseCreate(course_name="Delete", duration="1 week")
    )

    response = delete_course(db, course.id)
    assert response["message"] == "Course deleted successfully"


# ---------------- NEGATIVE TEST CASES ----------------

def test_get_course_by_id_not_found(db):
    with pytest.raises(HTTPException) as exc:
        get_course_by_id(db, 999)

    assert exc.value.status_code == 404


def test_update_course_not_found(db):
    with pytest.raises(HTTPException) as exc:
        update_course(
            db,
            999,
            CourseUpdate(course_name="X", duration="Y")
        )

    assert exc.value.status_code == 404


def test_delete_course_not_found(db):
    with pytest.raises(HTTPException) as exc:
        delete_course(db, 999)

    assert exc.value.status_code == 404
