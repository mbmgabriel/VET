import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import SchoolAPI from '../../api/SchoolAPI'
import { UserContext } from '../../context/UserContext'
import ClassesAPI from '../../api/ClassesAPI';
import AcademicTermAPI from '../../api/AcademicTermAPI';

export default function ClassesDashboard({studentClasses}) {

  const userContext = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState([])
  const [currentAcademicTerm, setCurrentAcademicTerm] = useState('');

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

  const getAcademicTerm = async () =>{
    let response = await new AcademicTermAPI().fetchAcademicTerm()
    if(response.ok){
      let data = response.data;
      let temp = localStorage.getItem('academicTerm')
      let obj = data.find(o => o.isCurrentTerm === true);
      if(temp === null) {
        setCurrentAcademicTerm(temp ? temp : obj.academicTermName);
        localStorage.setItem('academicTerm', obj.academicTermName);
      }
    }
  }

  useEffect(() => {
    let temp = localStorage.getItem('academicTerm')
    setCurrentAcademicTerm(temp)
    getAcademicTerm();
    if(user?.student === null)
      return(
        getClasses()
      )
   
  }, [])

  return (
    <React.Fragment>
    <div className='dash-side-panel'>
      <Row>
        <Col sm={9}> 
          <div className='dash-title-header'>My Classes</div>
        </Col> 
        <Col sm={3}> 
        <div className='dash-view-all'><Link to={`/classes`}>View all</Link></div>
          {/* <div><i className="fa fa-ellipsis-h"></i></div>  */}
        </Col> 
      </Row>
      {user?.isTeacher &&
      <>
        {classes.length?
          classes.slice(0, 8).map(item => {
            return(
              item.termName == currentAcademicTerm && <React.Fragment>
                <div className='dash-content' >
                  <Link to={`/classescontent/${item.classId}/feed`}>{item?.className}</Link>
                </div>
              </React.Fragment>
            )
          })
          :
          <span>No Classes Found</span>
        }
      </>
      }
      {user?.student &&
      <>
        {studentClasses.length? 
          studentClasses.slice(0, 8).map(item => {
            return(
              <>
              <div className='dash-content' >
                <Link to={`/classescontent/${item.classId}/feed`}>{item?.className}</Link>
              </div>
              </>
            )
          }):
          <span>No Classes Found</span>
      }
      </>
      }
    </div>
    </React.Fragment>
  )
}