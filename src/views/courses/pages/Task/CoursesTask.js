import React, { useState, useEffect, useContext } from "react";
import { Tab, Row, Col, Button, InputGroup, FormControl, Accordion, Tooltip, OverlayTrigger } from 'react-bootstrap';
import CoursesAPI from "../../../../api/CoursesAPI";
import CourseCreateUnit from "./../../components/CourseCreateUnit";
import CreateTask from "./../../components/CreateTask";
import EditTask from "./../../components/EditTask";
import SweetAlert from 'react-bootstrap-sweetalert';
import ViewTask from "./ViewTask";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CourseContent from "../../CourseContent";
import {useParams} from 'react-router';
import CourseBreadcrumbs from "../../components/CourseBreadcrumbs";
import { UserContext } from '../../../../context/UserContext';

export default function CoursesTask() {

  const [loading, setLoading] = useState(false)

  const [openCreateTaskModal, setCreateTaskModal] = useState(false)
  const [openEditTaskModal, setOpenEditTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [taskInfo, setTaskInfo] = useState([])
  const [sweetError, setSweetError] = useState(false)
  const [taskId, setTaskId] = useState("")
  const [localModuleId, setLocalModuleId] = useState("")
  const [filter, setFilter] = useState("");
  const [moduleInfo, setModuleInfo] = useState([]);
  const {id} = useParams();
  const [showTask, setShowTask] = useState(false);
  const [taskName, setTaskName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [courseInfo, setCourseInfo] = useState("")
  const userContext = useContext(UserContext);
  const {user} = userContext.data;
  const courseid = sessionStorage.getItem('courseid')
  const subsType = localStorage.getItem('subsType');

  const getCourseInformation = async() => {
    setLoading(true)
    let response = await new CoursesAPI().getCourseInformation(courseid)
    setLoading(false)
    if(response.ok){
      setCourseInfo(response.data)
    }else{
      alert("Something went wrong while fetching course information")
    }
  }

  useEffect(() => {
    if(courseid != null){
      getCourseInformation();
    }
    if(subsType != 'LMS'){
      window.location.href = "/courses"
    }
  }, [])

  const handleOpenCreateTaskModal = () =>{
    setCreateTaskModal(!openCreateTaskModal)
  }

  const handleOpenEditTaskModal = (e, taskName, instructions, taskId) =>{
    e.preventDefault()
    setTaskName(taskName)
    setInstructions(instructions)
    setTaskId(taskId)
    setOpenEditTaskModal(!openEditTaskModal)
  }

  const getTaskInfo = async(e, data) => {
    setLoading(true)
    setLocalModuleId(data)
    sessionStorage.setItem("moduleid", data)
    let response = await new CoursesAPI().getTaskInformation(data)
    setLoading(false)
    if(response.ok){
      setTaskInfo(response.data)
    }else{
      alert("Something went wrong while fetching all task")
    }
  }

  const getCourseUnitInformation = async(e) => {
    setLoading(true)
    let response = await new CoursesAPI().getCourseUnit(id)
    setLoading(false)
    if(response.ok){
      setModuleInfo(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching course unit")
    }
  }

  const cancelSweetError = () => {
    setSweetError(false)
  }

  const confirmSweetError = (id) => {
    notifyDeleteTask()
    deleteCourseTask(id)
    setSweetError(false)
  } 

  const deleteCourseTask = async(data) => {
    setLoading(true)
    const sessionModule = sessionStorage.getItem('moduleid')
    let response = await new CoursesAPI().deleteTask(taskId)
    setLoading(false)
    if(response.ok){
      // setLessonInfo(response.data)
      getTaskInfo(null, localModuleId)
    }else{
      alert(response.data.errorMessage)
    }
  }

  const onSearch = (text) => {
    setFilter(text)
  }

  const viewTas = (data) => {
    setTaskName(data.taskName);
    setSelectedTask(data)
    setShowTask(true)
  }

  useEffect(() => {
    getCourseUnitInformation();
  }, [])

  const notifyDeleteTask= () => 
  toast.error('Task Deleted!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const clickedTab = () => {
    setTaskName('');
    setShowTask(false)
  }

  const renderTooltipEdit = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit
    </Tooltip>
  )

  const renderTooltipDelete = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete
    </Tooltip>
  )

  return (
    <CourseContent>
      <CourseBreadcrumbs title={taskName} clicked={() => clickedTab()}/>
     {showTask ?
        <ViewTask selectedTask={selectedTask} showTask={showTask} setShowTask={setShowTask} />
     :
      <>
      <span className="content-pane-title">
        Task 
      </span>
      <div className="row m-b-20 m-t-30" onSearch={onSearch}>
        <div className="col-md-12">
          <InputGroup size="lg">
            <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search unit or task here" type="search" onChange={(e) => onSearch(e.target.value)}/>
            <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
          </InputGroup>
        </div>
      </div>
      <EditTask
      taskName={taskName}
      instructions={instructions}
      taskId={taskId}
      setInstructions={setInstructions} 
      setTaskName={setTaskName}
      setTaskInfo={setTaskInfo} selectedTask={selectedTask} openEditTaskModal={openEditTaskModal} setOpenEditTaskModal={setOpenEditTaskModal}/>
      <CreateTask setTaskInfo={setTaskInfo} openCreateTaskModal={openCreateTaskModal} setCreateTaskModal={setCreateTaskModal}/>
      <Accordion defaultActiveKey="0">
        {moduleInfo.map((item, index) => {
          return(
            <>
            <Accordion.Item eventKey={item.id}> 
              <Accordion.Header onClick={(e) => {getTaskInfo(e, item.id)}}>
                <span className="unit-title">{item.moduleName} 
                {courseInfo?.isTechfactors && user?.teacher.positionID != 7 ? (<></>):(<>
                  <Button className="btn-create-class" variant="link" onClick={handleOpenCreateTaskModal}><i className="fa fa-plus"></i> Add Task</Button>
                </>)}
                </span>
              </Accordion.Header>
              <Accordion.Body>
                {taskInfo.filter(item => 
                  item.taskName.toLowerCase().includes(filter.toLowerCase())
                ).map((ti, index) => (
                  <Row style={{margin:'10px'}}>
                    <Col className="lesson-header" md={9}>
                      <span onClick={(e) => {viewTas(ti)}}>{ti?.taskName}</span>
                    </Col>
                    {courseInfo?.isTechfactors && user?.teacher.positionID != 7 ? (<></>):(<>
                      <Col className="align-right-content" md={3}>
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 1, hide: 25 }}
                        overlay={renderTooltipEdit}>
                        <Button className="m-r-5 color-white tficolorbg-button" size="sm" onClick={(e) => handleOpenEditTaskModal(e, ti?.taskName, ti?.instructions, ti?.id)}><i className="fa fa-edit"></i></Button>
                     </OverlayTrigger>
                     <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 1, hide: 25 }}
                        overlay={renderTooltipDelete}>
                      <Button className="m-r-5 color-white tficolorbg-button" size="sm"><i className="fa fa-trash"  onClick={() => {setSweetError(true); setTaskId(ti.id)}}></i></Button>
                    </OverlayTrigger>
                    </Col>
                    </>)}
                  </Row>
                ))}
                    <SweetAlert
                      warning
                      showCancel
                      show={sweetError}
                      confirmBtnText="Yes, delete it!"
                      confirmBtnBsStyle="danger"
                      title="Are you sure?"
                      onConfirm={() => confirmSweetError(item.id)}
                      onCancel={cancelSweetError}
                      focusCancelBtn
                    >
                      You will not be able to recover this Task!
                    </SweetAlert>
              </Accordion.Body>
            </Accordion.Item>
            </>
            )
          })
        }
      </Accordion>
      </>
      }
    </CourseContent>
  )
}
