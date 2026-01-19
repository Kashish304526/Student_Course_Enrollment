import { useEffect, useState } from "react";
import CourseList from "./components/CourseList";
import EnrollmentForm from "./components/EnrollmentForm";
import EnrollmentTable from "./components/EnrollmentTable";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";


import { getCourses } from "./api/courseApi";
import { getEnrollments } from "./api/enrollmentApi";

import type{ Course } from "./types/course";
import type{ Enrollment } from "./types/enrollment";

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const fetchCourses = () => {
    getCourses().then(res => setCourses(res.data));
  };

  const fetchEnrollments = () => {
    getEnrollments().then(res => setEnrollments(res.data));
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, []);

  return (
    <>
      <Navbar />

      <div className="container">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/courses" />}
          />

          <Route
            path="/courses"
            element={
              <>
                <CourseList
                  courses={courses}
                  enrollments={enrollments}
                  onCourseChange={fetchCourses}
                />
              </>
            }
          />

          <Route
            path="/enrollments"
            element={
              <>
                <EnrollmentForm
                  courses={courses}
                  onEnroll={fetchEnrollments}
                />

                <EnrollmentTable
                  enrollments={enrollments}
                  courses={courses}
                  onRefresh={fetchEnrollments}
                />
              </>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;

