import React, { useState, useEffect } from "react";
import { Tab, Row, Col, Button, InputGroup, FormControl, Accordion, Tooltip, OverlayTrigger } from 'react-bootstrap';
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

import { useParams } from "react-router";

export default function CourseLearn() {

  const {id} = useParams()
  console.log(id, 'sasasasas')

  const [loading, setLoading] = useState(false)
  const [openCreateUnitModal, setOpenCreateUnitModal] = useState(false)
  const [openCreateLessonModal, setCreateLessonModal] = useState(false)
  const [openEditLessonModal, setOpenEditLessonModal] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [lessonInfo, setLessonInfo] = useState([])
  const [lessonContent, setLessonContent] = useState([])
  const [sweetError, setSweetError] = useState(false)
  const [filter, setFilter] = useState("");
  const [courseInfo, setCourseInfo] = useState("")
  const [viewLesson, setViewLesson] = useState(false)
  const [moduleInfo, setModuleInfo] = useState([]);
  const [itemId, setItemId] = useState('')
  const [clickedModule, setClickedModule] = useState('');

  const courseid = sessionStorage.getItem('courseid')
  const moduleid = sessionStorage.getItem('moduleid')

  console.log('lessonInfo:', lessonInfo)

  const handleOpenCreateUnitModal = () =>{
    setOpenCreateUnitModal(!openCreateUnitModal)
  }

  const handleOpenCreateLessonModal = () =>{
    setCreateLessonModal(!openCreateLessonModal)
  }

  const handleOpenEditLessonModal = (e, item) =>{
    e.preventDefault()
    setSelectedLesson(item)
    console.log(item)
    setOpenEditLessonModal(!openEditLessonModal)
  }

  const cancelSweetError = () => {
    setSweetError(false)
  }



  const confirmSweetError = (id) => {
    setItemId(id)
    setSweetError(true)
  } 

  const getCourseLessons = async(e, data, modulename) => {
    setLoading(true)
    sessionStorage.setItem('moduleid', data)
    sessionStorage.setItem('modulename', modulename)
    let response = await new CoursesAPI().getCourseUnitPages(id, data)
    setLoading(false)
    if(response.ok){
      setLessonInfo(response.data)
      console.log(response.data)
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
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching course information")
    }
  }

  const getCourseUnitInformation = async(e) => {
    setLoading(true)
    let response = await new CoursesAPI().getCourseUnit(id)
    setLoading(false)
    if(response.ok){
      setModuleInfo(response.data)
      console.log(response, '...............')
    }else{
      alert("Something went wrong while fetching course unit")
    }
  }

  const deleteCourseLesson = async(data) => {
    let response = await new CoursesAPI().deleteLesson(data)
    if(response.ok){
      notifyDeleteLesson()
      setSweetError(false)
      getCourseLessons(null, moduleid)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all pages")
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
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
  }

  const onSearch = (text) => {
    setFilter(text)
  }

  useEffect(() => {
    getCourseUnitInformation();
    getCourseInformation();
  }, [])

  const notifyDeleteLesson= () => 
  toast.error('Lesson Deleted!', {
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
      <CourseBreadcrumbs title={clickedModule} clicked={() => clickedTab()}/>
      {viewLesson ? 
          <CoursesLearnContent courseInfo={courseInfo} setCourseInfo={setCourseInfo} setLessonContent={setLessonContent} lessonContent={lessonContent}/>
        :
        <React.Fragment>
          <span className="content-pane-title">
            Learn <Button className="btn-create-class" variant="link" onClick={handleOpenCreateUnitModal}><i className="fa fa-plus"></i> Add Unit</Button>
            <CourseCreateUnit moduleInfo={moduleInfo} setModuleInfo={setModuleInfo} openCreateUnitModal={openCreateUnitModal} setOpenCreateUnitModal={setOpenCreateUnitModal}/>
          </span>
          <div className="row m-b-20 m-t-30">
            <div className="col-md-12">
              <InputGroup size="lg">
                <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search unit or lesson here" type="search" onChange={(e) => onSearch(e.target.value)}/>
                <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
              </InputGroup>
            </div>
          </div>
          <EditLesson selectedLesson={selectedLesson} setLessonInfo={setLessonInfo} openEditLessonModal={openEditLessonModal} setOpenEditLessonModal={setOpenEditLessonModal}/>
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
                      <span className="unit-title">{item.moduleName} <Button className="btn-create-class" variant="link"  onClick={handleOpenCreateLessonModal}><i className="fa fa-plus"></i> Add Lesson</Button>
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
                            <Col className="align-right-content" md={3}>
                              <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 1, hide: 0 }}
                                overlay={renderTooltipEdit}>
                                  <Button key={li.id} className="m-r-5 color-white tficolorbg-button" size="sm" onClick={(e) => handleOpenEditLessonModal(e, li)}><i className="fa fa-edit"></i></Button>
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 1, hide: 0 }}
                                overlay={renderTooltipDelete}>
                                  <Button className="m-r-5 color-white tficolorbg-button" size="sm" onClick={() => confirmSweetError(li.id)} ><i className="fa fa-trash"></i></Button>
                              </OverlayTrigger>
                            </Col>
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
          </Accordion>
        </React.Fragment>}
    </CourseContent>
  )
}
