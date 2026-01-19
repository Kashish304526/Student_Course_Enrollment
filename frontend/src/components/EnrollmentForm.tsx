import { useState } from "react";
import { enrollStudent } from "../api/enrollmentApi";
import type{ Course } from "../types/course";
import Select from "react-select";


/* PROPS TYPE */
interface EnrollmentFormProps {
  courses: Course[];
  onEnroll: () => void;
}

function EnrollmentForm({ courses, onEnroll }: EnrollmentFormProps) {
  const [studentName, setStudentName] = useState("");
  const [courseId, setCourseId] = useState<number | "">("");
  const [error, setError] = useState("");


  const courseOptions = courses.map(course => ({
  value: course.id,
  label: course.course_name
  }));


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // clear old error

    try {
      await enrollStudent({
        student_name: studentName,
        course_id: Number(courseId),
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

