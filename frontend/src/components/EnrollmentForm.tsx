import { useState } from "react";
import { enrollStudent } from "../api/enrollmentApi";
import type{ Course } from "../types/course";

/* ✅ PROPS TYPE */
interface EnrollmentFormProps {
  courses: Course[];
  onEnroll: () => void;
}

function EnrollmentForm({ courses, onEnroll }: EnrollmentFormProps) {
  const [studentName, setStudentName] = useState("");
  const [courseId, setCourseId] = useState<number | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await enrollStudent({
      student_name: studentName,
      course_id: Number(courseId),
    });

    setStudentName("");
    setCourseId("");
    onEnroll();
  };

  return (
    <div className="card">
      <h2>Enroll Student</h2> <br />

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
        />

        <select
          value={courseId}
          onChange={(e) => setCourseId(Number(e.target.value))}
          required
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.course_name}
            </option>
          ))}
        </select>

        <button type="submit">Enroll</button>
      </form>
    </div>
  );
}

export default EnrollmentForm;

