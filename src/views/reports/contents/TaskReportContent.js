import React, {useState, useEffect, useContext} from 'react'
import {Accordion, Row, Col, Table, Badge, Button} from 'react-bootstrap'
import ClassesAPI from './../../../api/ClassesAPI'
import { UserContext } from './../../../context/UserContext'
import TaskAnalysis from './TaskAnalysis'
import { toast } from 'react-toastify';


function TaskReportContent({getTaskReport, setShowTaskHeader, showTaskHeader, selectedClassId, viewTaskReport, setViewTaskReport, taskReport, setTaskReport, taskColumns = ["header 1", "header 2"]}) {
  
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [taskAnalysis, setTaskAnalysis] = useState([])
  const [showTaskAnalysis, setShowTaskAnalysis] = useState(false)

  let sessionClass = sessionStorage.getItem("classId")
  let sessionTaskId = sessionStorage.getItem("taskId")

  const getTaskAnalysis = async(e, studentid, classid, taskid) => {
    console.log(selectedClassId)
    
    sessionStorage.setItem('analysis','true')
    sessionStorage.setItem('studentid',studentid)

    setShowTaskAnalysis(true)
    console.log(showTaskAnalysis)
    let response = await new ClassesAPI().getTaskAnalysis(studentid, sessionClass, taskid)
    if(response.ok){
      setTaskAnalysis(response.data)
      console.log(response.data)
      
    }else{
      alert(response.data.errorMessage)
    }
  }

  const reTakeTask = async (e, taskId, studentId) => {
    let response = await new ClassesAPI().reTakeTask(sessionClass, taskId, studentId)
    if(response.ok){
      notifyRetakeTask()
      getTaskReport(sessionClass, taskId)
    }else{
      alert(response.data.errorMessage)
    }
  }

  const notifyRetakeTask = () => 
  toast.success('Task can now be retaken', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })

  useEffect(() => {
    setShowTaskHeader(true)
  }, [])
  
  if(showTaskAnalysis === false){
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
          {/* {taskColumns.map((item, index) => {
            return (
              <th key={index}>{item}</th>
            )
          })} */}
          <th>Grade </th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
      {taskReport.map(item =>{
          return (
            <tr>
              
              {item.studentTasks.map(st =>{
                
                return (
                <>
                  <td><i class="fas fa-user-circle td-icon-report-person"></i> 
                    <span onClick={(e) => getTaskAnalysis(e, item.student.id, st.task.classId, st.task.id)}>{item.student.lname}, {item.student.fname}</span>
                  </td>
                  <td>{st.score} </td>
                  <td>         
                  {st?.studentAnswer === null ? <Badge bg="danger">Not Submitted</Badge>:
                    <Badge bg="success">Submitted</Badge>
                  }</td>
                <td>
                  {st?.studentAnswer === null ? <spam></spam>:
                    <Button style={{color:"white"}} variant="warning" size="sm" onClick={(e) => reTakeTask(e, st?.task?.id, item?.student?.id)}><i class="fas fa-redo"style={{paddingRight:'10px'}} ></i>Retake</Button>
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
    <div onClick={(e) => getTaskAnalysis(e, user.student.id, sessionClass, sessionTaskId)}>{user.student.lname}</div>
    }
    </>
  )}else{
    return(
    <TaskAnalysis showTaskHeader={showTaskHeader} setShowTaskHeader={setShowTaskHeader} taskAnalysis={taskAnalysis} setTaskAnalysis={setTaskAnalysis}/>
    )
  }
}
export default TaskReportContent