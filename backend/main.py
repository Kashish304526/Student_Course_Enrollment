from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import Base, engine
from routers.course import router as course_router
from routers.enrollment import router as enrollment_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Course Enrollment System")

origins = [
    "http://localhost:5173",   
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],      
    allow_headers=["*"],
)

app.include_router(course_router, prefix="/courses", tags=["Courses"])
app.include_router(enrollment_router, prefix="/enrollments", tags=["Enrollments"])
