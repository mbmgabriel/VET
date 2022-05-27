import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import SchoolAPI from '../../api/SchoolAPI'
import { UserContext } from '../../context/UserContext'
import CoursesAPI from '../../api/CoursesAPI'

export default function CoursesDashboard() {

  const userContext = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState([])
  const {user} = userContext.data
  let studentId = user?.student?.id

  const getCourses = async() => {
    setLoading(true)
    let response = await new CoursesAPI().getCoursesTeacher(user?.teacher?.id)
    setLoading(false)
    if(response.ok){
      setCourses(response.data)
    }else{
      alert("Something went wrong while fetching all getcourses")
    }
    setLoading(false)
  }

  useEffect(() => {
    if(user?.student === null)
      return(
        getCourses()
      )
   
  }, [])

  return (
    <React.Fragment>
    <div className='dash-side-panel'>
      <Row>
        <Col sm={9}> 
          <div className='dash-title-header'>My courses</div>
        </Col> 
        <Col sm={3}> 
        <div className='dash-view-all'><Link to={`/courses`}>View all</Link></div>
          {/* <div><i className="fa fa-ellipsis-h"></i></div> */}
        </Col> 
      </Row>
      {courses?.courses?.length?
        courses.courses.slice(0,8).map(item => {
          return(
            <React.Fragment>
              {/* <span className='dash-content'>{item?.courseName}</span><br></br> */}
              <div className='dash-content' >
              <Link to={`coursecontent/${item.id}/learn`}>{item?.courseName}</Link>
              </div>
            </React.Fragment>
          )
        })
        :
        <span>No courses Found</span>
      }
    </div>
    </React.Fragment>
  )
}