import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../../context/UserContext'

export default function SystemAdminLinks({activeHeader}) {
  const userContext = useContext(UserContext)
  const { user } = userContext.data
  
  if(user.isSystemAdmin){
    return (
      <div className="header-links">
        <Link className={activeHeader === "dashboard" && 'active'} to="/system-admin/dashboard">Dashboard</Link>
        <Link className={activeHeader === "profile" && 'active'} to="/system-admin/profile">Profile</Link>
        <Link className={activeHeader === "school" && 'active'} to="/system-admin/teachers">School</Link>
      </div>
    )
  }
  return <div/>
}
