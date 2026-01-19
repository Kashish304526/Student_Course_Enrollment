export interface Enrollment {
  id: number;
  student_name: string;
  course_id: number;
  status: "enrolled" | "paused" | "dropped";
}
