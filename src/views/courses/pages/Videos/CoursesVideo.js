import React, { useState, useEffect, useContext } from "react";
import { Tab, Row, Col, Button, InputGroup, FormControl, Accordion, Tooltip, OverlayTrigger } from 'react-bootstrap';
import CoursesAPI from "../../../../api/CoursesAPI";
import CourseCreateUnit from "./../../components/CourseCreateUnit";
import CreateVideos from "./../../components/CreateVideo";
import EditVideos from "./../../components/EditVideo";
import SweetAlert from 'react-bootstrap-sweetalert';
import ViewVideo from "./ViewVideo";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CourseContent from "../../CourseContent";
import {useParams} from 'react-router';
import CourseBreadcrumbs from "../../components/CourseBreadcrumbs";
import { UserContext } from '../../../../context/UserContext';

export default function CoursesVideos() {

  const [loading, setLoading] = useState(false)

  const [openCreateVideoModal, setOpenCreateVideoModal] = useState(false)
  const [openEditVideoModal, setOpenEditVideoModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [videosInfo, setVideoInfo] = useState([])
  const [sweetError, setSweetError] = useState(false)
  const [videoId, setVideoId] = useState("")
  const [localModuleId, setLocalModuleId] = useState("")
  const [filter, setFilter] = useState("");
  const [moduleInfo, setModuleInfo] = useState([]);
  const {id} = useParams();
  const [showVideos, setShowVideos] = useState(false);
  const [videoName, setVideoName] = useState('')
  const userContext = useContext(UserContext);
  const {user} = userContext.data;
  const courseid = sessionStorage.getItem('courseid')
  const moduleid = sessionStorage.getItem('moduleid')
  const [courseInfo, setCourseInfo] = useState("");
  const subsType = localStorage.getItem('subsType');
  const [isContributor, setIsContributor] = useState(false);
  const handleOpenCreateVideoModal = () =>{
    setOpenCreateVideoModal(!openCreateVideoModal)
  }

  const handleOpenEditVideoModal = (e, item) =>{
    e.preventDefault()
    setSelectedVideo(item)
    setOpenEditVideoModal(!openEditVideoModal)
  }

  const getVideoInfo = async(e, data) => {
    setLoading(true)
    setLocalModuleId(data)
    sessionStorage.setItem("moduleid", data)
    let response = await new CoursesAPI().getVideoInformation(courseid, moduleid)
    setLoading(false)
    if(response.ok){
      setVideoInfo(response.data)
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
    deleteCourseVideo(id)
    setSweetError(false)
  } 

  const deleteCourseVideo = async(vidID) => {
    setLoading(true)
    const sessionModule = sessionStorage.getItem('moduleid')
    let response = await new CoursesAPI().deleteVideo(id, videoId)
    setLoading(false)
    if(response.ok){
      // setLessonInfo(response.data)
      notifyDeleteVideo()
      getVideoInfo(null, localModuleId)
    }else{
      alert(response.data.errorMessage)
    }
  }

  const onSearch = (text) => {
    setFilter(text)
  }

  const viewVideoState = (data) => {
    setVideoName(data.title);
    setSelectedVideo(data)
    setShowVideos(true)
  }

  const getCourseInformation = async() => {
    let response = await new CoursesAPI().getCourseInformation(id)
    if(response.ok){
      setCourseInfo(response.data)
    }else{
      alert("Something went wrong while fetching course information")
    }
  }

  useEffect( async() => {
    let response = await new CoursesAPI().getContributor(id)
    if(response.ok){
      let temp = response.data;
      let ifContri = temp.find(i => i.userInformation?.userId == user.userId);
      console.log(ifContri, user.userId)
      setIsContributor(ifContri ? true : false);
    }
  },[])

  useEffect(() => {
    getCourseUnitInformation();
    getCourseInformation();
    if(subsType != 'LMS'){
      window.location.href = "/courses"
    }
  }, [])

  const notifyDeleteVideo= () => 
  toast.error('Video Deleted!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const clickedTab = () => {
    setVideoName('');
    setShowVideos(false)
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
      <CourseBreadcrumbs title={videoName} clicked={() => clickedTab()}/>
     {showVideos ?
        <ViewVideo selectedVideo={selectedVideo} showVideos={showVideos} setShowVideos={setShowVideos} />
     :
      <>
      <span className="content-pane-title">
        Video 
      </span>
      <div className="row m-b-20 m-t-30" onSearch={onSearch}>
        <div className="col-md-12">
          <InputGroup size="lg">
            <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search unit or video here" type="search" onChange={(e) => onSearch(e.target.value)}/>
            <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
          </InputGroup>
        </div>
      </div>
      <EditVideos setVideoInfo={setVideoInfo} selectedVideo={selectedVideo} openEditVideoModal={openEditVideoModal} setOpenEditVideoModal={setOpenEditVideoModal}/>
      <CreateVideos setVideoInfo={setVideoInfo} openCreateVideoModal={openCreateVideoModal} setOpenCreateVideoModal={setOpenCreateVideoModal}/>
      <Accordion defaultActiveKey="0">
        {moduleInfo.map((item, index) => {
          return(
            <>
            <Accordion.Item eventKey={item.id}> 
              <Accordion.Header onClick={(e) => {getVideoInfo(e, item.id)}}>
                <span className="unit-title">{item.moduleName} 
                {isContributor && <Button className="btn-create-class" variant="link" onClick={handleOpenCreateVideoModal}><i className="fa fa-plus"></i> Add Video</Button>}
                </span>
              </Accordion.Header>
              <Accordion.Body>
                {videosInfo.filter(item => 
                  item.title.toLowerCase().includes(filter.toLowerCase())
                ).map((vi, index) => (
                  <Row style={{margin:'10px'}}>
                    <Col className="lesson-header" md={9}>
                      <span onClick={(e) => {viewVideoState(vi)}}>{vi?.title}</span>
                    </Col>
                    {isContributor && <Col className="align-right-content" md={3}>
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 1, hide: 25 }}
                        overlay={renderTooltipEdit}>
                        <Button className="m-r-5 color-white tficolorbg-button" size="sm" onClick={(e) => handleOpenEditVideoModal(e, vi)}><i className="fa fa-edit"></i></Button>
                     </OverlayTrigger>
                     <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 1, hide: 25 }}
                        overlay={renderTooltipDelete}>
                        <Button className="m-r-5 color-white tficolorbg-button" size="sm"><i className="fa fa-trash"  onClick={() => {setSweetError(true); setVideoId(vi.id)}}></i></Button>
                      </OverlayTrigger>
                    </Col>}
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
                      You will not be able to recover this Video!
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
