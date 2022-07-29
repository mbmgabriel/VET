import React, { useState, useEffect, useContext } from "react";
import { Tab, Row, Col, Button, InputGroup, FormControl, Accordion, Tooltip, OverlayTrigger, Dropdown } from 'react-bootstrap';
import CoursesAPI from "../../../../api/CoursesAPI";
import CourseCreateUnit from "./../../components/CourseCreateUnit";
import CreateLesson from "./../../components/CreateLesson";
import EditLesson from "../../components/EditLesson";
import CoursesLearnContent from "./CoursesLearnContent";
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from 'react-toastify';
import CourseContent from "../../CourseContent";
import 'react-toastify/dist/ReactToastify.css';
import CourseBreadcrumbs from "../../components/CourseBreadcrumbs";
import { UserContext } from '../../../../context/UserContext';

import { useParams } from "react-router";
import { Link } from "react-router-dom";
import EditModule from "../../components/EditModule";
import FullScreenLoader from "../../../../components/loaders/FullScreenLoader";

export default function CourseLearn() {

  const {id} = useParams()

  const [loading, setLoading] = useState(false)
  const [openCreateUnitModal, setOpenCreateUnitModal] = useState(false)
  const [openCreateLessonModal, setCreateLessonModal] = useState(false)
  const [openEditLessonModal, setOpenEditLessonModal] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [lessonInfo, setLessonInfo] = useState([])
  const [lessonContent, setLessonContent] = useState([])
  const [sweetError, setSweetError] = useState(false)
  const [sweetErrorModule, setSweetErrorModule] = useState(false)
  const [filter, setFilter] = useState("");
  const [courseInfo, setCourseInfo] = useState("")
  const [viewLesson, setViewLesson] = useState(false)
  const [moduleInfo, setModuleInfo] = useState([]);
  const [itemId, setItemId] = useState('')
  const [clickedModule, setClickedModule] = useState('');
  const userContext = useContext(UserContext);
  const {user} = userContext.data;
  const [content, setContent] = useState('')
  const [pageName, setPageName] = useState('')
  const [sequenceNo, setSequenceNo] = useState(null)
  const [lessonId, setLessonId] = useState('')
  const [editModuleModal, setEditModuleModal] = useState(false)

  const [moduleName, setModuleName] = useState('')
	const [moduleDescription, setModuleDescription] = useState('')
  const [moduleId, setModuleId] = useState('')

  const courseid = sessionStorage.getItem('courseid')
  const moduleid = sessionStorage.getItem('moduleid')
  const [isContributor, setIsContributor] = useState(true);

  const getContributor = async() => {
    let response = await new CoursesAPI().getContributor(id)
    if(response.ok){
      let temp = response.data;
      let ifContri = temp.find(i => i.userInformation?.userId == user.userId);
      setIsContributor(ifContri ? true : false);
    }
  }

  const toggleModelEditModule = (moduleId, sequenceNoEdit, moduleDescription, moduleName) =>{
    setModuleName(moduleName)
    setModuleDescription(moduleDescription)
    setSequenceNo(sequenceNoEdit)
    setModuleId(moduleId)
    setEditModuleModal(true)
  }

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit
    </Tooltip>
  );

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (  
    <span 
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >{children}</span> 
  ));

  const handleOpenCreateUnitModal = () =>{
    setOpenCreateUnitModal(!openCreateUnitModal)
  }

  const handleOpenCreateLessonModal = () =>{
    setCreateLessonModal(!openCreateLessonModal)
  }

  const handleOpenEditLessonModal = (e, content, pageName, sequenceNo, lessonId) =>{
    e.preventDefault()
    setContent(content)
    setPageName(pageName)
    setSequenceNo(sequenceNo)
    setLessonId(lessonId)
    setOpenEditLessonModal(!openEditLessonModal)
  }

  const cancelSweetError = () => {
    setSweetError(false)
  }

  const confirmSweetError = (id) => {
    setItemId(id)
    setSweetError(true)
  }

  const confirmSweetErrorModule = (id) => {
    setItemId(id)
    setSweetErrorModule(true)
  } 
  
  
  const cancelSweetErrorModule = () => {
    setSweetErrorModule(false)
  }

  const getCourseLessons = async(e, data, modulename) => {
    setLoading(true)
    sessionStorage.setItem('moduleid', data)
    sessionStorage.setItem('modulename', modulename)
    let response = await new CoursesAPI().getCourseUnitPages(id, data)
    setLoading(false)
    if(response.ok){
      setLessonInfo(response.data)
    }else{
      alert("Something went wrong while fetching all pages")
    }
  }

  const getCourseInformation = async(e) => {
    setLoading(true)
    let response = await new CoursesAPI().getCourseInformation(id)
    setLoading(false)
    if(response.ok){
      setCourseInfo(response.data)
    }else{
      toast.error('Something went wrong while fetching course information')
    }
  }

  const getCourseUnitInformation = async(e) => {
    setLoading(true)
    let response = await new CoursesAPI().getCourseUnit(id)
    if(response.ok){
    setLoading(false)
      setModuleInfo(response.data)
    }else{
      toast.error('Something went wrong while fetching course unit')
    }
  }

  const deleteCourseLesson = async(data) => {
    let response = await new CoursesAPI().deleteLesson(data)
    if(response.ok){
      notifyDeleteLesson()
      setSweetError(false)
      getCourseLessons(null, moduleid)
    }else{
      alert("Something went wrong while fetching all pages")
    }
  }

  const deleteModule = async (id) => {
    let response = await new CoursesAPI().deleteModule(id)
      if(response.ok){
        notifyDeleteModule()
        setSweetErrorModule(false)
        getCourseUnitInformation()
      }else{
        alert(response.date.errorMessage)
      }
  }

  const getModuleContent = async(e, data, pagesid, pageName) => {
    setClickedModule(pageName)
    setLoading(true)
    setViewLesson(true)
    let response = await new CoursesAPI().getCourseUnitPagesContent(id, data, pagesid)
    setLoading(false)
    if(response.ok){
      setLessonContent(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
  }

  const onSearch = (text) => {
    setFilter(text)
  }

  useEffect(() => {
    getContributor();
    getCourseUnitInformation();
    getCourseInformation();
  }, [])

  const notifyDeleteLesson = () => 
  toast.error('Successfully Deleted Lesson!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const notifyDeleteModule = () => 
  toast.error('Successfully Deleted Module!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const clickedTab = () => {
    setViewLesson(false);
    setClickedModule('');
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
      {loading && <FullScreenLoader />}
      <CourseBreadcrumbs title={clickedModule} clicked={() => clickedTab()}/>
      {viewLesson ? 
          <CoursesLearnContent courseInfo={courseInfo} setCourseInfo={setCourseInfo} setLessonContent={setLessonContent} lessonContent={lessonContent}/>
        :
        <React.Fragment>
          <div className="content-pane-title col-md-10 pages-header">
              Learn 
              <div>
                <Button onClick={() => getCourseUnitInformation()} className='ml-3'>
                  <i className="fa fa-sync"></i>
                </Button>
              </div>
                {
                  isContributor && 
                  <Button className="btn-create-class" variant="link" onClick={handleOpenCreateUnitModal}><i className="fa fa-plus pt-10"></i> Add Module</Button>
                }
              
              <CourseCreateUnit moduleInfo={moduleInfo} setModuleInfo={setModuleInfo} openCreateUnitModal={openCreateUnitModal} setOpenCreateUnitModal={setOpenCreateUnitModal}/>
          </div>

          <div className="row m-b-20 m-t-30">
            <div className="col-md-12">
              <InputGroup size="lg">
                <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search module or lesson here" type="search" onChange={(e) => onSearch(e.target.value)}/>
                <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
              </InputGroup>
            </div>
          </div>
          <EditLesson 
          sequenceNo={sequenceNo} 
          pageName={pageName} 
          content={content} 
          lessonId={lessonId}
          setContent={setContent}
          setPageName={setPageName}
          setSequenceNo={setSequenceNo}
          setSelectedLesson={setSelectedLesson} selectedLesson={selectedLesson} setLessonInfo={setLessonInfo} openEditLessonModal={openEditLessonModal} setOpenEditLessonModal={setOpenEditLessonModal}/>
          <CreateLesson 
            openCreateLessonModal={openCreateLessonModal} 
            setCreateLessonModal={setCreateLessonModal} 
            selectedLesson={selectedLesson} 
            setSelectedLesson={setSelectedLesson}
            setLessonInfo={setLessonInfo}
          />
          <Accordion defaultActiveKey="0">
            {moduleInfo.map((item, index) => {
              return(
                  <Accordion.Item eventKey={item.id}> 
                    <Accordion.Header onClick={(e) => {getCourseLessons(e, item.id, item.moduleName)}}>
                      <span className="unit-title">{item.moduleName}
                      {isContributor &&
                      <>
                        <Button className="btn-create-class" variant="link"  onClick={handleOpenCreateLessonModal}><i className="fa fa-plus"></i> Add Lesson</Button>
                        <div>
                        <span  className='dash-read-more' ><Link to={'#'} onClick={() => toggleModelEditModule(item?.id, item?.sequenceNo, item?.moduleDescription, item?.moduleName)}> Edit </Link></span> |
                          <span  className='dash-read-more' ><Link to={'#'} onClick={() => confirmSweetErrorModule(item.id)} > Delete </Link></span> 
                        </div>
                      </>
                      }
                      </span>
                    </Accordion.Header>
                    <Accordion.Body>                         
                        {lessonInfo.filter(li =>
                          li.pageName.toLowerCase().includes(filter.toLowerCase())).map
                          ((li, index) => {
                        return(
                          <Row>
                            <Col className="lesson-header" md={9} onClick={(e) => getModuleContent(e, moduleid, li.id, li?.pageName)}>
                             <p className="lessonName">{li?.pageName}</p>
                            </Col>
                            {isContributor &&
                              <Col className="align-right-content" md={3}>
                                <OverlayTrigger
                                  placement="bottom"
                                  delay={{ show: 1, hide: 0 }}
                                  overlay={renderTooltipEdit}>
                                    <Button key={li.id} className="m-r-5 color-white tficolorbg-button" size="sm" onClick={(e) => handleOpenEditLessonModal(e, li?.content, li?.pageName, li?.sequenceNo, li?.id )}><i className="fa fa-edit"></i></Button>
                                </OverlayTrigger>
                                <OverlayTrigger
                                  placement="bottom"
                                  delay={{ show: 1, hide: 0 }}
                                  overlay={renderTooltipDelete}>
                                    <Button className="m-r-5 color-white tficolorbg-button" size="sm" onClick={() => confirmSweetError(li.id)} ><i className="fa fa-trash"></i></Button>
                                </OverlayTrigger>
                              </Col>
                            }
                          </Row>
                        )
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                )
              })
            }
          <SweetAlert
            warning
            showCancel
            show={sweetError}
            confirmBtnText="Yes, delete it!"  
            confirmBtnBsStyle="danger"
            title="Are you sure?"
            onConfirm={() => deleteCourseLesson(itemId)}
            onCancel={cancelSweetError}
            focusCancelBtn
          >
            You will not be able to recover this Lesson!
        </SweetAlert>
        <SweetAlert
            warning
            showCancel
            show={sweetErrorModule}
            confirmBtnText="Yes, delete it!"  
            confirmBtnBsStyle="danger"
            title="Are you sure?"
            onConfirm={() => deleteModule(itemId)}
            onCancel={cancelSweetErrorModule}
            focusCancelBtn
          >
            You will not be able to recover this Module!
        </SweetAlert>
          </Accordion>
          <EditModule
            moduleName={moduleName}
            moduleDescription={moduleDescription}
            sequenceNo={sequenceNo}
            moduleId={moduleId}
            setModuleName={setModuleName}
            setModuleDescription={setModuleDescription} 
            setEditModuleModal={setEditModuleModal}
            setSequenceNo={setSequenceNo} 
            editModuleModal={editModuleModal}
            setModuleId={setModuleId}
            getCourseUnitInformation={getCourseUnitInformation}
            toggleModelEditModule={toggleModelEditModule} />
        </React.Fragment>}
    </CourseContent>
  )
}
