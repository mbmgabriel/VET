import React, {useState, useEffect, useContext} from 'react'
import {Col, Table, Badge, Button} from 'react-bootstrap'
import ClassesAPI from './../../../api/ClassesAPI'
import { UserContext } from './../../../context/UserContext'
import { toast } from 'react-toastify';
import {writeFileXLSX, utils} from "xlsx";

function TaskReportContent({getTaskReport, getTaskAnalysis, taskname, taskReport, setTaskReport, taskColumns = ["header 1", "header 2"]}) {
  
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [showTaskAnalysis, setShowTaskAnalysis] = useState(false)
  const [dataDownload, setDataDownload] = useState({});
  const [alphabetical, setAlphabetical] = useState(true);

  const pageURL = new URL(window.location.href);
  const paramsId = pageURL.searchParams.get("classId");

  let sessionClass = sessionStorage.getItem("classId")
  let sessionTaskId = sessionStorage.getItem("taskId")

  const reTakeTask = async (e, taskId, studentId) => {
    let response = await new ClassesAPI().reTakeTask(paramsId, taskId, studentId)
    if(response.ok){
      notifyRetakeTask()
      getTaskReport(e, taskId, taskname)
    }else{
      alert(response?.data?.errorMessage)
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

  const handleGetItems = () => {
    let tempData =[]
    taskReport.map((st, index) => {
      let temp= {};
      let name = `${ st.student.lname} ${ st.student.fname}`
      let score = st.studentTasks[0].score
      let status = st.studentTasks[0].studentAnswer == null ? 'Not Submitted' : 'Submitted'
      temp[`Student Name`] = name;
      temp.Grade = score;
      temp.Status = status;
      tempData.push(temp);
    })
    setDataDownload(tempData);
  }

  const downloadxls = () => {
    const ws =utils.json_to_sheet(dataDownload);
    const wb =utils.book_new();
    utils.book_append_sheet(wb, ws, "SheetJS");
    /* generate XLSX file and send to client */
    writeFileXLSX(wb, `${taskname}_task_report.xlsx`);
  };


  useEffect(() => {
    handleGetItems();
  }, [taskReport])
    // setShowTaskHeader(true)

  const handleClickIcon = () =>{
    setAlphabetical(!alphabetical);
    if(!alphabetical){
      arrageAlphabetical(taskReport);
    }
    else{
      arrageNoneAlphabetical(taskReport);
    }
  }

  useEffect(()=>{
    arrageNoneAlphabetical(taskReport);
    arrageAlphabetical(taskReport);
}, [taskReport])

const arrageNoneAlphabetical = (data) => {
  let temp = data?.sort(function(a, b){
    let nameA = a.student.lname.toLocaleLowerCase();
    let nameB = b.student.lname.toLocaleLowerCase();
    if (nameA > nameB) {
        return -1;
    }
  });
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
  
  if(showTaskAnalysis === false){
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
              <th>Grade </th>
              <th>Status</th>
              {user.isTeacher && <th>Action</th>}
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
                        <span style={{cursor: 'pointer'}} onClick={(e) => getTaskAnalysis(e, item.student.id, st.task.classId, st.task.id, item.student.lname, item.student.fname)}>{item.student.lname}, {item.student.fname}</span>
                      </td>
                      <td>
                        {
                          st.score === 0 
                            ? <Badge bg="danger">No Grade</Badge>
                            : `${st.score} / ${st?.task?.rate}`
                        }
                      </td>
                      <td>         
                      {st?.studentAnswer === null ? <Badge bg="danger">Not Submitted</Badge>:
                        <Badge bg="success">Submitted</Badge>
                      }</td>
                    {user.isTeacher && <td>
                      {st?.studentAnswer === null ? <spam></spam>:
                        <Button style={{color:"white"}} variant="warning" size="sm" onClick={(e) => reTakeTask(e, st?.task?.id, item?.student?.id)}><i class="fas fa-redo"style={{paddingRight:'10px'}} ></i>Retake</Button>
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
            <th>Grade </th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
        {taskReport.map(item =>{
            return (
              item.student.id == user.student.id &&
              <tr>
                {item.studentTasks.map(st =>{
                  return (
                  <>
                    <td><i class="fas fa-user-circle td-icon-report-person"></i> 
                      <span style={{cursor: 'pointer'}} onClick={(e) => getTaskAnalysis(e, item.student.id, st.task.classId, st.task.id, item.student.lname, item.student.fname)}>{item.student.lname}, {item.student.fname}</span>
                    </td>
                    <td>
                      {
                        st.score === 0 
                          ? <Badge bg="danger">No Grade</Badge>
                          : `${st.score} / ${st?.task?.rate}`
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
      </Table>}
    </>
  )}else{
    return(
      null
    // <TaskAnalysis showTaskHeader={showTaskHeader} setShowTaskHeader={''} taskAnalysis={taskAnalysis} setTaskAnalysis={setTaskAnalysis}/>
    )
  }
}
export default TaskReportContent