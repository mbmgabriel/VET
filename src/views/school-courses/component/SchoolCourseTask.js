import React, {useState, useEffect} from 'react'
import {Row, Col, Accordion, Button} from 'react-bootstrap'
import CoursesAPI from '../../../api/CoursesAPI'
import { useParams } from "react-router";
import CourseBreadcrumbs from '../../courses/components/CourseBreadcrumbs';

function SchoolCourseTask() {
  const [modules, setModules] = useState([])
  const [moduleId, setModuleId] = useState(null)
  const [task, setTask] = useState([])
  const [viewTask, setViewTask] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [taskInstruction, setTaskInstruction] = useState('')
  const {id} = useParams()

  const getCourseUnit = async () =>{
    let response = await new CoursesAPI().getCourseUnit(id)
      if(response.ok){
        setModules(response.data)
      }else{
        alert(response.data.errorMessage)
      }
  }

  useEffect(() => {
    getCourseUnit()
  }, [])

  const getTaskInformation = async (e, moduleId) => {
    let response =  await new CoursesAPI().getTaskInformation(moduleId)
    if(response.ok){
      setTask(response.data)
      setModuleId(moduleId)
    }else{
      alert(response.data.errorMessage)
    }
  }

  useEffect(() => {
    if(moduleId !== null){
      return(
        getTaskInformation() 
      )
    }  
  }, [])

  const handleOnclick = (e, taskName, taskInstruction) => {
    setViewTask(true)
    setTaskName(taskName)
    setTaskInstruction(taskInstruction)
  }

  return (
            <>
      {viewTask ? 
      <>
    <Button onClick={() => setViewTask(false)} className="m-r-5 color-white tficolorbg-button" size="sm">Back</Button><br /><br />
      {/* {moduleName}<br /> */}
      {taskName}<br />
      <hr></hr>
      <div style={{position:"relative"}} dangerouslySetInnerHTML={{__html: taskInstruction}} /><br />
      </>:
      <>
      <div className='rounded-white-container'>
      <div className="col-md-10 pages-header"><p className='title-header'>Task </p>
			</div>
      <Accordion>
        {modules.map((item, index) => {
          return(
            <Accordion.Item eventKey={index} onClick={(e) => getTaskInformation(e, item?.id)}>
            <Accordion.Header><div style={{fontSize:'20px'}}>{item.moduleName}</div></Accordion.Header>
            <Accordion.Body>
              {task.map(item =>{
                return(
                  <>
                    <div className='title-exam' >
                      <Row>
                        <Col onClick={(e) => handleOnclick(e, item?.taskName, item?.instructions)} >
                         {item?.taskName}
                        </Col>
                      </Row>
                    </div>
                  </>
                )
              })} 
            </Accordion.Body>
          </Accordion.Item>
          )
        })}
     </Accordion>
    </div>
      </>}
    </>
  )
}

export default SchoolCourseTask