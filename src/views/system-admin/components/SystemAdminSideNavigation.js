import React from 'react'
import { Link } from 'react-router-dom'

export default function SystemAdminSideNavigation({active}) {
  return (
    <div className="side-navigation">
      <Link to="/system-admin/school-profile" className={`side-navigation-item ${active === "school-profile" ? "active" : ""}`}>School Profile</Link>
      <Link to="/system-admin/students" className={`side-navigation-item ${active === "students" ? "active" : ""}`}>Students</Link>
      <Link to="/system-admin/teachers" className={`side-navigation-item ${active === "teachers" ? "active" : ""}`}>Teachers</Link>
    </div>
  )
}
