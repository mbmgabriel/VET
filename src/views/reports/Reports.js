import React, {useState, useEffect, useContext} from 'react'
import MainContainer from '../../components/layouts/MainContainer'
import SideReport from './components/SideReport'
import { UserContext } from './../../context/UserContext'
import {Form,ListGroup, Row, Col} from 'react-bootstrap'
import { Link } from 'react-router-dom';
import ClassesAPI from './../../api/ClassesAPI'

export default function Reports({children}) {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState(null)
  const [classId, setClassId] = useState('')
  const currentLoc = window.location.pathname;

  useEffect(() => {
    const pageURL = new URL(window.location.href);
    let currentClassId = pageURL.searchParams.get("classId");
    setClassId(currentClassId)

    if (user.isStudent) return (window.location.href = "/404");
  }, []);

  useEffect(() => {
    if(user.role === "Teacher"){
      getClasses()
    }else if(user.role === "Student"){
      getClassesStudent()
    }

  }, [])

  const getClasses = async() => {
    let response = await new ClassesAPI().getClasses(user.teacher.id)
    if(response.ok){
      setClasses(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
  }

  const getClassesStudent = async() => {
    let response = await new ClassesAPI().getClasses(user.student.id)
    if(response.ok){
      setClasses(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
  }

  const onShowClassModules = (e) => {
    
    sessionStorage.removeItem("taskName")
    sessionStorage.removeItem("assignmentName")
    // setShowReportHeader(false)
    setSelectedClassId(e.target.value)
    // setViewTestReport(true)
    // setViewTaskReport(true)
    // setViewInteractiveReport(true)
  }

  const addClassIdOnParams = (id) => {
    let newURL = new URL(window.location);
    newURL.searchParams.set('classId', id);
    window.history.pushState(null, '', newURL.toString());
    setClassId(id);
    if(window.location.pathname !== '/reports'){
      window.location.reload();
    }
  }

  return (
    <MainContainer activeHeader={'reports'} fluid style='not-scrollable'> 
      {/* <SideReport/> */}
      <Col style={{height: 100}} />
      <Row>
        <Col sm={3}>
          <ListGroup.Item className="list-group-item-o">
            <Form.Select value={classId} onChange={(e) => addClassIdOnParams(e.target.value)}>
              <option value="">-- Select Class Here --</option>
              {classes.map(item =>{
                return (<option value={item?.classId} > {item?.className}</option>)
              })}
            </Form.Select>
          </ListGroup.Item>
          <ListGroup style={{paddingLeft:'15px'}}>
            <Link className={currentLoc.includes('reports/exam') ? "active-nav-item" : 'nav-item'} to={`/reports/exam?classId=${classId}`}>
              Exam
            </Link>
            <Link className={currentLoc.includes('reports/assignment') ? "active-nav-item" : 'nav-item'} to={`/reports/assignment?classId=${classId}`}>
              Assignment
            </Link>
            <Link className={currentLoc.includes('reports/task') ? "active-nav-item" : 'nav-item'} to={`/reports/task?classId=${classId}`}>
              Task
            </Link>
            <Link className={currentLoc.includes('reports/interactive') ? "active-nav-item" : 'nav-item'} to={`/reports/interactive?classId=${classId}`}>
              Interactive
            </Link>
          </ListGroup>
        </Col>
        <Col sm={9}>
          {children}
        </Col>
      </Row>
    </MainContainer>
  )
}
