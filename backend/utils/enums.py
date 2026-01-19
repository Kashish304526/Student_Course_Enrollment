from enum import Enum

class EnrollmentStatus(str, Enum):
    enrolled = "enrolled"
    paused = "paused"
    dropped = "dropped"
