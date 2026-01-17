from pydantic import BaseModel, ConfigDict, Field
from typing import Literal

class CourseCreate(BaseModel):
    course_name: str
    duration_value: int = Field(gt=0)   
    duration_unit: Literal["days", "weeks", "months"]

class CourseUpdate(BaseModel):
    course_name: str
    duration_value: int = Field(gt=0)   
    duration_unit: Literal["days", "weeks", "months"]

class CourseResponse(BaseModel):
    id: int
    course_name: str
    duration_value: int = Field(gt=0)   
    duration_unit: Literal["days", "weeks", "months"]
    
    model_config = ConfigDict(from_attributes=True)

