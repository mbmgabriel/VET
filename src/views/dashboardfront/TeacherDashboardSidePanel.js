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
  const [studentClasses, setStudentClasses] = useState([])
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

  const getClassesStudent = async() => {
    setLoading(true)
    let response = await new ClassesAPI().getClassesStudent(studentId)
    setLoading(false)
    if(response.ok){
      setStudentClasses(response.data)
    }else{
      alert("Something went wrong while fetching all getClassesStudent")
    }
  }

  useEffect(() => {
    if(user?.teacher === null)
      return(
        getClassesStudent()
      )
   
  }, [])


  const classesCount = studentClasses.length

  return (
    <React.Fragment>
      {user?.isStudent && 
        <>
        <div className='dashboard-content mb-2'>
          <div className="dashboard-content-item rounded  bg-white" >
            <div className='analytics-label' style={{color:"#EE9337"}}>
              <div className='analytics-icon'><i className="fas fa-project-diagram "></i></div>
              <h5 className="color-black my-0 ml-5">Classes</h5>
            </div>
              <h2 className='color-black analytics-value h2 text-align-right'>{classesCount}</h2>
          </div>
          </div>
        </>
      }
      <ClassesDashboard studentClasses={studentClasses}  />
      {user?.isTeacher && 
        <>
           <CoursesDashboard />
        </>
      }
     
    </React.Fragment>
  )
}