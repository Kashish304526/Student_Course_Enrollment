from enum import Enum

class EnrollmentStatus(str, Enum):
    enrolled = "Enrolled"
    dropped = "Dropped"
