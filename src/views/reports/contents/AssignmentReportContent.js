import React, {useState, useEffect, useContext} from 'react'
import {Accordion, Row, Col, Table, Button, Badge} from 'react-bootstrap'
import { UserContext } from './../../../context/UserContext'
import ClassesAPI from './../../../api/ClassesAPI'
import AssignmentAnalysis from './AssignmentAnalysis'
import { toast } from 'react-toastify';
import {writeFileXLSX, utils} from "xlsx";

function AssignmentReportContent({getAssignmentReport, getAssignmentAnalysis, assignmentName, selectedClassId, viewAssignmentReport, setViewAssignmentReport, assignmentReport, setAssignmentReport, assignmentColumns = ["header 1", "header 2"]}) {
  
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [assignmentAnalysis, setAssignmentAnalysis] = useState([])
  const [showAssignmentAnalysis, setShowAssignmentAnalysis] = useState(false)
  const [dataDownload, setDataDownload] = useState({});

  let sessionClass = sessionStorage.getItem("classId")
  let sessionAssignmentId = sessionStorage.getItem("assignmentId")

  const reTakeAssigment = async(e, assignmentId, studentId) => {
    let response = await new ClassesAPI().reTakeAssigment(sessionClass, assignmentId, studentId)
    if(response.ok){
      notifyRetakeAssignment()
      getAssignmentReport(sessionClass, assignmentId)
    }else{
      alert(response.data.errorMessage)
    }
  }

  const notifyRetakeAssignment = () => 
  toast.success('Assignment can now be retaken', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })

  const handleGetItems = () => {
    let tempData =[]
    assignmentReport.map((st, index) => {
      let temp= {};
      let name = `${ st.student.lname} ${ st.student.fname}`
      let score = st.studentAssignments[0].score
      let status = st.studentAssignments[0].studentAnswer == null ? 'Not Submitted' : 'Submitted'
      temp[`Student Name`] = name;
      temp.Grade = score;
      temp.Status = status;
      tempData.push(temp);
    })
    setDataDownload(tempData);
  }

  useEffect(() => {
    if(assignmentReport){
      handleGetItems();
    }
  }, [assignmentReport])

  const downloadxls = () => {
    const ws =utils.json_to_sheet(dataDownload);
    const wb =utils.book_new();
    utils.book_append_sheet(wb, ws, "SheetJS");
    /* generate XLSX file and send to client */
    writeFileXLSX(wb, `${assignmentName}_assignment_report.xlsx`);
  };


  // if(showAssignmentAnalysis === false){
  return(
    <>
    {user.student === null ?
    <>
      <Col className='d-flex justify-content-end'>
        <Button onClick={() => downloadxls()} className='btn-showResult'  size='lg' variant="outline-warning"><b> Export </b></Button>
      </Col>
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
            {/* {assignmentColumns.map((item, index) => {
              return (
                <th key={index}>{item}</th>
              )
            })} */}
            <th>Grade</th>
            <th>Status</th>
            <th>Action</th>
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
                    <span style={{cursor:'pointer'}} onClick={(e) => getAssignmentAnalysis(e, item.student.id, sessionClass, sessionAssignmentId, item.student.lname, item.student.fname)}>{item.student.lname}, {item.student.fname}</span>
                  </td>
                  <td>{st.score}</td>
                  <td>         
                    {st?.studentAnswer === null ? <Badge bg="danger">Not Submitted</Badge>:
                      <Badge bg="success">Submitted</Badge>
                    }</td>
                  <td>
                    {st?.studentAnswer === null ? <spam></spam>:
                      <Button style={{color:"white"}} variant="warning" size="sm" onClick={(e) => reTakeAssigment(e, st?.assignment?.id, item?.student?.id)}><i class="fas fa-redo"style={{paddingRight:'10px'}} ></i>Retake</Button>
                    }
                  </td>
                  </>
                  )
              })}
              </tr>
            )
          })
        }
        </tbody>
      </Table>
    </>
      :
      <div onClick={(e) => getAssignmentAnalysis(e, user.student.id, sessionClass, sessionAssignmentId, user.student.lname, user.student.fname)}>{user.student.lname}</div>
    }
    </>
  )
  // )}else{
  //   return(
  //   <AssignmentAnalysis showAssignmentHeader={showAssignmentHeader} setShowAssignmentHeader={setShowAssignmentHeader} assignmentAnalysis={assignmentAnalysis} setAssignmentAnalysis={setAssignmentAnalysis}/>
  //   )
  // }
}
export default AssignmentReportContent