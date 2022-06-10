import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import SchoolAPI from '../../api/SchoolAPI'
import { UserContext } from '../../context/UserContext'
import ClassesAPI from '../../api/ClassesAPI'

export default function CalendarDashboard() {

  const userContext = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState([])
  const {user} = userContext.data
  let studentId = user?.student?.id

  return (
    <React.Fragment>
    <div className='dash-side-panel'>
      <div className="dash-title-header">Calendar</div><br></br>
    </div>
    </React.Fragment>
  )
}