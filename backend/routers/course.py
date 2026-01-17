from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from schemas.course import CourseCreate, CourseUpdate, CourseResponse
from services.course_service import (
    create_course,
    get_all_courses,
    get_course_by_id,
    update_course,
    delete_course
)

router = APIRouter()

# POST – Create Course
@router.post("/", response_model=CourseResponse)
def add_course(course: CourseCreate, db: Session = Depends(get_db)):
    return create_course(db, course)

# GET – All Courses
@router.get("/", response_model=list[CourseResponse])
def list_courses(db: Session = Depends(get_db)):
    return get_all_courses(db)

# GET – Course by ID
@router.get("/{course_id}", response_model=CourseResponse)
def get_course(course_id: int, db: Session = Depends(get_db)):
    return get_course_by_id(db, course_id)

# PUT – Update Course
@router.put("/{course_id}", response_model=CourseResponse)
def edit_course(
    course_id: int,
    course: CourseUpdate,
    db: Session = Depends(get_db)
):
    return update_course(db, course_id, course)

# DELETE – Delete Course
@router.delete("/{course_id}")
def remove_course(course_id: int, db: Session = Depends(get_db)):
    return delete_course(db, course_id)
