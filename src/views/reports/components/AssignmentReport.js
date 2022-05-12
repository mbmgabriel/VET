import React, { useState } from 'react'
import {Accordion, Row, Col, Button} from 'react-bootstrap'
import AssignmentContent from './AssignmentContent'
import AssignmentReportContent from '../contents/AssignmentReportContent'
import ClassesAPI from './../../../api/ClassesAPI'

function AssignmentReport({filter, setFilter, classesModules, setClassesModules, selectedClassId, viewAssignmentReport, setViewAssignmentReport, showAssignmentHeader, setShowAssignmentHeader}) {

const [assignmentPerModule, setAssignmentPerModule] = useState([])
const [assignmentReport, setAssignmentReport] = useState([])
const [open, setOpen] = useState(false)
const [loading, setLoading] = useState(false)

const handleOpen = e =>{
    e.preventDefault()
    setOpen(true)
}

const getClassAssignmentModules = async(e, moduleId) => {
  console.log(selectedClassId)
  sessionStorage.setItem('assignmentModuleId', moduleId)
  let sessionModuleId = sessionStorage.getItem('assignmentModuleId')
  let response = await new ClassesAPI().getClassAssignmentModules(selectedClassId, sessionModuleId)
  if(response.ok){
    setAssignmentPerModule(response.data)
    console.log(response.data)
  }else{
    alert("Something went wrong while fetching all courses")
  }
}

const assignmentColumns = () => {
  if(assignmentReport.length > 0){ 
    return assignmentReport[0].columnAssignments?.map(item => item.assignmentName) || []
  }
  return []
}

const getAssignmentReport = async(e, assignmentid, assignmentname) => {
  setLoading(true)
  sessionStorage.setItem('assignmentName',assignmentname)
  sessionStorage.setItem('assignmentId',assignmentid)
  setViewAssignmentReport(false)
  console.log(viewAssignmentReport)
  let response = await new ClassesAPI().getAssignmentReport(selectedClassId, assignmentid)
  setLoading(false)
  if(response.ok){
    setAssignmentReport(response.data)
    console.log(response.data)
  }else{
    alert(response.data.errorMessage)
  }
}
if(viewAssignmentReport === true){
  return (
    <div> 
        <Accordion>
        {classesModules.map(item => {
          return(
            <Accordion.Item eventKey={item.id}>
            <Accordion.Header onClick={(e) => getClassAssignmentModules(e, item.id)}><div className='unit-exam'>{item.moduleName} </div></Accordion.Header>
              <Accordion.Body>
                {assignmentPerModule.filter(item =>
                  item.assignment.assignmentName.toLowerCase().includes(filter.toLowerCase())).map
                  ((item, index) => {
                return(
                  item.classAssignment !== null &&
                  <Row>
                    <Col sm={8}>
                      <div className='title-exam' onClick={(e) => getAssignmentReport(e, item.assignment.id, item.assignment.assignmentName)}>
                        {item.assignment.assignmentName}
                      </div>
                      {/* <div className='code-exam'>
                        EQF1
                      </div> */}
                    </Col>
                    <Col sm={9} className='instruction-exam' >
                      <div dangerouslySetInnerHTML={{ __html: item?.assignment?.instructions }} />
                    </Col>
                    <Col sm={3} className='icon-exam'>
                      {/* <i class="fas fa-eye" style={{paddingRight:'10px'}} ></i>{' '}
                      <i class="fas fa-edit"style={{paddingRight:'10px'}}></i>
                      <i class="fas fa-trash-alt" style={{paddingRight:'10px'}}></i> */}
                    </Col>
                    <hr></hr>
                  </Row>
                  )
                })
              }
              </Accordion.Body>
            </Accordion.Item>
            )
          })
          }
          </Accordion>    
    </div>
  )}else{
    return(
      <AssignmentReportContent showAssignmentHeader={showAssignmentHeader} setShowAssignmentHeader={setShowAssignmentHeader} assignmentColumns={assignmentColumns()} setAssignmentReport={setAssignmentReport} assignmentReport={assignmentReport}/>
    )
  }
  
}
export default AssignmentReport
