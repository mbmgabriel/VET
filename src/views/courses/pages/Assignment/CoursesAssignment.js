import React, { useState, useEffect, useContext } from "react";
import { Tab, Row, Col, Button, InputGroup, FormControl, Accordion, Tooltip, OverlayTrigger } from 'react-bootstrap';
import CoursesAPI from "../../../../api/CoursesAPI";
import CourseCreateUnit from "./../../components/CourseCreateUnit";
import CreateAssignment from "./../../components/CreateAssignment";
import EditAssignment from "./../../components/EditAssignment";
import SweetAlert from 'react-bootstrap-sweetalert';
import ViewAssignment from "./ViewAssignment";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CourseContent from "../../CourseContent";
import CourseBreadcrumbs from "../../components/CourseBreadcrumbs";
import { UserContext } from '../../../../context/UserContext';
import { set } from "react-hook-form";
import { useParams } from "react-router-dom";

export default function CoursesAssignment() {

  const [loading, setLoading] = useState(false)

  const [openCreateUnitModal, setOpenCreateUnitModal] = useState(false)
  const [openCreateAssignmentModal, setOpenCreateAssignmentModal] = useState(false)
  const [openEditAssignmentModal, setOpenEditAssignmentModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [assignmentInfo, setAssignmentInfo] = useState([])
  const [sweetError, setSweetError] = useState(false)
  const [assignmentId, setAssignmentId] = useState("")
  const [localModuleId, setLocalModuleId] = useState(false)
  const [filter, setFilter] = useState("")
  const [moduleInfo, setModuleInfo] = useState([])
  const [showAssignment, setShowAssignment] = useState(false);
  const [assignmmentName, setAssignmentName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [courseInfo, setCourseInfo] = useState("")
  const userContext = useContext(UserContext);
  const {user} = userContext.data;
  const courseid = sessionStorage.getItem('courseid')
  const moduleid = sessionStorage.getItem('moduleid')
  const subsType = user.subsType;
  const {id} = useParams()
  const [isContributor, setIsContributor] = useState(true);

  const getContributor = async() => {
    let response = await new CoursesAPI().getContributor(courseid)
    if(response.ok){
      let temp = response.data;
      let ifContri = temp.find(i => i.userInformation?.userId == user.userId);
      console.log(ifContri, user.userId)
      setIsContributor(ifContri ? true : false);
    }
  }
  const getCourseInformation = async() => {
    setLoading(true)
    let response = await new CoursesAPI().getCourseInformation(id)
    setLoading(false)
    if(response.ok){
      setCourseInfo(response.data)
    }else{
      toast.error("Something went wrong while fetching course information.");
    }
  }

  useEffect(() => {
    getContributor();
    getCourseInformation();
    if(subsType != 'LMS'){
      window.location.href = "/courses"
    }
  }, [])

  const handleOpenCreateUnitModal = () =>{
    setOpenCreateUnitModal(!openCreateUnitModal)
  }

  const handleOpenCreateAssignmentModal = () =>{
    setOpenCreateAssignmentModal(!openCreateAssignmentModal)
  }

  const handleOpenEditAssignmentModal = (e, assignmentName, instructions, assignmentId) =>{
    e.preventDefault()
    setAssignmentName(assignmentName)
    setInstructions(instructions)
    setAssignmentId(assignmentId)
    setOpenEditAssignmentModal(!openEditAssignmentModal)
  }

  const getAssignmentInfo = async(e, data) => {
    setLoading(true)
    setLocalModuleId(data)
    sessionStorage.setItem("moduleid", data)
    let response = await new CoursesAPI().getAssignmentInformation(data)
    setLoading(false)
    if(response.ok){
      setAssignmentInfo(response.data)
      console.log(response.data)
    }else{
      alert(response.data.errorMessage)
    }
  }

  const fetchAssignments = async() => {
    setLoading(true)
    let response = await new CoursesAPI().getAssignmentInformation(moduleid)
    setLoading(false)
    if(response.ok) {
      setAssignmentInfo(response.data.filter(item => item != null))
    }else{
      alert("Something went wrong while fetching assignment")
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
      alert("Something went wrong while fetching course unit1111111111")
    }
  }


  const cancelSweetError = () => {
    setSweetError(false)
  }

  const confirmSweetError = (id) => {
    notifyDeleteAssignment()
    deleteCourseAssignment(id)
    setSweetError(false)
  } 

  const deleteCourseAssignment = async(e, data) => {
    setLoading(true)
    let response = await new CoursesAPI().deleteAssignment(assignmentId)
    setLoading(false)
    if(response.ok){
      getAssignmentInfo(null, localModuleId)
      console.log(response.data)
    }else{
      alert(response.data.errorMessage)
    }
  }

  const onSearch = (text) => {
    setFilter(text)
  }

  const viewAss = (data) => {
    console.log(data)
    setAssignmentName(data.assignmentName);
    setSelectedAssignment(data)
    setShowAssignment(true)
  }

  useEffect(() => {
    getCourseUnitInformation()
  }, [])

  const notifyDeleteAssignment= () => 
  toast.error('Assignment Deleted!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const clickedTab = () => {
    setAssignmentName('');
    setShowAssignment(false);
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
      <CourseBreadcrumbs title={assignmmentName} clicked={() => clickedTab()}/>
      {
        showAssignment ?
          <ViewAssignment setShowAssignment={setShowAssignment} selectedAssignment={selectedAssignment} assignmentInfo={assignmentInfo} setAssignmentInfo={setAssignmentInfo}/>
        :
        <React.Fragment>
        <span className="content-pane-title col-md-10 pages-header fd-row">
          Assignment 
          <div>
            <Button onClick={() => getCourseUnitInformation()} className='ml-3'>
              <i className="fa fa-sync"></i>
            </Button>
          </div>

          <CourseCreateUnit moduleInfo={moduleInfo} setModuleInfo={setModuleInfo} openCreateUnitModal={openCreateUnitModal} setOpenCreateUnitModal={setOpenCreateUnitModal}/>
        </span>
        <div className="row m-b-20 m-t-30" onSearch={onSearch}>
          <div className="col-md-12">
            <InputGroup size="lg">
              <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search module or Assignment here" type="search" onChange={(e) => onSearch(e.target.value)} />
              <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
            </InputGroup>
          </div>
        </div>
        <CreateAssignment openCreateAssignmentModal={openCreateAssignmentModal} setOpenCreateAssignmentModal={setOpenCreateAssignmentModal} setAssignmentInfo={setAssignmentInfo}/>
        <EditAssignment 
        assignmentName={assignmmentName}
        instructions={instructions}
        assignmentId={assignmentId}
        setAssignmentName={setAssignmentName}
        setInstructions={setInstructions}
        setAssignmentInfo={setAssignmentInfo} selectedAssignment={selectedAssignment} openEditAssignmentModal={openEditAssignmentModal} setOpenEditAssignmentModal={setOpenEditAssignmentModal}/>
        <Accordion defaultActiveKey="0">
          {moduleInfo.map((item, index) => {
            return(
              <>
                <Accordion.Item eventKey={item.id}> 
                  <Accordion.Header onClick={(e) => getAssignmentInfo(e, item.id)}>
                    <span className="unit-title">{item.moduleName} 
                    { 
                      isContributor &&
                      <Button className="btn-create-class" variant="link" onClick={handleOpenCreateAssignmentModal}><i className="fa fa-plus"></i> Add Assignment</Button>
                    }
                    </span>
                  </Accordion.Header>
                  <Accordion.Body>
                    {assignmentInfo.filter(item => 
                      item.assignmentName.toLowerCase().includes(filter.toLowerCase())
                    ).map((as, index) => (
                      <Row>
                        <Col className="lesson-header" md={9} >
                          <span onClick={(e) => {viewAss(as)}}>{as?.assignmentName}</span>
                        </Col>
                        {isContributor &&
                          <>
                            <Col className="align-right-content" md={3}>
                              <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 1, hide: 25 }}
                                overlay={renderTooltipEdit}>
                                  <Button className="m-r-5 color-white tficolorbg-button" size="sm" onClick={(e) => handleOpenEditAssignmentModal(e, as?.assignmentName, as?.instructions, as?.id)}><i className="fa fa-edit"></i></Button>
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 1, hide: 25 }}
                                overlay={renderTooltipDelete}> 
                                <Button className="m-r-5 color-white tficolorbg-button" size="sm" onClick={() => {setSweetError(true); setAssignmentId(as.id)}}><i className="fa fa-trash"  ></i></Button>
                              </OverlayTrigger>
                            </Col>
                            {assignmentInfo.length == 0 && !loading && <div className="no-exams">No assignment found...</div>}
                          </>
                        }
                      </Row>
                    ))}
                    <SweetAlert
                      warning
                      showCancel
                      show={sweetError}
                      confirmBtnText= "Yes"
                      confirmBtnBsStyle="danger"
                      title="Are you sure?"
                      onConfirm={() => confirmSweetError(item.id)}
                      onCancel={cancelSweetError}
                      focusCancelBtn
                    >
                      You will not be able to recover this Assignment!
                    </SweetAlert>
                  </Accordion.Body>
                </Accordion.Item>
              </>
              )
            })
          }
        </Accordion>
      </React.Fragment>
      }
    </CourseContent>
  )
}
