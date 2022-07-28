import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../../context/UserContext'

export default function SystemAdminLinks({activeHeader}) {
  const userContext = useContext(UserContext)
  const { user } = userContext.data
  const subsType = user.subsType;

  if(user.isSystemAdmin){
    console.log(subsType, '----')
    return (
      <div className="header-links">
        <Link className={activeHeader === "dashboard" && 'active'} to="/system-admin/dashboard">Dashboard</Link>
        {subsType == 'Ebooks' ?
        <Link className={activeHeader === "courses" && 'active'} to="/system-admin/ebooks">Courses</Link>
        :
        <Link className={activeHeader === "courses" && 'active'} to="/system-admin/courses">Courses</Link>
        }
        <Link className={activeHeader === "profile" && 'active'} to="/system-admin/profile">Profile</Link>
        <Link className={activeHeader === "school" && 'active'} to="/system-admin/teachers">School</Link>
        <Link className={activeHeader === "miranda" && 'active'} to="/system-admin/miranda">Miranda</Link>
      </div>
    )
  }
  return <div/>
}
