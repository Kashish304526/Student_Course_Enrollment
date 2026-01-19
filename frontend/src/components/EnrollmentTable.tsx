import { useState } from "react";
import type { Enrollment } from "../types/enrollment";
import type { Course } from "../types/course";
import { updateEnrollmentStatus } from "../api/enrollmentApi";

interface EnrollmentTableProps {
  enrollments: Enrollment[];
  courses: Course[];
  onRefresh: () => void;
}

function EnrollmentTable({
  enrollments,
  courses,
  onRefresh,
}: EnrollmentTableProps) {
  // 🔍 Filter states
  const [studentFilter, setStudentFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Map course_id → course_name
  const courseMap = new Map<number, string>(
    courses.map((course) => [course.id, course.course_name])
  );

  // Apply filtering
  const filteredEnrollments = enrollments.filter((e) => {
    const studentMatch = e.student_name
      .toLowerCase()
      .includes(studentFilter.toLowerCase());

    const courseName = courseMap.get(e.course_id) || "";
    const courseMatch = courseName
      .toLowerCase()
      .includes(courseFilter.toLowerCase());

    const statusMatch =
      statusFilter === "" || e.status === statusFilter;

    return studentMatch && courseMatch && statusMatch;
  });

  // Group by student
  const grouped = filteredEnrollments.reduce((acc, en) => {
    if (!acc[en.student_name]) acc[en.student_name] = [];
    acc[en.student_name].push(en);
    return acc;
  }, {} as Record<string, Enrollment[]>);

  // Helper to display status nicely
  const formatStatus = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1);

  const handleStatusChange = async (
    id: number,
    status: "enrolled" | "paused" | "dropped"
  ) => {
    await updateEnrollmentStatus(id, status);
    onRefresh();
  };

  return (
    <div className="card">
      <h2>Enrollments</h2>
      <br />

      {/* 🔍 Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          placeholder="Filter by student"
          value={studentFilter}
          onChange={(e) => setStudentFilter(e.target.value)}
        />

        <input
          placeholder="Filter by course"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="enrolled">Enrolled</option>
          <option value="paused">Paused</option>
          <option value="dropped">Dropped</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Course</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(grouped).map(([student, enrollList]) =>
            enrollList.map((enrollment, index) => (
              <tr key={enrollment.id}>
                {/* Show student name once */}
                {index === 0 && (
                  <td rowSpan={enrollList.length}>{student}</td>
                )}

                <td>
                  {courseMap.get(enrollment.course_id) || "Unknown"}
                </td>

                <td className={`status ${enrollment.status}`}>
                  {formatStatus(enrollment.status)}
                </td>

                <td style={{ display: "flex", gap: "6px" }}>
                {/* If enrolled → can Pause or Drop */}
                {enrollment.status === "enrolled" && (
                <>
                  <button
                    onClick={() => handleStatusChange(enrollment.id, "paused")}
                    >
                      Pause
                  </button>

                  <button
                    onClick={() => handleStatusChange(enrollment.id, "dropped")}
                    style={{ background: "red", color: "white" }}
                  >
                    Drop
                  </button>
                  </>
                )}

                {/* If paused → can Resume or Drop */}
                {enrollment.status === "paused" && (
                <>
                <button
                  onClick={() => handleStatusChange(enrollment.id, "enrolled")}
                >
                  Resume
                </button>

                <button
                  onClick={() => handleStatusChange(enrollment.id, "dropped")}
                  style={{ background: "red", color: "white" }}
                >
                  Drop
                </button>
                </>
                )}

                {/* If dropped → can Re-Enroll */}
                {enrollment.status === "dropped" && (
                <button
                  onClick={() => handleStatusChange(enrollment.id, "enrolled")}
                  style={{ background: "green", color: "white" }}
                >
                  Re-Enroll
                </button>
                )}
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EnrollmentTable;



