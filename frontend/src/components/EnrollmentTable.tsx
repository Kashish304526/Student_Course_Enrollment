import { useState, useEffect } from "react";
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
  // Filter states
  const [studentFilter, setStudentFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Map course_id → course_name
  const courseMap = new Map<number, string>(
    courses.map((course) => [course.id, course.course_name])
  );
  // Sorting
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  
  //Pagination
  const PAGE_SIZE = 5; // you can change this

  useEffect(() => {
  setCurrentPage(1);
  }, [studentFilter, courseFilter, statusFilter]);


  // Apply filtering
  const filteredEnrollments = enrollments
  .filter((e) => {
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
  })
  .sort((a, b) => {
    const nameA = a.student_name.toLowerCase().trim();
    const nameB = b.student_name.toLowerCase().trim();

    if (sortOrder === "asc") {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });


  const totalPages = Math.ceil(filteredEnrollments.length / PAGE_SIZE);

  const paginatedEnrollments = filteredEnrollments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );


  // Group by student
  const grouped = paginatedEnrollments.reduce((acc, en) => {
  const normalizedName = en.student_name.toLowerCase().trim();

  if (!acc[normalizedName]) acc[normalizedName] = [];
  acc[normalizedName].push(en);

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

      {/*  Filters and Sorting */}
      <div style={{
          display: "flex",
          gap: "10px",
          marginBottom: "12px",
          alignItems: "center",
          flexWrap: "wrap",
        }}>
        <input style={{ width: "180px" }}
          placeholder="Filter by student"
          value={studentFilter}
          onChange={(e) => setStudentFilter(e.target.value)}
        />

        <input style={{ width: "180px" }}
          placeholder="Filter by course"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        />

        <select style={{ width: "140px" }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="enrolled">Enrolled</option>
          <option value="paused">Paused</option>
          <option value="dropped">Dropped</option>
        </select>
        <select
            style={{ width: "160px" }}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Sort: Student A → Z</option>
            <option value="desc">Sort: Student Z → A</option>
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
  {Object.keys(grouped).length === 0 ? (
    <tr>
      <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
        <img
          src="/no-data.png"
          alt="No data"
          style={{ width: "150px", opacity: 0.6 }}
        />
        <div style={{ marginTop: "10px" }}>No data found</div>
      </td>
    </tr>
  ) : (
    Object.entries(grouped).map(([_, enrollList]) => {
      const displayName = enrollList[0].student_name;

      return enrollList.map((enrollment, index) => (
        <tr key={enrollment.id}>
          {/* Show student name once */}
          {index === 0 && (
            <td rowSpan={enrollList.length}>{displayName}</td>
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
                  onClick={() =>
                    handleStatusChange(enrollment.id, "paused")
                  }
                >
                  Pause
                </button>

                <button
                  onClick={() =>
                    handleStatusChange(enrollment.id, "dropped")
                  }
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
                  onClick={() =>
                    handleStatusChange(enrollment.id, "enrolled")
                  }
                >
                  Resume
                </button>

                <button
                  onClick={() =>
                    handleStatusChange(enrollment.id, "dropped")
                  }
                  style={{ background: "red", color: "white" }}
                >
                  Drop
                </button>
              </>
            )}

            {/* If dropped → can Re-Enroll */}
            {enrollment.status === "dropped" && (
              <button
                onClick={() =>
                  handleStatusChange(enrollment.id, "enrolled")
                }
                style={{ background: "green", color: "white" }}
              >
                Re-Enroll
              </button>
            )}
          </td>
        </tr>
      ));
    })
  )}
</tbody>

      </table>

      {totalPages > 1 && (
  <div
    style={{
      marginTop: "10px",
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      alignItems: "center",
      fontSize: "12px",
      color: "gray",
    }}
  >
    <button style={{fontSize: "12px"}}
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
    >
      Prev
    </button>

    <span>
      Page {currentPage} of {totalPages}
    </span>

    <button style={{fontSize: "12px"}}
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((p) => p + 1)}
    >
      Next
    </button>
  </div>
)}

    </div>
  );
}

export default EnrollmentTable;



