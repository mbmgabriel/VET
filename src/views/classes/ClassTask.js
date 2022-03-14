import React, { useState, useEffect, useContext } from 'react'
import {Row, Col, Accordion, Button, Tooltip, OverlayTrigger} from 'react-bootstrap'
import ClassesAPI from '../../api/ClassesAPI'
import HeaderTask from './components/Task/HeaderTask'
import { useParams } from 'react-router'
import EditTask from './components/Task/EditTask'
import SweetAlert from 'react-bootstrap-sweetalert';
import moment from 'moment'
import AssignTask from './components/Task/AssignTask'
import EditAssignTask from './components/Task/EditAssignTask'
import StundentAnswerTask from './student/components/StundentAnswerTask'
import StudentSubmittedTask from './student/components/StudentSubmittedTask'
import StudentTask from './student/StudentTask'
import { UserContext } from '../../context/UserContext'
import ViewTask from './components/Task/ViewTask'


function ClassTask({classInfo}) {
  const [modal, setModal] = useState(false)
  const [moduleId, setModuleId] = useState(null)
  const [module, setModule] = useState([])
  const [assignTaskModal, setAssignTaskModal] = useState(false)
  const [editAssignTaskModal, setEditAssignTaskModal] = useState()
  const [editAssignTaskItem, setEditAssignTaskItem] = useState()
  const [assingTaskId, setAssingTaskId] = useState('')
  const [taskModule, setTaskModule] = useState([])
  const [editTask, setEditTask] = useState()
  const {id} = useParams()
  const courseId = classInfo?.classInformation?.courseId
  const classId = classInfo?.classInformation?.classId;
  const [deleteNotify, setDeleteNotify] = useState(false)
  const [itemId, setItemId] = useState('')
  const dateCompareNow = moment().format("YYYY-MM-DD")
  const timeNow = moment().format('HH:mm');
  const dateTimeNow = dateCompareNow + ' ' + '00:00:00';
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [viewTaskModal, setViewTaskModal] = useState(false)
  const [viewTaskItem, setViewTaskItem] = useState([])
  const [viewTaskAssign, setViewTaskAssign] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const onSearch = (text) => {
    setSearchTerm(text)
  }
  
  const viewTaskTaggle = (item, item1,) => {
    setViewTaskItem(item)
    setViewTaskAssign(item1)
    setViewTaskModal(!viewTaskModal)
  }

  const toggle = (e, item) =>{
    setEditTask(item)
    setModal(!modal)
  }

  const editAssignTaskToggle = (e, item) => {
    setEditAssignTaskItem(item)
    setEditAssignTaskModal(!editAssignTaskModal)
  }
  
  const assignTaskToggle = (e, item) => {
    setAssingTaskId(item)
    setAssignTaskModal(!assignTaskModal)
  }

 
  const cancelSweetAlert = () => {
    setDeleteNotify(false)
  }

  const handleDeleteNotify = (item, item1) =>{
    setDeleteNotify(true)
    setItemId(item)
    setModuleId(item1)
  }

  const getModule = async() =>{
    let response = await new ClassesAPI().getModule(courseId)
    if(response.ok){
        setModule(response.data)
    }else{
      alert("Something went wrong while fetching all Module")
    }
  }

  useEffect(() => {
    getModule()
  }, [])

  const getTaskModule = async(e, item) =>{
    let response = await new ClassesAPI().getTaskModule(id, item)
    if(response.ok){
      setTaskModule(response.data)
      setModuleId(item)
    }else{
      alert("Something went wrong while Deleting Deleting a getTaskModule")
    }
  }
  useEffect(() => {
    if(moduleId !== null){
      return(
        getTaskModule() 
      )
    }  
  }, [])

  const removeTask = async (e, item, item1) => {
    let response = await new ClassesAPI().deleteTasks(item)
    if(response.ok){
      getTaskModule(null, item1)
      setDeleteNotify(false)
      // alert('Task Deleted')
    }else{
      alert("Something went wrong while Deleting a task")
    }
  }

  const renderTooltipView = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      View
    </Tooltip>
  )
  const renderTooltipEdit = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit
    </Tooltip>
  )
  const renderTooltipReasign = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Reassign
    </Tooltip>
  )
  const renderTooltipAsign = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Assign
    </Tooltip>
  )

  const renderTooltipDelete = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete
    </Tooltip>
  )

  console.log('setTaskModulesetTaskModule:', taskModule)

  return (
    <>
      <HeaderTask onSearch={onSearch} module={module} getTaskModule={getTaskModule} classId={classId} />
        <Accordion>
          <SweetAlert
            warning
            showCancel
            show={deleteNotify}
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            title="Are you sure?"
            onConfirm={(e) => removeTask(e, itemId, moduleId)}
            onCancel={cancelSweetAlert}
            focusCancelBtn
            >
              You will not be able to recover this imaginary file!
          </SweetAlert>
        {module.map((item, index) =>{
          return ( 
            <Accordion.Item eventKey={index} onClick={(e) => getTaskModule(e, item?.id)}>
            <Accordion.Header ><div style={{fontSize:'20px'}}>{item.moduleName}</div></Accordion.Header>
            <Accordion.Body>
              {(user?.teacher === null)?(
              <>
                <StudentTask searchTerm={searchTerm} taskModule={taskModule} />
              </>):<>
              {taskModule?.filter((moduleitem) => {
                if(searchTerm == ''){
                  return moduleitem
                }else if(moduleitem?.task?.taskName.toLowerCase().includes(searchTerm.toLocaleLowerCase())){
                  return moduleitem
                }
              }).map(moduleitem => {
                return (
                  <Row style={{margin:'10px'}}>
                    <Col sm={8}>
                      <div className='title-exam' >
                        {moduleitem?.task?.taskName}
                      </div>
                    </Col>
                    <Col sm={9} className='instruction-exam' >
                      <div className='inline-flex'>
                        <div className='text-color-bcbcbc' >
                          Instruction:&nbsp;
                        </div>
                        <div className='text-color-707070' >
                        <span style={{marginTop:"300px !important"}} dangerouslySetInnerHTML={{__html:moduleitem?.task?.instructions }} />
                        </div>
                      </div>
                    </Col>
                    {moduleitem.task.classId?( 
                    <Col sm={3} className='icon-exam'>
                      {/* Student Modal Answers */}
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 1, hide: 0 }}
                        overlay={renderTooltipView}>
                          <Button onClick={() => viewTaskTaggle(moduleitem?.task, moduleitem?.taskAssignment)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye" ></i>{' '}</Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 1, hide: 0 }}
                        overlay={renderTooltipEdit}>
                        <Button onClick={(e) => toggle(e, moduleitem)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-edit"></i></Button>
                      </OverlayTrigger> 
                        {moduleitem?.taskAssignment?(
                          <>
                          <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 1, hide: 0 }}
                            overlay={renderTooltipReasign}>
                              <Button onClick={(e) => editAssignTaskToggle(e,moduleitem)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-clock"></i></Button>
                            </OverlayTrigger>
                          </>
                        ):
                          <>
                          <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 1, hide: 0 }}
                            overlay={renderTooltipAsign}>
                            <Button onClick={(e) => assignTaskToggle(e, moduleitem.task.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-user-clock"></i></Button>
                          </OverlayTrigger>
                          </>
                        }
                          <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 1, hide: 0 }}
                            overlay={renderTooltipDelete}>
                              <Button onClick={() => handleDeleteNotify(moduleitem?.task?.id, item?.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-trash-alt"></i></Button>
                          </OverlayTrigger> 
                      </Col>
                      ):
                 
                      <>
                      {moduleitem.taskAssignment?.startDate?(
                      <>
                      <Col sm={3} className='icon-exam'>
                        {/* <Button className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye" ></i>{' '}</Button> */}
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 1, hide: 0 }}
                          overlay={renderTooltipView}>
                            <Button onClick={() => viewTaskTaggle(moduleitem?.task, moduleitem?.taskAssignment)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye" ></i>{' '}</Button>
                        </OverlayTrigger> 
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 1, hide: 0 }}
                          overlay={renderTooltipReasign}>
                            <Button onClick={(e) => editAssignTaskToggle(e,moduleitem)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-clock"></i></Button>
                        </OverlayTrigger> 
                      </Col>
                      </>
                      ):
                      <>
                      <Col sm={3} className='icon-exam'>
                        {/* <Button className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye" ></i>{' '}</Button> */}
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 1, hide: 0 }}
                          overlay={renderTooltipView}>
                          <Button onClick={() => viewTaskTaggle(moduleitem?.task, moduleitem?.taskAssignment)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye" ></i>{' '}</Button>
                        </OverlayTrigger> 
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 1, hide: 0 }}
                          overlay={renderTooltipAsign}>
                          <Button onClick={(e) => assignTaskToggle(e, moduleitem?.task.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-user-clock"></i></Button>
                        </OverlayTrigger>
                      </Col>
                      </>
                      }
                      </>
                    }
               
                    {moduleitem?.taskAssignment?(
                    <>
                      {
                        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(moduleitem?.taskAssignment?.startDate + ' ' + moduleitem?.taskAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&  
                      <div style={{color:'#EE9337', fontSize:'15px'}}><b>Upcoming</b></div>
                      }
                      {
                        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(moduleitem?.taskAssignment?.endDate + ' ' + moduleitem?.taskAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                        <div style={{color:'#EE9337', fontSize:'15px'}}><b>Ended</b></div>
                      }
                      {
                        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isSame(moment(moduleitem?.taskAssignment?.startDate + ' ' + moduleitem?.taskAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                        <div style={{color:'#EE9337', fontSize:'15px'}}><b>Ongoing</b></div>
                      }
                      {
                        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(moduleitem?.taskAssignment?.startDate + ' ' + moduleitem?.taskAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(moduleitem?.taskAssignment?.endDate + ' ' + moduleitem?.taskAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                        <div style={{color:'#EE9337', fontSize:'15px'}}><b>Ongoing</b></div>
                      }
                      <Col sm={7} className='due-date-discusstion' >
                        <div className='inline-flex'>
                          <div className='text-color-bcbcbc'>
                            Start Date:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                           {moment(moduleitem?.taskAssignment?.startDate).format('LL')}&nbsp;
                          </div>
                          <div className='text-color-bcbcbc'>
                            Start Time:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                            {moduleitem?.taskAssignment?.startTime}
                          </div>
                      </div>
                      </Col>
                      <Col className='posted-date-discusstion'>
                        <div className='inline-flex'>
                          <div className='text-color-bcbcbc'>
                            End Date:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                            {moment(moduleitem?.taskAssignment?.endDate).format('LL')}&nbsp;
                          </div>
                          <div className='text-color-bcbcbc'>
                            End Time:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                            {moduleitem?.taskAssignment?.endTime}
                          </div>
                        </div>
                      </Col>
                      <div className='text-color-bcbcbc' >
                      <hr></hr>
                      </div>
                    </>
                    ):
                    <>
                      <div style={{color:'red'}}>
                        <b>Not Assigned</b>
                      </div>
                      <div className='text-color-bcbcbc' >
                      <hr></hr>
                      </div>
                    </>}
                  </Row>  
                    )})}
              </>}
              
              </Accordion.Body>
              </Accordion.Item>
            )
          })}
          </Accordion>
          <ViewTask viewTaskAssign={viewTaskAssign} viewTaskItem={viewTaskItem} viewTaskTaggle={viewTaskTaggle} viewTaskModal={viewTaskModal} />
          <EditTask moduleId={moduleId} editTask={editTask} toggle={toggle} modal={modal} module={module} getTaskModule={getTaskModule} />
          <AssignTask moduleId={moduleId} getTaskModule={getTaskModule} assingTaskId={assingTaskId} assignTaskModal={assignTaskModal} assignTaskToggle={assignTaskToggle} />
          <EditAssignTask getTaskModule={getTaskModule} editAssignTaskItem={editAssignTaskItem} editAssignTaskToggle={editAssignTaskToggle} editAssignTaskModal={editAssignTaskModal} />
       </>
    )
  }
export default ClassTask