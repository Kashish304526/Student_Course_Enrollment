from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.course import Course
from schemas.course import CourseCreate, CourseUpdate

# CREATE
def create_course(db: Session, course: CourseCreate):
    # Check if course already exists (by name)
    existing = (
        db.query(Course)
        .filter(Course.course_name == course.course_name)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Course already exists"
        )

    # Create new course
    db_course = Course(**course.model_dump())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

# GET ALL
def get_all_courses(db: Session):
    return db.query(Course).all()

# GET BY ID
def get_course_by_id(db: Session, course_id: int):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

# UPDATE
def update_course(db: Session, course_id: int, course: CourseUpdate):
    db_course = get_course_by_id(db, course_id)
    for key, value in course.model_dump().items():
        setattr(db_course, key, value)
    db.commit()
    db.refresh(db_course)
    return db_course

# DELETE
def delete_course(db: Session, course_id: int):
    db_course = get_course_by_id(db, course_id)
    db.delete(db_course)
    db.commit()
    return {"message": "Course deleted successfully"}
