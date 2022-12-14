import React from 'react'
import { Link } from 'react-router-dom'

export default function AdminSideNavigation({active}) {
  return (
    <div className="side-navigation">
      <Link to="school" className={`side-navigation-item ${active === "school-profile" ? "active" : ""}`}>School Profile</Link>
      <Link to="schoolannouncement" className={`side-navigation-item ${active === "schoolannouncement" ? "active" : ""}`}>Announcement</Link>
      <Link to="studentsList" className={`side-navigation-item ${active === "students" ? "active" : ""}`}>Students</Link>
      <Link to="schoolTeacher" className={`side-navigation-item ${active === "schoolTeacher" ? "active" : ""}`}>Teachers</Link>
      <Link to="terms" className={`side-navigation-item ${active === "terms" ? "active" : ""}`}>Grading Terms</Link>
      <Link to="academicTerm" className={`side-navigation-item ${active === "academicTerm" ? "active" : ""}`}>School Year</Link>
      <Link to="schoolAdmin" className={`side-navigation-item ${active === "schooladmins" ? "active" : ""}`}>School Admins</Link>
    </div>
  )
}
