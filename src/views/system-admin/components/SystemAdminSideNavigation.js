import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../../context/UserContext'

export default function SystemAdminSideNavigation({active}) {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const subsType = user.subsType;
  return (
    <div className="side-navigation">
      <Link to="/system-admin/school-profile" className={`side-navigation-item ${active === "school-profile" ? "active" : ""}`}>School Profile</Link>
      <Link to="/system-admin/students" className={`side-navigation-item ${active === "students" ? "active" : ""}`}>Students</Link>
      <Link to="/system-admin/teachers" className={`side-navigation-item ${active === "teachers" ? "active" : ""}`}>Teachers</Link>
      <Link to="/system-admin/school_admin" className={`side-navigation-item ${active === "school_admin" ? "active" : ""}`}>School Admin</Link>
      {/* {subsType == 'Ebooks' && */}
       {/* <Link to="/system-admin/ebooks" className={`side-navigation-item ${active === "ebooks" ? "active" : ""}`}>Ebooks</Link> */}
       {/* } */}
    </div>
  )
}
