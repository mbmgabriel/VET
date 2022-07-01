import React, { useState, useEffect, useContext } from "react";
import { Card, Dropdown, Row, Col, Tooltip, OverlayTrigger, Modal, Button } from 'react-bootstrap';
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.css"
import { Link } from 'react-router-dom'
import userEvent from "@testing-library/user-event";
import { UserContext } from './../../../context/UserContext'
import CoursesAPI from "../../../api/CoursesAPI";
import SchoolAPI from "../../../api/SchoolAPI";
import { ToastContainer, toast } from 'react-toastify';

export default function CoursesItem({subjectAreaName, filter, getCourses, setFilter, course, setLoading, setOpenEditModal, setSelectedCourse}) {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [openDropdown, setOpenDropdown] = useState(false)
  const [data, setData] = useState([])
  const [uploadModal, setUploadModal] = useState(false);
  const [fileToUpload, setFileToUpload] = useState({});
  const [id, setId] = useState('');
  const [contributorModal, setContributorModal] = useState(false);
  const [teachersList, setTeachersList] = useState([]);
  const [contributorsList, setContributorsList] = useState([]);
  const [courseID, setCourseID] = useState('');
  const [courseInfo, setCourseInfo] = useState({});
  const [authorId, setAuthorId] = useState('');

  const handleOpeEditModal = (e, item) => {
    e.preventDefault()
    sessionStorage.setItem('courseid', item.id)
    setSelectedCourse(item)
    setOpenEditModal(true)
  }


  const setCourseId = (item) => {
    sessionStorage.setItem('courseid', item)
    sessionStorage.setItem('breadname', "Learn")
  } 

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span 
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >{children}</span>
  ))

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit
    </Tooltip>
  )

  const handleClickedUploadModal = (e, item) => {
    e.preventDefault();
    setSelectedCourse(item)
    setUploadModal(true);
    console.log(item)
    setId(item.id)
  }

  const handleUploadCover = async() => {
    console.log(fileToUpload)
    setUploadModal(false)
    let response = await new CoursesAPI().uploadCover(id, fileToUpload)
    if(response.ok){
      toast.success('Cover image uploaded successfully.');
      getCourses()
    }else{
      toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
    }
  }

  const getTeacherList = async() => {
    console.log(fileToUpload)
    setUploadModal(false)
    let response = await new SchoolAPI().getTeachers()
    if(response.ok){
      setTeachersList(response.data)
    }else{
      toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
    }
  }

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const handleSetFiles = (file) => {
    console.log(file);
    if(file != ''){
      getBase64(file).then(
        data => {
          let toAdd = {
            fileName: file.name,
            base64String: data,
          };
          setFileToUpload(toAdd);
        }
      );
    }
  }

  const getCourseInfo = async(id) => {
    let response = await new CoursesAPI().getCourseInformation(id)
    if(response.ok){
      setCourseInfo(response.data)
      setAuthorId(response.data.createdBy)
      console.log(response, '-=-=-')
    }else{
      alert("Something went wrong while fetching course information")
    }
  }

  const handleGetContributors = async(id) => {
    let response = await new CoursesAPI().getContributor(id)
    if(response.ok){
      setContributorsList([...response.data])
    }else{
      toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
    }
  }

  const addContributor = async(item) => {
    console.log(item)
    let data = {
      "courseId": courseID,
      "userAccountId": item.userAccountID,
    }
    let response = await new CoursesAPI().addDistributor(courseID, data)
    if(response.ok){
      toast.success('Contributor added successfully');
      handleGetContributors(courseID);
    }else{
      toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
    }
  }

  const handleClickContributor = (id) => {
    setContributorModal(!contributorModal)
    getTeacherList()
    handleGetContributors(id)
    setCourseID(id)
    getCourseInfo(id)
  }

  const handleRemoveContributor = async(data) => {
    console.log(data)
    if(data.distributorInformation.userAccountId == authorId){
      toast.error("You can't remove the author of this course.")
    }else{
      let response = await new CoursesAPI().removeContributor(courseID, data.distributorInformation.id)
      if(response.ok){
        toast.success('Contributor removed successfully');
        handleGetContributors(courseID);
      }else{
        toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
      }
    }
  }

  const handleDisplayUploadMOdal = () => {
    return(
      <Modal size="lg" className="modal-all" show={uploadModal} onHide={()=> setUploadModal(false)} >
				<Modal.Header className="modal-header" closeButton>
          Upload Cover
				</Modal.Header>
					<Modal.Body className="modal-label b-0px">
            <Col>
              <input className='' accept="image/png, image/gif, image/jpeg" type='file' style={{ backgroundColor: 'inherit' }} onChange={(e) => handleSetFiles(e.target.files[0])} />
            </Col>
            <Button onClick={() => handleUploadCover()} className="m-r-5 color-white tficolorbg-button float-right" size="sm">UPLOAD</Button>
					</Modal.Body>
			</Modal>
    )
  }

  const handleDisplayContributorMOdal = () => {
    return(
      <Modal size="lg" className="modal-all" show={contributorModal} onHide={()=> setContributorModal(false)} >
				<Modal.Header className="modal-header" closeButton>
          Contributor
				</Modal.Header>
					<Modal.Body className="modal-label b-0px">
           <Row>
              <Col md={6}>
                <div className='contributors-container'>
                  <p className="font-20">Contributor/s</p>
                  {
                    contributorsList.map((contributor, key) => {
                      return (
                        <Row className="mb-3">
                          <Col md={8}>
                            <span>{contributor.userInformation.firstname} {contributor.userInformation.lastname} </span>
                          </Col>
                          <Col>
                            <span><i onClick={() => handleRemoveContributor(contributor)} className="fa fa-minus bg-danger color-white d-flex justify-content-center align-items-center br-3" style={{width: 23, height: 23}}/></span>
                          </Col>
                        </Row>
                      )
                    })
                  }
                </div>
              </Col>
              <Col md={6}>
                <div className='contributors-container'>
                <p className="font-20">Teacher/s</p>
                {
                  teachersList.map((teacher, key) => {
                    return (
                    <Row className="mb-3">
                      <Col md={8}>
                        <span className="w-75">{teacher.fname} {teacher.lname}</span>
                      </Col>
                      <Col>
                        <span><i onClick={() => addContributor(teacher)} className="fa fa-plus tficolorbg-button color-white d-flex justify-content-center align-items-center br-3" style={{width: 23, height: 23}}/></span>
                      </Col>
                    </Row>
                      )
                  })
                }
                </div>
              </Col>
           </Row>
            {/* <Button onClick={() => handleContributorCover()} className="m-r-5 color-white tficolorbg-button float-right" size="sm">UPLOAD</Button> */}
					</Modal.Body>
			</Modal>
    )
  }

  useEffect(() => {
    localStorage.setItem('typeresource', 'course')
  });
  
  return (
    <React.Fragment>
        { subjectAreaName.filter(item =>
          item.courseName.toLowerCase().includes(filter.toLowerCase())).map
          ((item, index) => {  
        return(
          <>
          {item?.status?(<>
            <Link to={user.isTeacher ? `coursecontent/${item.id}/learn` : `/school_courses/${item.id}`} onClick={() => setCourseId(item.id)} course={course} setLoading={setLoading} className="active card-title">
            <Card className="card-design b-0px m-r-10">
              {/* <Card.Header className="card-header-courses" style={{backgroundImage: `url(${"https://cdn.tekteachlms.com/tficontent/_cover/Basic_calculus.jpg"})`}}> */}
                  <Card.Header className="card-header-courses" style={{ backgroundImage: `url(${item.courseCover})` }}>
                <Row style={{color:"white"}}>
                    {user.isTeacher && 
                        <>
                          <Col md={12}>
                              {/* <i className="fa fa-lock fa-2x"></i> */}
                              {item.authorName !== "Techfactors Inc." && 
                                <OverlayTrigger
                                placement="right"
                                delay={{ show: 10, hide: 25 }}
                                overlay={renderTooltip}>
                                <Dropdown className="float-right" isOpen={openDropdown} toggle={()=> setOpenDropdown(!openDropdown)}>
                                  <Dropdown.Toggle data-toggle="dropdown" as={CustomToggle} >
                                    <i className="fa fa-ellipsis-v fa-2x"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                  <Dropdown.Item onClick={(e) => handleOpeEditModal(e, item)}>
                                  Edit 
                                  </Dropdown.Item>
                                  {/* <Dropdown.Item>
                                  Delete
                                  </Dropdown.Item> */}
                                  <Dropdown.Item onClick={(e) => handleClickedUploadModal(e, item)}>
                                  Upload Cover
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={(e) => handleClickContributor(item.id)}>
                                    Contributor
                                  </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                                </OverlayTrigger>
                              }
                              {item.authorName === "Techfactors Inc." && user.teacher.positionID === 7 &&
                                <OverlayTrigger
                                placement="right"
                                delay={{ show: 10, hide: 25 }}
                                overlay={renderTooltip}>
                                <Dropdown className="float-right" isOpen={openDropdown} toggle={()=> setOpenDropdown(!openDropdown)}>
                                  <Dropdown.Toggle data-toggle="dropdown" as={CustomToggle} >
                                    <i className="fa fa-ellipsis-v fa-2x"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                  <Dropdown.Item onClick={(e) => handleOpeEditModal(e, item)}>
                                  Edit 
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                  Delete
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={(e) => handleClickedUploadModal(e, item)}>
                                  Upload Cover
                                  </Dropdown.Item>
                                  <Dropdown.Item onClick={(e) => handleClickContributor(item.id)}>
                                    Contributor
                                  </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                                </OverlayTrigger>
                              }
                            </Col>
                        </>
                      }
                    <Col md={12} className="t-a-c m-t-20">
                      {/* <i className="fa fa-book-open fa-7x"></i> */}
                    </Col>
                </Row>
              </Card.Header>
                <Card.Body>
                    <Card.Title tag="h5">
                        {item.courseName.substring(0, 20)}...
                    </Card.Title>
                    <Card.Subtitle
                        className="mb-2 text-muted"
                        tag="h6"
                    >
                        {item.subjectArea.subjectAreaName}
                    </Card.Subtitle>
                    <Card.Text>
                      {item.description}
                      {item.courseCover === null && "No Cover"}
                    </Card.Text>
                    <Card.Text>
                      {item.authorName}
                    </Card.Text>
                </Card.Body>
            </Card>
            </Link>
          </>):(<></>)}

          </>
        )
        })  
    }
    {handleDisplayUploadMOdal()}
    {handleDisplayContributorMOdal()}
    </React.Fragment>
  )
}
