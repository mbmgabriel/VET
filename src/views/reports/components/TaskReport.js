import React, {useState, useEffect, useContext} from 'react'
import {Accordion, Row, Col} from 'react-bootstrap'
import TaskReportContent from '../contents/TaskReportContent'
import ClassesAPI from './../../../api/ClassesAPI'

function TaskReport({filter, setFilter, classesModules, setClassesModules, selectedClassId, viewTaskReport, setViewTaskReport, showTaskHeader, setShowTaskHeader}) {

  const [taskPerModule, setTaskPerModule] = useState([])
  const [taskReport, setTaskReport] = useState([])
  const [loading, setLoading] = useState(false)

  const getClassTaskModules = async(e, moduleId) => {
    console.log(selectedClassId)
    sessionStorage.setItem('testModuleId', moduleId)
    let sessionModuleId = sessionStorage.getItem('testModuleId')
    let response = await new ClassesAPI().getClassTaskModules(selectedClassId, sessionModuleId)
    if(response.ok){
      setTaskPerModule(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
  }

  const getTaskReport = async(e, taskid, taskname) => {
    setLoading(true)
    setViewTaskReport(false)
    sessionStorage.setItem('taskName',taskname)
    sessionStorage.setItem('taskId',taskid)
    let response = await new ClassesAPI().getTaskReport(selectedClassId, taskid, taskname)
    setLoading(false)
    if(response.ok){
      setTaskReport(response.data)
      console.log(response.data)
    }else{
      alert(response.data.errorMessage)
    }
  }

  const taskColumns = () => {
    if(taskReport.length > 0){ 
      return taskReport[0].columnTasks?.map(item => item.taskName) || []
    }
    return []
  }

  if(viewTaskReport === true){
  return (
    <div>
      <Accordion>
      {classesModules.map(item => {
        return(
          <Accordion.Item eventKey={item.id}>
          <Accordion.Header onClick={(e) => getClassTaskModules(e, item.id)}><div className='unit-exam'>{item.moduleName} </div></Accordion.Header>
            <Accordion.Body>
              {taskPerModule.filter(item =>
                item.task.taskName.toLowerCase().includes(filter.toLowerCase())).map
                ((item, index) => {
              return(
                item.taskAssignment !== null &&
                <Row>
                  <Col sm={8}>
                    <div className='title-exam' onClick={(e) => getTaskReport(e, item.task.id, item.task.taskName)}>
                      {item.task.taskName}
                    </div>
                    {/* <div className='code-exam'>
                      EQF1
                    </div> */}
                  </Col>
                  <Col sm={9} className='instruction-exam' >
                    {/* <p>{item.task.instructions}</p> */}
                    <div dangerouslySetInnerHTML={{ __html: item.task.instructions }} />
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
  )
  }else{
    return(
      <TaskReportContent showTaskHeader={showTaskHeader} setShowTaskHeader={setShowTaskHeader} setTaskReport={setTaskReport} taskReport={taskReport} taskColumns={taskColumns()}/>
    )
  }
}
export default TaskReport
