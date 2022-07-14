import React, { useContext } from 'react'
import { Table, Button, Badge } from 'react-bootstrap'
import { UserContext } from './../../../context/UserContext'
import ClassesAPI from './../../../api/ClassesAPI'
import { toast } from 'react-toastify';

function AssignmentReportContent({
  getAssignmentReport,
  getAssignmentAnalysis,
  assignmentReport
}) {
  const userContext = useContext(UserContext)
  const { user } = userContext.data
  let sessionClass = sessionStorage.getItem("classId")
  let sessionAssignmentId = sessionStorage.getItem("assignmentId")

  const reTakeAssigment = async (e, assignmentId, studentId) => {
    let response = await new ClassesAPI().reTakeAssigment(sessionClass, assignmentId, studentId)
    if (response.ok) {
      notifyRetakeAssignment()
      getAssignmentReport(sessionClass, assignmentId)
    } else {
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

  return (
    <>
      {user.student === null ?
        <Table hover size="lg" responsive>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignmentReport.map(item => {
              return (
                <tr>
                  {item.studentAssignments.map(st => {

                    return (
                      <>
                        <td><i class="fas fa-user-circle td-icon-report-person"></i>
                          <span style={{ cursor: 'pointer' }} onClick={(e) => getAssignmentAnalysis(e, item.student.id, sessionClass, sessionAssignmentId, item.student.lname, item.student.fname)}>{item.student.lname}, {item.student.fname}</span>
                        </td>
                        <td>{st.score}</td>
                        <td>
                          {st?.studentAnswer === null ? <Badge bg="danger">Not Submitted</Badge> :
                            <Badge bg="success">Submitted</Badge>
                          }</td>
                        <td>
                          {st?.studentAnswer === null ? <spam></spam> :
                            <Button style={{ color: "white" }} variant="warning" size="sm" onClick={(e) => reTakeAssigment(e, st?.assignment?.id, item?.student?.id)}><i class="fas fa-redo" style={{ paddingRight: '10px' }} ></i>Retake</Button>
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
        :
        <div onClick={(e) => getAssignmentAnalysis(e, user.student.id, sessionClass, sessionAssignmentId, user.student.lname, user.student.fname)}>{user.student.lname}</div>
      }
    </>
  )
}

export default AssignmentReportContent;