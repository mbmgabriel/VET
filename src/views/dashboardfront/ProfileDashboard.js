import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import SchoolAPI from '../../api/SchoolAPI'
import { UserContext } from '../../context/UserContext'
import ClassesAPI from '../../api/ClassesAPI'

export default function ProfileDashboard() {

  const userContext = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState([])
  const {user} = userContext.data
  let studentId = user?.student?.id

  return (
    <React.Fragment>
    <div className='dash-side-panel'>
      <span className="user-name">{user?.name}</span><br></br>
        {user.isStudent && 
        <>
        <Link className="dash-classtitle" to={`/profile/${user?.student?.id}`}>See your profile</Link>
        </>
        }
        {user.isTeacher && 
        <>
        <Link className="dash-classtitle" to={`/profile/${user?.teacher?.id}`}>See your profile</Link>
        </>
      }
    </div>
    </React.Fragment>
  )
}