import React, { useContext, useEffect } from 'react'
import { Route } from 'react-router'
import { UserContext } from '../../context/UserContext'

export default function AuthRoute(props) {

  const userContext = useContext(UserContext)
  const {user} = userContext.data
  useEffect(() => {
    if(user != null){
      if(user.isSchoolAdmin) return window.location.href = "/dashboard"
      if(user.isParent) return window.location.href = "/parent/dashboard"
      if(user.isSystemAdmin) return window.location.href = "/system-admin/dashboard"
      window.location.href = '/teacherdashboard'
    }
  }, [user])

  if(user == null) return (
    <Route {...props}/>
  )
  return <div/>
}
