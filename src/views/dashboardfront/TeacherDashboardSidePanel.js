import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import SchoolAPI from '../../api/SchoolAPI'
import { UserContext } from '../../context/UserContext'
import ClassesAPI from '../../api/ClassesAPI'
import ClassesDashboard from './ClassesDashboard'
import CoursesDashboard from './CoursesDashboard'
import ProfileDashboard from './ProfileDashboard'
import CoursesAPI from '../../api/CoursesAPI'

export default function TeacherDashboardSidePanel() {

  const userContext = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState([])
  const [courses, setCourses] = useState([])
  const {user} = userContext.data
  let studentId = user?.student?.id

  const getClasses = async() => {
    setLoading(true)
    let response = await new ClassesAPI().getClasses(user.isTeacher ? user?.teacher?.id : user?.student?.id)
    setLoading(false)
    if(response.ok){
      setClasses(response.data)
    }else{
      alert("Something went wrong while fetching all getClasses")
    }
    setLoading(false)
  }

  const getCourses = async() => {
    setLoading(true)
    let response = await new CoursesAPI().getCoursesTeacher(user?.teacher?.id)
    setLoading(false)
    if(response.ok){
      setCourses(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all getClasses")
    }
    setLoading(false)
  }

  useEffect(() => {
    if(user?.student === null)
      return(
        getClasses(),
        getCourses()
      )
   
  }, [])

  return (
    <React.Fragment>
      <CoursesDashboard />
      <ClassesDashboard />
    </React.Fragment>
  )
}