import { NavLink } from "react-router-dom";
import "../index.css";

function Navbar() {
    
  return (
    <div className="navbar">
      <h3>Student Course Enrollment System</h3>

      <div className="nav-links">
        <NavLink to="/courses" className="nav-item">
          Courses
        </NavLink>

        <NavLink to="/enrollments" className="nav-item">
          Enrollments
        </NavLink>
      </div>
    </div>
  );
}

export default Navbar;
