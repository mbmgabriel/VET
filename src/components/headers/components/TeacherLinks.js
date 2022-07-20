import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../../context/UserContext'

export default function TeacherLinks({activeHeader}) {
  const userContext = useContext(UserContext)
  const { user } = userContext.data
  const subsType = localStorage.getItem('subsType');
  if(user.isTeacher){
    return (
      <div className="header-links">
        {subsType == 'LMS' && 
          <>
            <Link className={activeHeader === "teacherdashboard" && 'active'} to="/teacherdashboard">Dashboard</Link> 
            <Link className={activeHeader === "courses" && 'active'} to="/courses">Courses</Link> 
            <Link className={activeHeader === "classes" && 'active'} to="/classes">Classes</Link>
            <Link className={activeHeader === "files" && 'active'} to="/files">Files</Link> 
            <Link className={activeHeader === "reports" && 'active'} to="/reports">Reports</Link>
          </>
        }
        {
          subsType == 'Ebooks' && 
          <>
            <Link className={activeHeader === "courses" && 'active'} to="/courses">Courses</Link> 
            <Link className={activeHeader === "classes" && 'active'} to="/classes">Classes</Link>
          </>
        }
        {
          subsType == 'TeacherResources' && 
          <Link className={activeHeader === "courses" && 'active'} to="/courses">Courses</Link> 
        }
      </div>
    )
  }
  
  return <div/>
}
