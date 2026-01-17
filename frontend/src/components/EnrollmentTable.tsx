import type{ Enrollment } from "../types/enrollment";
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

  // Map course_id → course_name
  const courseMap = new Map<number, string>(
    courses.map(course => [course.id, course.course_name])
  );

  // Group enrollments by student
  const grouped = enrollments.reduce((acc, en) => {
    if (!acc[en.student_name]) acc[en.student_name] = [];
    acc[en.student_name].push(en);
    return acc;
  }, {} as Record<string, Enrollment[]>);

  return (
    <div className="card">
      <h2>Enrollments</h2> <br />

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
                  <td rowSpan={enrollList.length}>
                    {student}
                  </td>
                )}

                <td>
                  {courseMap.get(enrollment.course_id) || "Unknown"}
                </td>

                <td
                  className={
                    enrollment.status === "Enrolled"
                      ? "status-enrolled"
                      : "status-dropped"
                  }
                >
                  {enrollment.status}
                </td>

                <td>
                  <button
                    onClick={async () => {
                      const newStatus =
                        enrollment.status === "Enrolled"
                          ? "Dropped"
                          : "Enrolled";

                      await updateEnrollmentStatus(
                        enrollment.id,
                        newStatus
                      );
                      onRefresh();
                    }}
                  >
                    {enrollment.status === "Enrolled"
                      ? "Drop"
                      : "Re-Enroll"}
                  </button>
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


