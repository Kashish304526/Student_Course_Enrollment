export interface Course {
  id: number;
  course_name: string;
  duration_value: number;
  duration_unit: "days" | "weeks" | "months";
}
