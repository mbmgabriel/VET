import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import SchoolAPI from '../../api/SchoolAPI'
import { UserContext } from '../../context/UserContext'
import ClassesAPI from '../../api/ClassesAPI'

export default function ClassesDashboard() {

  const userContext = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState([])
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

  useEffect(() => {
    if(user?.student === null)
      return(
        getClasses()
      )
   
  }, [])

  return (
    <React.Fragment>
    <div className='dash-side-panel'>
      <Row>
        <Col sm={11}> 
          <div className='dash-title-header'>My Classes</div>
        </Col> 
        <Col sm={1}> 
          <div><i className="fa fa-ellipsis-h"></i></div>
        </Col> 
      </Row>
      {classes.length?
        classes.map(item => {
          return(
            <React.Fragment>
              <Link className='dash-content' to={`/classescontent/${item.classId}/feed`}>{item?.className}</Link>
              <br></br>
            </React.Fragment>
          )
        })
        :
        <span>No Classes Found</span>
      }
    </div>
    </React.Fragment>
  )
}