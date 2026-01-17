import { useEffect, useState } from "react";
import CourseList from "./components/CourseList";
import EnrollmentForm from "./components/EnrollmentForm";
import EnrollmentTable from "./components/EnrollmentTable";

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
    <div className="container">
      <h1 className="title">Student Course Enrollment System</h1>

      <CourseList courses={courses} onCourseChange={fetchCourses} />

      <EnrollmentForm
        courses={courses}
        onEnroll={fetchEnrollments}
      />

      <EnrollmentTable
        enrollments={enrollments}
        courses={courses}
        onRefresh={fetchEnrollments}
      />


    </div>
  );
}

export default App;

