import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../../context/UserContext'

export default function SchoolAdminLinks({activeHeader}) {
  const userContext = useContext(UserContext)
  const { user } = userContext.data
  
  if(user.isSchoolAdmin){
    return (
      <div className="header-links">
        <Link className={activeHeader === "dashboard" && 'active'} to="/dashboard">Dashboard</Link>
        <Link className={activeHeader === "school" && 'active'} to="/school">School</Link>
      </div>
    )
  }
  return <div/>
}
