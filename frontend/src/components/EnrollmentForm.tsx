import { useState } from "react";
import { enrollStudent } from "../api/enrollmentApi";
import type{ Course } from "../types/course";
import type { Enrollment } from "../types/enrollment";
import Select from "react-select";


/* PROPS TYPE */
interface EnrollmentFormProps {
  courses: Course[];
  enrollments: Enrollment[];
  onEnroll: () => void;
}

function EnrollmentForm({ courses, enrollments, onEnroll }: EnrollmentFormProps) {
  const [studentName, setStudentName] = useState("");
  const [courseId, setCourseId] = useState<number | "">("");
  const [error, setError] = useState("");


  const courseOptions = courses.map(course => ({
  value: course.id,
  label: course.course_name
  }));


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(""); // clear previous error

  // 1. Empty validation
  if (!studentName.trim()) {
    setError("Student name is required");
    return;
  }

  if (!courseId) {
    setError("Please select a course");
    return;
  }

  // 2. Duplicate check (case-insensitive)
  const normalizedStudent = studentName.toLowerCase().trim();
  const selectedCourseId = Number(courseId);

  const isDuplicate = enrollments.some(
    (e) =>
      e.course_id === selectedCourseId &&
      e.student_name.toLowerCase().trim() === normalizedStudent &&
      e.status !== "dropped" // optional: only block active enrollments
  );

  if (isDuplicate) {
    setError("This student is already enrolled in this course");
    return;
  }

  try {
    await enrollStudent({
      student_name: studentName.trim(),
      course_id: selectedCourseId,
    });

    setStudentName("");
    setCourseId("");
    onEnroll();
  } catch (err: any) {
    const msg =
      err?.response?.data?.detail || "Enrollment failed. Try again.";
    setError(msg);

    setTimeout(() => {
      setError("");
    }, 3000);
  }
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

        <Select
          options={courseOptions}
          placeholder="Select Course"
          value={courseOptions.find(opt => opt.value === courseId) || null}
          onChange={(selected) => setCourseId(selected ? selected.value : "")}
          maxMenuHeight={160}  
          styles={{
            control: (base) => ({
            ...base,
            minHeight: "40px",
            height: "40px",
            fontSize: "14px",
            }),
            valueContainer: (base) => ({
              ...base,
              height: "40px",
              padding: "0 8px",
            }),
            input: (base) => ({
              ...base,
              margin: "0px",
            }),
            indicatorsContainer: (base) => ({
              ...base,
              height: "40px",
            }),
            placeholder: (base) => ({
              ...base,
              fontSize: "14px",
            }),
            singleValue: (base) => ({
              ...base,
              fontSize: "14px",
            }),
            option: (base) => ({
              ...base,
              fontSize: "14px",
            }),
          }}
        /> <br />
        {error && (
          <div className="error-box" style={{ color: "red", marginBottom: "10px" }}>
          {error}
          </div>
        )}


        <button type="submit">Enroll</button>
      </form>
    </div>
  );
}


export default EnrollmentForm;

