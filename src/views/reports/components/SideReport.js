import React, {useState, useEffect, useContext} from 'react'
import {ListGroup, Tab, Row, Col, Form} from 'react-bootstrap'
import ReportHeader from './ReportHeader'
import AssignmentHeader from './AssignmentHeader'
import { UserContext } from './../../../context/UserContext'
import ClassesAPI from './../../../api/ClassesAPI'
import TaskHeader from './TaskHeader'
import InteractiveHeader from './InteractiveHeader'

function SideReport() {

  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [classes, setClasses] = useState([])
  const [classesModules, setClassesModules] = useState([])
  const [classId, setClassId] = useState([])
  const [selectedClassId, setSelectedClassId] = useState(null)
  const [viewTestReport, setViewTestReport] = useState(false)
  const [viewAssignmentReport, setViewAssignmentReport] = useState(false)
  const [viewTaskReport, setViewTaskReport] = useState(false)

  const [showReportHeader, setShowReportHeader] = useState(false)
  const [showAssignmentHeader, setShowAssignmentHeader] = useState(false)
  const [showTaskHeader, setShowTaskHeader] = useState(false)
  const [showInteractiveHeader, setShowInteractiveHeader] = useState(false)

  const [viewInteractiveReport, setViewInteractiveReport] = useState(false)

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

  const getClassModules = async(selectedClassId) => {
    console.log(selectedClassId)
    let response = await new ClassesAPI().getClassModules(selectedClassId)
    if(response.ok){
      setClassesModules(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
  }

  
  const onShowClassModules = (e) => {
    
    sessionStorage.removeItem("taskName")
    sessionStorage.removeItem("assignmentName")
    setShowReportHeader(false)
    setSelectedClassId(e.target.value)
    setViewTestReport(true)
    setViewTaskReport(true)
    setViewInteractiveReport(true)
    if(e.target.value == null || e.target.value == ""){
      setViewTestReport(true)
      setViewTaskReport(true)
      setViewAssignmentReport(true)
      setViewAssignmentReport(true)
      setViewInteractiveReport(true)
      setClassesModules([])
    }else{
      setViewTestReport(true)
      setViewTaskReport(true)
      setViewAssignmentReport(true)
      setViewInteractiveReport(true)
      getClassModules(e.target.value)
      sessionStorage.setItem("classId", e.target.value)
    }
  }

  const showTest = (e) => {
    setViewTestReport(true)
    setViewAssignmentReport(false)
    setViewTaskReport(false)
    setShowReportHeader(false)
    setViewInteractiveReport(false)
    sessionStorage.removeItem("testName")
  }

  const showAssignment = (e) => {
    setViewAssignmentReport(true)
    setViewTestReport(false)
    setViewTaskReport(false)
    setShowAssignmentHeader(false)
    setViewInteractiveReport(false)
    sessionStorage.removeItem("assignmentName")
  }

  const showTask = (e) => {
    setViewTaskReport(true)
    setViewAssignmentReport(false)
    setViewTestReport(false)
    setShowTaskHeader(false)
    setViewInteractiveReport(false)
    sessionStorage.removeItem("taskName")
  }

  const showInteractive = (e) => {
    setViewInteractiveReport(true)
    setViewTaskReport(false)
    setViewAssignmentReport(false)
    setViewTestReport(false)
    setShowReportHeader(false)
    sessionStorage.removeItem("taskName")
  }

  useEffect(() => {
    if(user.role === "Teacher"){
      getClasses()
    }else if(user.role === "Student"){
      getClassesStudent()
    }

  }, [])

  return (
    <Tab.Container className="course-widget-font" id="list-group-tabs-example " defaultActiveKey="#link1">
        <div className="row">
          <div className="report-sidenav col-md-3">
              <ListGroup.Item className="list-group-item-o">
                <Row>
								<Form.Select onChange={onShowClassModules}>
                <option value="">-- Select Class Here --</option>
                {classes.map(item =>{
                  return (<option value={item?.classId} > {item?.className}</option>)
                })}
              </Form.Select>
                </Row>
              </ListGroup.Item>
            <ListGroup style={{paddingLeft:'15px'}}>
              <ListGroup.Item  className="list-group-item-o "action href="#link3" onClick={showTest}>
                Exam
              </ListGroup.Item>
              <ListGroup.Item className="list-group-item-o " action href="#link5" onClick={showAssignment}>
                Assignment
              </ListGroup.Item>
              <ListGroup.Item className="list-group-item-o " action href="#link6" onClick={showTask}>
                Task
              </ListGroup.Item>
              <ListGroup.Item className="list-group-item-o " action href="#link7" onClick={showInteractive} >
                Interactive
              </ListGroup.Item>
            </ListGroup>
          </div>
          
					<Col sm={9} className='scrollable vh-90 pb-5'>
            <Tab.Content>
              <Tab.Pane eventKey="#link1">
              </Tab.Pane>
              <Tab.Pane className='content-pane report-content'  eventKey="#link3">
                <ReportHeader showReportHeader={showReportHeader} setShowReportHeader={setShowReportHeader} viewTestReport={viewTestReport} setViewTestReport={setViewTestReport} classesModules={classesModules} setClassesModules={setClassesModules} selectedClassId={selectedClassId}/>
              </Tab.Pane>
              <Tab.Pane className='content-pane report-content' eventKey="#link5">
                <AssignmentHeader showAssignmentHeader={showAssignmentHeader} setShowAssignmentHeader={setShowAssignmentHeader} viewAssignmentReport={viewAssignmentReport} setViewAssignmentReport={setViewAssignmentReport} classesModules={classesModules} setClassesModules={setClassesModules} selectedClassId={selectedClassId}/>
              </Tab.Pane>
              <Tab.Pane className='content-pane report-content' eventKey="#link6">
                <TaskHeader showTaskHeader={showTaskHeader} setShowTaskHeader={setShowTaskHeader} viewTaskReport={viewTaskReport} setViewTaskReport={setViewTaskReport} classesModules={classesModules} setClassesModules={setClassesModules} selectedClassId={selectedClassId}/>
              </Tab.Pane>
              <Tab.Pane className='content-pane report-content' eventKey="#link7">
                <InteractiveHeader showInteractiveHeader={showInteractiveHeader} setShowInteractiveHeader={setShowInteractiveHeader} viewInteractiveReport={viewInteractiveReport} setViewInteractiveReport={setViewInteractiveReport} classesModules={classesModules} setClassesModules={setClassesModules} selectedClassId={selectedClassId}/>
              </Tab.Pane>
            </Tab.Content> 
          </Col> 
        </div>
      </Tab.Container>

      
  )
}
export default SideReport