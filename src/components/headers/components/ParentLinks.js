import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../../context/UserContext'

export default function ParentLinks({activeHeader}) {
  const userContext = useContext(UserContext)
  const { user } = userContext.data
  
  if(user.isParent){
    return (
      <div className="header-links">
        <Link className={activeHeader === "dashboard" && 'active'} to="/parent/dashboard">Dashboard</Link>
        <Link className={activeHeader === "profile" && 'active'} to="/parent/profile">Profile</Link>
      </div>
    )
  }
  return <div/>
}
