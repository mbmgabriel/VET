import React, { useState, useEffect, useContext } from 'react'
import {Row, Col, Accordion, Button, Tooltip, OverlayTrigger} from 'react-bootstrap'
import ClassesAPI from '../../../api/ClassesAPI'
import DiscussionAPI from '../../../api/DiscussionAPI';
import HeaderTask from '../../classes/components/Task/HeaderTask'
import { useParams } from 'react-router'
import EditTask from '../../classes/components/Task/EditTask'
import SweetAlert from 'react-bootstrap-sweetalert';
import moment from 'moment'
import MainContainer from '../../../components/layouts/MainContainer'
import ClassAdminSideNavigation from './components/ClassAdminSideNavigation'
import AssignTask from '../../classes/components/Task/AssignTask'
import EditAssignTask from '../../classes/components/Task/EditAssignTask'
import StudentTask from '../../classes/student/StudentTask'
import { UserContext } from '../../../context/UserContext'
import ViewTask from '../../classes/components/Task/ViewTask'
import ContentViewer from '../../../components/content_field/ContentViewer'
import FullScreenLoader from '../../../components/loaders/FullScreenLoader';
import { toast } from 'react-toastify';
import Status from '../../../components/utilities/Status';

export default function SchoolAdminTask() {
  const [modal, setModal] = useState(false)
  const [moduleId, setModuleId] = useState(null)
  const [module, setModule] = useState([])
  const [assignTaskModal, setAssignTaskModal] = useState(false)
  const [editAssignTaskModal, setEditAssignTaskModal] = useState()
  const [editAssignTaskItem, setEditAssignTaskItem] = useState()
  const [assingTaskId, setAssingTaskId] = useState('')
  const [taskModule, setTaskModule] = useState([])
  const [editTask, setEditTask] = useState()
  const {id} = useParams();
  // const classId = classInfo?.classInformation?.classId;
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
  const [classInfo, setClassInfo] = useState({});
  const [taskName, setTaskName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [taskId, setTaskId] = useState('')
  const [moduleName, setModuleName] = useState('')
  const [loading, setLoading] = useState(false)
  const onSearch = (text) => {
    setSearchTerm(text)
  }
  
    useEffect(() => {
      getClassInfo()
    }, [])

  const getClassInfo = async() => {
    setLoading(true)
    let response = await new DiscussionAPI().getClassInfo(id)
    if(response.ok){
      setLoading(false)
      getModule(response.data.classInformation?.courseId)
      setClassInfo(response.data)
    }else{
      toast.error('Something went wrong while fetching class info')
    }
    setLoading(false)
  }
  
  const viewTaskTaggle = (item, item1,) => {
    setViewTaskItem(item)
    setViewTaskAssign(item1)
    setViewTaskModal(!viewTaskModal)
  }

  const toggle = (e, item, item1, item2, item3) =>{
    setTaskName(item)
    setInstructions(item1)
    setTaskId(item2)
    setModuleName(item3)
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

  const getModule = async(courseID) =>{
    let response = await new ClassesAPI().getModule(courseID)
    if(response.ok){
        setModule(response.data)
    }else{
      toast.error('Something went wrong while fetching all module')
    }
  }

  const getTaskModule = async(e, item) =>{
    e.preventDefault()
    let response = await new ClassesAPI().getTaskModule(id, item)
    if(response.ok){
      setTaskModule(response?.data)
      setModuleId(item)
    }else{
      toast.error('Something went wrong while fetching tasks')
    }
  }
  // useEffect(() => {
  //   if(moduleId !== null){
  //     return(
  //       getTaskModule() 
  //     )
  //   }  
  // }, [])

  const removeTask = async (e, item, item1) => {
    let response = await new ClassesAPI().deleteTasks(item)
    if(response.ok){
      getTaskModule(null, item1)
      setDeleteNotify(false)
      // alert('Task Deleted')
    }else{
      toast.error('Something went wrong while deleting a task')
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

  return (
    <MainContainer title="School" activeHeader={"classes"} style='not-scrollable' loading={loading}>
      {loading && <FullScreenLoader />}
      <Row className="mt-4">
        <Col sm={3}>
          <ClassAdminSideNavigation active="task"/>
        </Col>
        <Col sm={9} className='scrollable vh-85'>
        <HeaderTask onSearch={onSearch} module={module} getTaskModule={getTaskModule} onRefresh={() => getClassInfo()}/>
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
              {(user?.isStudent === null)?(
              <>
                {/* <StudentTask searchTerm={searchTerm} taskModule={taskModule} /> */}
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
                        <ContentViewer>{moduleitem?.task?.instructions}</ContentViewer>
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
                      </Col>
                      </>
                      }
                      </>
                    }
                    {moduleitem?.taskAssignment === null ? (<></>):(<>
                      <Col sm={7} className='due-date-discusstion' >
                        <p className='exam-instruction m-0'>
                          <span className='d-inline-block' style={{ width: 40, fontSize: 16}}>
                            Start:
                          </span>
                            &nbsp;<b style={{ fontSize: '16px' }}>{moment(moduleitem?.taskAssignment?.startDate).format("MMMM Do YYYY")}, {moment(moduleitem?.taskAssignment?.startTime, 'HH:mm:ss').format('h:mm A')}</b>
                        </p>
                        <p className='exam-instruction m-0 mb-3'>
                          <span className='d-inline-block' style={{ width: 40, fontSize: 16 }}>
                            End:
                          </span>
                            &nbsp;<b style={{ fontSize: '16px' }}>{moment(moduleitem?.taskAssignment?.endDate).format("MMMM Do YYYY")}, {moment(moduleitem?.taskAssignment?.endTime, 'HH:mm:ss').format('h:mm A')}</b>
                        </p> 
                      </Col>
                      </>)}
                    {moduleitem?.taskAssignment?(
                    <>
                    <div className='inline-flex' >
                      {moduleitem?.task?.classId == null ? ( <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Created in Course</Status></div>) : (<Status>Created in Class</Status>)}
                      {
                        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(moduleitem?.taskAssignment?.startDate + ' ' + moduleitem?.taskAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&  
                      <div style={{color:'#EE9337', fontSize:'15px'}}><b></b><Status>Upcoming</Status></div>
                      }
                      {
                        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(moduleitem?.taskAssignment?.endDate + ' ' + moduleitem?.taskAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                        <div style={{color:'#EE9337', fontSize:'15px'}}><b></b><Status>Ended</Status></div>
                      }
                      {
                        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isSame(moment(moduleitem?.taskAssignment?.startDate + ' ' + moduleitem?.taskAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                        <div style={{color:'#EE9337', fontSize:'15px'}}><b></b><Status>Ongoing</Status></div>
                      }
                      {
                        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(moduleitem?.taskAssignment?.startDate + ' ' + moduleitem?.taskAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(moduleitem?.taskAssignment?.endDate + ' ' + moduleitem?.taskAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                        <div style={{color:'#EE9337', fontSize:'15px'}}><b></b><Status>Ongoing</Status></div>
                      }
                    </div>
                      {/* <Col sm={7} className='due-date-discusstion' >
                        <div className='inline-flex'>
                          <div className='text-color-bcbcbc font-16'>
                            Start Date:&nbsp;
                          </div>
                          <div className='text-color-707070 font-16'>
                           {moment(moduleitem?.taskAssignment?.startDate).format('LL')}&nbsp;
                          </div>
                          <div className='text-color-bcbcbc font-16'>
                            Start Time:&nbsp;
                          </div>
                          <div className='text-color-707070 font-16'>
                            {moduleitem?.taskAssignment?.startTime}
                          </div>
                      </div>
                      </Col>
                      <Col className='posted-date-discusstion'>
                        <div className='inline-flex'>
                          <div className='text-color-bcbcbc font-16'>
                            End Date:&nbsp;
                          </div>
                          <div className='text-color-707070 font-16'>
                            {moment(moduleitem?.taskAssignment?.endDate).format('LL')}&nbsp;
                          </div>
                          <div className='text-color-bcbcbc font-16'>
                            End Time:&nbsp;
                          </div>
                          <div className='text-color-707070 font-16'>
                            {moduleitem?.taskAssignment?.endTime}
                          </div>
                        </div>
                      </Col> */}
                      <div className='text-color-bcbcbc' >
                      <hr></hr>
                      </div>
                    </>
                    ):
                    <>
                      <div className='inline-flex' style={{color:'red'}}>
                        {moduleitem?.task?.classId == null ? ( <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Created in Course</Status></div>) : (<Status>Created in Class</Status>)}
                        <Status>Unassigned</Status>
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
          <ViewTask setViewTaskModal={setViewTaskModal} viewTaskAssign={viewTaskAssign} viewTaskItem={viewTaskItem} viewTaskTaggle={viewTaskTaggle} viewTaskModal={viewTaskModal} />
          <EditTask moduleName={moduleName} taskId={taskId} setTaskId={setTaskId} instructions={instructions} setInstructions={setInstructions} taskName={taskName} setTaskName={setTaskName} setModal={setModal} moduleId={moduleId} editTask={editTask} toggle={toggle} modal={modal} module={module} getTaskModule={getTaskModule} />
          <AssignTask moduleId={moduleId} getTaskModule={getTaskModule} assingTaskId={assingTaskId} assignTaskModal={assignTaskModal} assignTaskToggle={assignTaskToggle} />
          <EditAssignTask getTaskModule={getTaskModule} editAssignTaskItem={editAssignTaskItem} editAssignTaskToggle={editAssignTaskToggle} editAssignTaskModal={editAssignTaskModal} />
        </Col>
      </Row>
    </MainContainer>
  )
}
