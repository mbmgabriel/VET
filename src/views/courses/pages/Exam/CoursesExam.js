import React, { useState, useEffect, useContext } from "react";
import { Tab, Row, Col, Button, InputGroup, FormControl, Accordion, Tooltip, OverlayTrigger } from 'react-bootstrap';
import CoursesAPI from "../../../../api/CoursesAPI";
import CourseCreateUnit from "./../../components/CourseCreateUnit";
import CreateLesson from "./../../components/CreateLesson";
import EditExam from "./../../components/EditExam";
import CreateExam from "../CreateExam";
import SweetAlert from 'react-bootstrap-sweetalert';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from "react-router";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import Status from "../../../../components/utilities/Status";
import CourseContent from "../../CourseContent";
import ExamCreation from "../../../exam-creation/ExamCreation";
import CourseBreadcrumbs from "../../components/CourseBreadcrumbs";
import { UserContext } from '../../../../context/UserContext';
import FullScreenLoader from "../../../../components/loaders/FullScreenLoader";
import ContentViewer from "../../../../components/content_field/ContentViewer";


export default function CoursesExam() {
  const {id} = useParams();
  const [loading, setLoading] = useState(false)
  const [showExam, setShowExam] = useState(false)
  const [openCreateExamModal, setOpenCreateExamModal] = useState(false)
  const [openEditExamModal, setOpenEditExamModal] = useState(false)
  const [moduleInfo, setModuleInfo] = useState([])
  const [examInfo, setExamInfo] = useState([])
  const [selectedExam, setSelectedExam] = useState(null)
  const [sweetError, setSweetError] = useState(false)
  const [filter, setFilter] = useState("")
  const [examName, setExamName] = useState('');
  const [courseInfo, setCourseInfo] = useState("")
  const courseid = sessionStorage.getItem('courseid')
  const moduleid = sessionStorage.getItem('moduleid')
  const userContext = useContext(UserContext);
  const {user} = userContext.data;
  const subsType = user.subsType;
  const [isContributor, setIsContributor] = useState(true);
  const [examId, setExamId] = useState('')

  const getContributor = async() => {
    let response = await new CoursesAPI().getContributor(id)
    if(response.ok){
      let temp = response.data;
      let ifContri = temp.find(i => i.userInformation?.userId == user.userId);
      setIsContributor(ifContri ? true : false);
    }
  }
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
    getContributor();
    if(courseid != null){
      getCourseInformation();
    }
    // if(subsType != 'LMS'){
    //   window.location.href = "/courses"
    // }
  }, [])

  const handleOpenCreateExamModal = () =>{
    setOpenCreateExamModal(!openCreateExamModal)
  }

  const handleOpenEditExamModal = (e, item) =>{
    e.preventDefault()
    setSelectedExam(item)
    setOpenEditExamModal(true)
  }

  const getCourseUnitInformation = async(e) => {
    setLoading(true)
    let response = await new CoursesAPI().getCourseUnit(id)
    if(response.ok){
    setLoading(false)
      setModuleInfo(response.data)
    }else{
      toast.error('Something went wrong while fetching all course info')
    }
  }

  const getExamInfo = async(e, data) => {
    setLoading(true)
    sessionStorage.setItem('moduleid', data)
    let response = await new CoursesAPI().getExamInformation(data)
    setLoading(false)
    if(response.ok){
      setExamInfo(response.data)
    }else{
      toast.error('Something went wrong while fetching all exam info')
    }
  }

  const cancelSweetError = () => {
    setSweetError(false)
  }

  // const confirmSweetError = (id) => {
  //   deleteCourseExam(id)
  //   setSweetError(false)
  // } 

  const onSearch = (text) => {
    setFilter(text)
  }

  const handlDeleteExam = (id) =>{
    setSweetError(true)
    setExamId(id)
  }

  const deleteCourseExam = async(data) => {
    setLoading(true)
    let response = await new CoursesAPI().deleteExam(data)
    setLoading(false)
    if(response.ok){
      notifyDeletedExam()
      getExamInfo(null, moduleid)
      cancelSweetError()
    }else{
      alert("Something went wrong while fetching all pages")
    }
  }

  const notifyDeletedExam = () => 
  toast.error('Exam Deleted!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  useEffect(() => {
    
    getCourseUnitInformation()
  }, [])

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

  const clickName = (data) => {
    setShowExam(true);
    setExamName(data.testName);
  }

  const clickTab = () => {
    setShowExam(false);
    setExamName('')
  }

  return (
    <CourseContent>
      {loading && <FullScreenLoader />}
      <CourseBreadcrumbs title={examName} clicked={() => clickTab()}/>
        <React.Fragment>
        <span className="content-pane-title col-md-10 pages-header fd-row">
            Exam 
          <div>
            <Button onClick={() => getCourseUnitInformation()} className='ml-3'>
              <i className="fa fa-sync"></i>
            </Button>
          </div>
          </span>
          <div className="row m-b-20 m-t-30" onSearch={onSearch}>
            <div className="col-md-12">
              <InputGroup size="lg">
                <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search module or Exam here" type="search" onChange={(e) => onSearch(e.target.value)} />
                <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
              </InputGroup>
            </div>
          </div>
          <EditExam setExamInfo={setExamInfo} examInfo={examInfo} selectedExam={selectedExam} openEditExamModal={openEditExamModal} setOpenEditExamModal={setOpenEditExamModal}/>
          <CreateExam examInfo={examInfo} setExamInfo={setExamInfo} openCreateExamModal={openCreateExamModal} setOpenCreateExamModal={setOpenCreateExamModal}/>
          <Accordion defaultActiveKey="0">
            {moduleInfo.map((item, index) => {
              return(
                <Accordion.Item eventKey={item.id}> 
                  <Accordion.Header onClick={(e) => getExamInfo(e, item.id)}>
                    <span className="unit-title">{item.moduleName} 
                    {
                    isContributor &&
                      <Button className="btn-create-class" variant="link" onClick={handleOpenCreateExamModal}><i className="fa fa-plus"></i> Add Exam</Button>
                    }
                    </span>
                  </Accordion.Header>
                  <Accordion.Body>
                    {examInfo.filter(ei =>
                      ei.testName.toLowerCase().includes(filter.toLowerCase())).map
                      ((ei, index) => {
                      return(
                        <>
                        <Row>
                          <Col className="" md={11}>
                          <Link className="lesson-header" to={`/course/${id}/exam/${ei.id}`}>
                              {ei?.testName}
                            </Link>
                            <ContentViewer className='mb-2'>{ei?.testInstructions}</ContentViewer>

                            {/* <div>
                             <p dangerouslySetInnerHTML={{__html:ei?.testInstructions }} />
                            </div> */}
                          </Col>
                          {isContributor &&
                            <Col className="align-right-content" md={1}>
                              <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 1, hide: 25 }}
                                overlay={renderTooltipEdit}>
                                  <Button className="m-r-5 color-white tficolorbg-button" size="sm" onClick={(e) => handleOpenEditExamModal(e, ei)}><i className="fa fa-edit"></i></Button>
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 1, hide: 25 }}
                                overlay={renderTooltipDelete}>
                                <Button className="m-r-5 color-white tficolorbg-button" size="sm" onClick={() => handlDeleteExam(ei.id)}><i className="fa fa-trash" ></i></Button>
                              </OverlayTrigger>
                            </Col>
                          }
                          {examInfo.length == 0 && !loading && <div className="no-exams">No exam found...</div>}
                        </Row>
                        <hr></hr>
                        </>
                      )
                    })}
                  </Accordion.Body>
                </Accordion.Item>
                )
              })
            }
          </Accordion>
          <SweetAlert
                                warning
                                showCancel
                                show={sweetError}
                                confirmBtnText="Yes, delete it!"
                                confirmBtnBsStyle="danger"
                                title="Are you sure?"
                                onConfirm={() => deleteCourseExam(examId)}
                                onCancel={cancelSweetError}
                                focusCancelBtn
                              >
                                You will not be able to recover this imaginary file!
                              </SweetAlert>
        </React.Fragment>
    </CourseContent>
  )
}
