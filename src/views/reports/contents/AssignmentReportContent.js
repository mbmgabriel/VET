import React, {useState, useEffect, useContext} from 'react'
import {Col, Table, Button, Badge} from 'react-bootstrap'
import { UserContext } from './../../../context/UserContext'
import ClassesAPI from './../../../api/ClassesAPI'
import { toast } from 'react-toastify';
import {writeFileXLSX, utils} from "xlsx";
import { useParams } from "react-router-dom";

function AssignmentReportContent({getAssignmentReport, getAssignmentAnalysis, assignmentName, selectedClassId, viewAssignmentReport, setViewAssignmentReport, assignmentReport, setAssignmentReport, assignmentColumns = ["header 1", "header 2"]}) {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [dataDownload, setDataDownload] = useState({});
  const [alphabetical, setAlphabetical] = useState(true);
  const pageURL = new URL(window.location.href);
  const paramsId = pageURL.searchParams.get("classId");

  let sessionClass = sessionStorage.getItem("classId")
  let sessionAssignmentId = sessionStorage.getItem("assignmentId")

  const reTakeAssigment = async(e, assignmentId, studentId) => {
    let response = await new ClassesAPI().reTakeAssigment(paramsId, assignmentId, studentId)
    if(response.ok){
      notifyRetakeAssignment()
      getAssignmentReport(e, assignmentId, assignmentName)
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

  const handleClickIcon = () =>{
    setAlphabetical(!alphabetical);
    if(!alphabetical){
      arrageAlphabetical(assignmentReport);
    }
    else{
      arrageNoneAlphabetical(assignmentReport);
    }
  }


  const arrageAlphabetical = (data) => {
    let temp = data?.sort(function(a, b){
      let nameA = a.student.lname.toLocaleLowerCase();
      let nameB = b.student.lname.toLocaleLowerCase();
      if (nameA < nameB) {
          return -1;
      }
    });
}

const arrageNoneAlphabetical = (data) => {
  let temp = data?.sort(function(a, b){
    let nameA = a.student.lname.toLocaleLowerCase();
    let nameB = b.student.lname.toLocaleLowerCase();
    if (nameA > nameB) {
        return -1;
    }
  });
}

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
          <th><div className='class-enrolled-header'> Student Name{' '} <i onClick={() => handleClickIcon()} className={`${!alphabetical ? 'fas fa-sort-alpha-down' : 'fas fa-sort-alpha-up'} td-file-page`}></i></div></th>
            <th>Grade</th>
            <th>Status</th>
            {user.isTeacher && <th>Action</th>}
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
                  <td>
                    {
                      st.score === 0 
                        ? <Badge bg="danger">No Grade</Badge>
                        : `${st.score} / ${st?.assignment?.rate}`
                    }
                  </td>
                  <td>         
                    {st?.studentAnswer === null ? <Badge bg="danger">Not Submitted</Badge>:
                      <Badge bg="success">Submitted</Badge>
                    }</td>
                  {user.isTeacher && <td>
                    {st?.studentAnswer === null ? <span />:
                      <Button style={{color:"white"}} variant="warning" size="sm" onClick={(e) => reTakeAssigment(e, st?.assignment?.id, item?.student?.id)}><i class="fas fa-redo"style={{paddingRight:'10px'}} ></i>Retake</Button>
                    }
                  </td>}
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
      <Table hover size="lg" responsive>
        <thead>
          <tr>
          <th><div className='class-enrolled-header'> Student Name{' '} <i onClick={() => handleClickIcon()} className={`${!alphabetical ? 'fas fa-sort-alpha-down' : 'fas fa-sort-alpha-up'} td-file-page`}></i></div></th>
            <th>Grade</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
        {assignmentReport.map(item =>{
            return (
              item.student.id == user.student.id &&
              <tr>
                {item.studentAssignments.map(st =>{
                return (
                  <>
                  <td><i class="fas fa-user-circle td-icon-report-person"></i> 
                    <span style={{cursor:'pointer'}} onClick={(e) => getAssignmentAnalysis(e, item.student.id, sessionClass, sessionAssignmentId, item.student.lname, item.student.fname)}>{item.student.lname}, {item.student.fname}</span>
                  </td>
                  <td>
                    {
                      st.score === 0 
                        ? <Badge bg="danger">No Grade</Badge>
                        : `${st.score} / ${st?.assignment?.rate}`
                    }
                  </td>
                  <td>         
                    {st?.studentAnswer === null ? <Badge bg="danger">Not Submitted</Badge>:
                      <Badge bg="success">Submitted</Badge>
                    }</td>
                  </>
                  )

              })}
              </tr>
            )
          })
        }
        </tbody>
      </Table>    }
    </>
  )
  // )}else{
  //   return(
  //   <AssignmentAnalysis showAssignmentHeader={showAssignmentHeader} setShowAssignmentHeader={setShowAssignmentHeader} assignmentAnalysis={assignmentAnalysis} setAssignmentAnalysis={setAssignmentAnalysis}/>
  //   )
  // }
}
export default AssignmentReportContent