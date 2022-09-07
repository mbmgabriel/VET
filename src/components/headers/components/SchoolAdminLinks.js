import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../../context/UserContext'

export default function SchoolAdminLinks({activeHeader}) {
  const userContext = useContext(UserContext)
  const { user } = userContext.data;
  const subsType = user.subsType;
  
  if(user.isSchoolAdmin){
    return (
      <div className="header-links">
        {
          subsType.includes('LMS') || subsType == 'ContainerwithTR' ?
          <>
            <Link className={activeHeader === "dashboard" && 'active'} to="/admin_dashboard">Dashboard</Link>
            <Link className={activeHeader === "school" && 'active'} to="/school">School</Link>
            <Link className={activeHeader === "grading" && 'active'} to="/admin/grading">Grading</Link>
            <Link className={activeHeader === "courses" && 'active'} to="/courses">Courses</Link>
            <Link className={activeHeader === "classes" && 'active'} to="/schoolAdminClasses">Classes</Link>
          </>
          :
          null
        }
        {
          subsType === 'Interactives' &&
          <>
            <Link className={activeHeader === "dashboard" && 'active'} to="/admin_dashboard">Dashboard</Link>
            <Link className={activeHeader === "school" && 'active'} to="/school">School</Link>
            <Link className={activeHeader === "grading" && 'active'} to="/admin/grading">Grading</Link>
            <Link className={activeHeader === "courses" && 'active'} to="/courses">Courses</Link>
            {/* <Link className={activeHeader === "classes" && 'active'} to="/schoolAdminClasses">Classes</Link> */}
          </>
        }
        {
          subsType === 'InteractivesandLearn' &&
          <>
            <Link className={activeHeader === "dashboard" && 'active'} to="/admin_dashboard">Dashboard</Link>
            <Link className={activeHeader === "school" && 'active'} to="/school">School</Link>
            {/* <Link className={activeHeader === "grading" && 'active'} to="/admin/grading">Grading</Link> */}
            <Link className={activeHeader === "courses" && 'active'} to="/courses">Courses</Link>
            {/* <Link className={activeHeader === "classes" && 'active'} to="/schoolAdminClasses">Classes</Link> */}
          </>
        }
        {
          subsType === 'Ebooks' &&
          <>
            <Link className={activeHeader === "dashboard" && 'active'} to="/admin_dashboard">Dashboard</Link>
            <Link className={activeHeader === "school" && 'active'} to="/school">School</Link>
            <Link className={activeHeader === "courses" && 'active'} to="/courses">Courses</Link>
          </>
        }
        {
          subsType === 'TeacherResources' &&
          <>
            <Link className={activeHeader === "dashboard" && 'active'} to="/admin_dashboard">Dashboard</Link>
            <Link className={activeHeader === "school" && 'active'} to="/school">School</Link>
            <Link className={activeHeader === "courses" && 'active'} to="/courses">Courses</Link>
          </>
        }

      </div>
    )
  }
  return <div/>
}
