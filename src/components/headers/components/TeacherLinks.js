import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../../context/UserContext'

export default function TeacherLinks({activeHeader}) {
  const userContext = useContext(UserContext)
  const { user } = userContext.data
  
  if(user.isTeacher){
    return (
      <div className="header-links">
        <Link className={activeHeader === "teacherdashboard" && 'active'} to="/teacherdashboard">Dashboard</Link> 
        <Link className={activeHeader === "courses" && 'active'} to="/courses">Courses</Link> 
        <Link className={activeHeader === "classes" && 'active'} to="/classes">Classes</Link>
        <Link className={activeHeader === "files" && 'active'} to="/files">Files</Link> 
        <Link className={activeHeader === "reports" && 'active'} to="/reports">Reports</Link>
      </div>
    )
  }
  
  return <div/>
}
