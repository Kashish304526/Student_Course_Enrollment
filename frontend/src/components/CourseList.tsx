import { useState, useEffect } from "react";
import {
  createCourse,
  deleteCourse,
  updateCourse,
} from "../api/courseApi";
import type { Course } from "../types/course";
import type { Enrollment } from "../types/enrollment";
import "../index.css";

interface CourseListProps {
  courses: Course[];
  enrollments: Enrollment[];   
  onCourseChange: () => void;
}


function CourseList({ courses, enrollments, onCourseChange }: CourseListProps) {
  const [courseName, setCourseName] = useState("");
  const [durationValue, setDurationValue] = useState<number | "">("");
  const [durationUnit, setDurationUnit] =
    useState<"days" | "weeks" | "months">("weeks");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const activeEnrollments = enrollments.filter(e => e.status !== "dropped");

  const courseStudentMap = new Map<number, string[]>();

  activeEnrollments.forEach(e => {
    if (!courseStudentMap.has(e.course_id)) {
      courseStudentMap.set(e.course_id, []);
    }
    courseStudentMap.get(e.course_id)!.push(e.student_name);
  });


  const resetForm = () => {
    setCourseName("");
    setDurationValue("");
    setDurationUnit("weeks");
    setEditingId(null);
  };

  useEffect(() => {
  if (!error) return;

  const timer = setTimeout(() => {
    setError("");
  }, 3000); 

  return () => clearTimeout(timer);
}, [error]);


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

  try {
    if (editingId) {
      // EDIT
      await updateCourse(editingId, payload);
    } else {
      // ADD
      await createCourse(payload);
    }

    resetForm();
    onCourseChange();
  } catch (err: any) {
    const msg =
      err?.response?.data?.detail || "Failed to save course. Try again.";
    setError(msg);
  }
};


  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    setCourseName(course.course_name);
    setDurationValue(course.duration_value);
    setDurationUnit(course.duration_unit);
  };

  // Deduplicate courses by ID
  const uniqueCoursesMap = new Map<number, Course>();

  courses.forEach(course => {
    uniqueCoursesMap.set(course.id, course);
  });

  const uniqueCourses = Array.from(uniqueCoursesMap.values());

  return (
    <div className="card">
      <h2>Courses</h2> <br />

      {error && (
        <div className="error-box">
          {error}
        </div>
        )}

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

      {uniqueCourses.map((course) => {
        const students = courseStudentMap.get(course.id) || [];
        const count = students.length;

        return (
        <div
          key={course.id}
          className="course-item"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            }}
        >
        <span>
          <strong>
            {course.course_name} – {course.duration_value}{" "}
            {course.duration_unit}
          </strong>

          {/* 👥 Student Count */}
          <span className="count-wrapper" style={{ marginLeft: "10px" }}>
            <span className="student-count">
              ({count})
            </span>

            {/* Hover Popup */}
            {count > 0 && (
              <div className="student-tooltip">
                {students.map((s, i) => (
                  <div key={i}>{s}</div>
                ))}
              </div>
            )}
            </span>
          </span>

        <span>
          <button onClick={() => handleEdit(course)}>Edit</button>

          <button
            style={{ background: "red", marginLeft: "6px" }}
            onClick={() => deleteCourse(course.id).then(onCourseChange)}
          >
            Delete
          </button>
        </span>
      </div>
    );
  })}

  </div>
  );
}

export default CourseList;


