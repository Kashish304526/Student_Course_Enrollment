import { useState } from "react";
import {
  createCourse,
  deleteCourse,
  updateCourse,
} from "../api/courseApi";
import type { Course } from "../types/course";

interface CourseListProps {
  courses: Course[];
  onCourseChange: () => void;
}

function CourseList({ courses, onCourseChange }: CourseListProps) {
  const [courseName, setCourseName] = useState("");
  const [durationValue, setDurationValue] = useState<number | "">("");
  const [durationUnit, setDurationUnit] =
    useState<"days" | "weeks" | "months">("weeks");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const resetForm = () => {
    setCourseName("");
    setDurationValue("");
    setDurationUnit("weeks");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!courseName.trim()) {
      setError("Course name is required");
      return;
    }

    if (!durationValue || durationValue <= 0) {
      setError("Duration must be greater than 0");
      return;
    }

    setError("");

    const payload = {
      course_name: courseName,
      duration_value: Number(durationValue),
      duration_unit: durationUnit,
    };

    if (editingId) {
      // ✏️ EDIT
      await updateCourse(editingId, payload);
    } else {
      // ➕ ADD
      await createCourse(payload);
    }

    resetForm();
    onCourseChange();
  };

  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setCourseName(course.course_name);
    setDurationValue(course.duration_value);
    setDurationUnit(course.duration_unit);
  };

  return (
    <div className="card">
      <h2>Courses</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Course Name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="number"
          placeholder="Duration"
          min={1}
          value={durationValue}
          onChange={(e) => setDurationValue(Number(e.target.value))}
        />

        <select
          value={durationUnit}
          onChange={(e) =>
            setDurationUnit(
              e.target.value as "days" | "weeks" | "months"
            )
          }
        >
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
        </select>
      </div>

      <button onClick={handleSubmit}>
        {editingId ? "Update Course" : "Add Course"}
      </button>

      {editingId && (
        <button
          style={{ marginLeft: "8px", background: "gray" }}
          onClick={resetForm}
        >
          Cancel
        </button>
      )}

      <hr />

      {courses.map((course) => (
        <div key={course.id} className="course-item" style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            }}>
            <span>
                <strong>
                {course.course_name} – {course.duration_value}{" "}
                {course.duration_unit}
                </strong>
            </span>
        
          <span>
            <button onClick={() => handleEdit(course)}>
              Edit
            </button>

            <button
              style={{ background: "red", marginLeft: "6px" }}
              onClick={() => deleteCourse(course.id).then(onCourseChange)}
            >
              Delete
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}

export default CourseList;


