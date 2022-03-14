import React, { useState, useEffect } from "react";
import { Tab, Row, Col, Button, InputGroup, FormControl, Accordion, Tooltip, OverlayTrigger } from 'react-bootstrap';
import CoursesAPI from "../../../../api/CoursesAPI";
import CourseCreateUnit from "./../../components/CourseCreateUnit";
import CreateLesson from "./../../components/CreateLesson";
import EditExam from "./../../components/EditExam";
import CreateExam from "../CreateExam";
import SweetAlert from 'react-bootstrap-sweetalert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import Status from "../../../../components/utilities/Status";


export default function CoursesExam({moduleInfo, setModuleInfo, moduleId}) {

  const [loading, setLoading] = useState(false)

  const [openCreateExamModal, setOpenCreateExamModal] = useState(false)
  const [openEditExamModal, setOpenEditExamModal] = useState(false)
  // const [moduleInfo, setModuleInfo] = useState([])
  const [examInfo, setExamInfo] = useState([])
  const [selectedExam, setSelectedExam] = useState(null)
  const [sweetError, setSweetError] = useState(false)
  const [filter, setFilter] = useState("")

  const courseid = sessionStorage.getItem('courseid')
  const moduleid = sessionStorage.getItem('moduleid')

  const handleOpenCreateExamModal = () =>{
    setOpenCreateExamModal(!openCreateExamModal)
  }

  const handleOpenEditExamModal = (e, item) =>{
    e.preventDefault()
    setSelectedExam(item)
    setOpenEditExamModal(!openEditExamModal)
  }

  const getCourseUnitInformation = async(e) => {
    setLoading(true)
    let response = await new CoursesAPI().getCourseUnit(courseid)
    setLoading(false)
    if(response.ok){
      setModuleInfo(response.data)
    }else{
      alert("Something went wrong while fetching all exam")
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
      alert("Something went wrong while fetching all exam")
    }
  }

  const cancelSweetError = () => {
    setSweetError(false)
  }

  const confirmSweetError = (id) => {
    deleteCourseExam(id)
    setSweetError(false)
  } 

  const onSearch = (text) => {
    setFilter(text)
  }

  const deleteCourseExam = async(data) => {
    setLoading(true)
    let response = await new CoursesAPI().deleteExam(data)
    setLoading(false)
    if(response.ok){
      notifyDeletedExam()
      getExamInfo(null, moduleid)
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

  return (
    <React.Fragment>
      <span className="content-pane-title">
        Exam 
      </span>
      <div className="row m-b-20 m-t-30" onSearch={onSearch}>
        <div className="col-md-12">
          <InputGroup size="lg">
            <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search..." type="search" onChange={(e) => onSearch(e.target.value)} />
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
                <span className="unit-title">{item.moduleName} <Button className="m-l-10" variant="outline-warning" onClick={handleOpenCreateExamModal}><i className="fa fa-plus"></i> Add Exam</Button>
                </span>
              </Accordion.Header>
              <Accordion.Body>
                {examInfo.filter(ei =>
                  ei.testName.toLowerCase().includes(filter.toLowerCase())).map
                  ((ei, index) => {
                  return(
                    <>
                    <Row style={{margin:'10px', marginRight:'30px'}}>
                      <Col className="" md={9}>
                        <Link className="lesson-header" to={`/exam_creation/${ei?.id}`}>
                          {ei?.testName}
                        </Link>
                        <div>
                          {ei?.testInstructions}
                        </div>
                      </Col>
                      <Col className="align-right-content" md={3}>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 1, hide: 25 }}
                        overlay={renderTooltipEdit}>
                          <Button className="m-r-5 color-white tficolorbg-button" size="sm" onClick={(e) => handleOpenEditExamModal(e, ei)}><i className="fa fa-edit"></i></Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 1, hide: 25 }}
                        overlay={renderTooltipDelete}>
                        <Button className="m-r-5 color-white tficolorbg-button" size="sm" onClick={() => setSweetError(true)}><i className="fa fa-trash" ></i></Button>
                      </OverlayTrigger>
                        <SweetAlert
                          warning
                          showCancel
                          show={sweetError}
                          confirmBtnText="Yes, delete it!"
                          confirmBtnBsStyle="danger"
                          title="Are you sure?"
                          onConfirm={() => confirmSweetError(ei.id)}
                          onCancel={cancelSweetError}
                          focusCancelBtn
                        >
                          You will not be able to recover this imaginary file!
                        </SweetAlert>
                      </Col>
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
    </React.Fragment> 
  )
}
