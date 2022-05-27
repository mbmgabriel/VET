import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import SchoolAPI from '../../api/SchoolAPI'
import { UserContext } from '../../context/UserContext'
import ClassesAPI from '../../api/ClassesAPI'
import CoursesAPI from '../../api/CoursesAPI'
import CalendarDashboard from './CalendarDashboard'

export default function SummaryDashboard() {

  const userContext = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState([])
  const [courses, setCourses] = useState([])
  const {user} = userContext.data

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
      setCourses(response.data.courses)
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

	const classesCount = classes.length
  const coursesCount = courses.length
		

  return (
    <React.Fragment>
    <div className='dashboard-content mb-5 mt-3'>
			<div className="dashboard-content-item rounded shadow bg-white" >
				<div className='analytics-label'>
					<div className='analytics-icon'><i className="fas fa-user-graduate "></i></div>
					<h5 className="color-black my-0 ml-5">Students</h5>
				</div>
				<h2 className='color-secondary analytics-value h2 text-align-right'>145,322</h2>
			</div>
			<div className="dashboard-content-item rounded shadow bg-white" >
				<div className='analytics-label' style={{color:"#EE9337"}}>
					<div className='analytics-icon'><i className="fas fa-chalkboard-teacher "></i></div>
					<h5 className="color-black my-0 ml-5">Courses</h5>
				</div>
				<h2 className='color-black analytics-value h2 text-align-right'>{coursesCount}</h2>
			</div>
			<div className="dashboard-content-item rounded shadow bg-white" >
				<div className='analytics-label' style={{color:"#EE9337"}}>
					<div className='analytics-icon'><i className="fas fa-project-diagram "></i></div>
					<h5 className="color-black my-0 ml-5">Classes</h5>
				</div>
				<h2 className='color-black analytics-value h2 text-align-right'>{classesCount}</h2>
			</div>
      {/* <div className="dashboard-content-item rounded shadow bg-white" >
				<div className='analytics-label' style={{color:"#EE9337"}}>
					<div className='analytics-icon'><i className="fas fa-user "></i></div>
					<h5 className="color-black my-0 ml-5">Profile</h5>
				</div>
				<h2 className='color-black analytics-value h2 text-align-right'></h2>
			</div> */}
      <Col sm={3}>
        <CalendarDashboard />
      </Col>
		</div>
    </React.Fragment>
  )
}