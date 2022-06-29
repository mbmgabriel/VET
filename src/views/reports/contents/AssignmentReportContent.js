import React, {useState, useEffect, useContext} from 'react'
import {Accordion, Row, Col, Table} from 'react-bootstrap'
import { UserContext } from './../../../context/UserContext'
import ClassesAPI from './../../../api/ClassesAPI'
import AssignmentAnalysis from './AssignmentAnalysis'

function AssignmentReportContent({showAssignmentHeader, setShowAssignmentHeader, selectedClassId, viewAssignmentReport, setViewAssignmentReport, assignmentReport, setAssignmentReport, assignmentColumns = ["header 1", "header 2"]}) {
  
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [assignmentAnalysis, setAssignmentAnalysis] = useState([])
  const [showAssignmentAnalysis, setShowAssignmentAnalysis] = useState(false)

  let sessionClass = sessionStorage.getItem("classId")
  let sessionAssignmentId = sessionStorage.getItem("assignmentId")

  const getAssignmentAnalysis = async(e, studentid, classid, assignmentid) => {
    console.log(selectedClassId)
    
    sessionStorage.setItem('analysis','true')
    sessionStorage.setItem('studentid',studentid)
    setShowAssignmentAnalysis(true)
    console.log(showAssignmentAnalysis)
    let response = await new ClassesAPI().getAssignmentAnalysis(studentid, sessionClass, assignmentid)
    if(response.ok){
      setAssignmentAnalysis(response.data)
      console.log(response.data)
      
    }else{
      alert(response.data.errorMessage)
    }
  }

  useEffect(() => {
    setShowAssignmentHeader(true)
  }, [])

  if(showAssignmentAnalysis === false){
  return(
    <>
    {user.student === null ?
    <Table hover size="lg" responsive>
      <thead>
        <tr>
          <th>Student Name</th>
          {/* {assignmentReport.map(item =>{
            return(
            item.columnAssignments.map(as =>{
                return(
                <th>{as.assignmentName}</th>
                )
              })
            )
          })} */}
          {assignmentColumns.map((item, index) => {
            return (
              <th key={index}>{item}</th>
            )
          })}
        </tr>
      </thead>
      <tbody>
      {assignmentReport.map(item =>{
          return (
            <tr>
              {item.studentAssignments.map(st =>{
                
              return (
                <>
                <td><i class="fas fa-user-circle td-icon-report-person"></i> 
                  <span style={{cursor:'pointer'}} onClick={(e) => getAssignmentAnalysis(e, item.student.id, sessionClass, sessionAssignmentId)}>{item.student.lname}, {item.student.fname}</span>
                </td>
                <td>{st.score} </td>
                </>
                )
            })}
            </tr>
          )
        })
      }
      </tbody>
    </Table>
    :
    <div onClick={(e) => getAssignmentAnalysis(e, user.student.id, sessionClass, sessionAssignmentId)}>{user.student.lname}</div>
    }
    </>
  )}else{
    return(
    <AssignmentAnalysis showAssignmentHeader={showAssignmentHeader} setShowAssignmentHeader={setShowAssignmentHeader} assignmentAnalysis={assignmentAnalysis} setAssignmentAnalysis={setAssignmentAnalysis}/>
    )
  }
}
export default AssignmentReportContent