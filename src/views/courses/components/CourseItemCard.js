import React, { useState, useEffect, useContext } from "react";
import { Card, Dropdown, Row, Col, Tooltip, OverlayTrigger, Modal, Button } from 'react-bootstrap';
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.css"
import { Link } from 'react-router-dom'
import userEvent from "@testing-library/user-event";
import { UserContext } from './../../../context/UserContext'
import CoursesAPI from "../../../api/CoursesAPI";
import { ToastContainer, toast } from 'react-toastify';

export default function CoursesItemCard({courseCover, courseId, courseName, subjectAreaName, description, authorName, courseInfo, setOpenEditModal, setSelectedCourse, getCourses, uploadModalTrigger}) {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [openDropdown, setOpenDropdown] = useState(false)
  const [data, setData] = useState([])
  const [uploadModal, setUploadModal] = useState(false);
  const [fileToUpload, setFileToUpload] = useState({});
  const [id, setId] = useState('');
  const [isContributor, setIsContributor] = useState(true);

  useEffect(() => {
    getContributor()
  }, [])
 
  const handleOpeEditModal = (e, item) => {
    e.preventDefault() 
    sessionStorage.setItem('courseid', item.id)
    setSelectedCourse(item)
    setOpenEditModal(true)
  }

  const getContributor = async() => {
    let response = await new CoursesAPI().getContributor(courseId)
    if(response.ok){
      let temp = response.data;
      let ifContri = temp.find(i => i.userInformation?.userId == user.userId);
      console.log(ifContri, user.userId)
      setIsContributor(ifContri ? true : false);
    }
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

  console.log('qweqwe:', courseCover)

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit
    </Tooltip>
  )
  
  return (
    <>
      <Card className="card-design b-0px m-r-10">
            <Card.Header className="card-header-courses" style={{ backgroundImage: `url(${courseCover})` }}>
          <Row style={{color:"white"}}>
              {user.isTeacher && isContributor &&
                  <>
                    <Col md={12}>
                        {authorName !== "Techfactors Inc." && 
                          <OverlayTrigger
                          placement="right"
                          delay={{ show: 10, hide: 25 }}
                          overlay={renderTooltip}>
                          <Dropdown className="float-right" isOpen={openDropdown} toggle={()=> setOpenDropdown(!openDropdown)}>
                            <Dropdown.Toggle data-toggle="dropdown" as={CustomToggle} >
                              <i className="fa fa-ellipsis-v fa-2x"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                            <Dropdown.Item onClick={(e) => handleOpeEditModal(e, courseInfo)}>
                            Edit 
                            </Dropdown.Item>
                            <Dropdown.Item onClick={(e) =>uploadModalTrigger(courseInfo)}>
                            Upload Cover
                            </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                          </OverlayTrigger>
                        }
                        {authorName === "Techfactors Inc." && user.teacher.positionID === 7 && isContributor &&
                          <OverlayTrigger
                          placement="right"
                          delay={{ show: 10, hide: 25 }}
                          overlay={renderTooltip}>
                          <Dropdown className="float-right" isOpen={openDropdown} toggle={()=> setOpenDropdown(!openDropdown)}>
                            <Dropdown.Toggle data-toggle="dropdown" as={CustomToggle} >
                              <i className="fa fa-ellipsis-v fa-2x"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                            <Dropdown.Item onClick={(e) => handleOpeEditModal(e, courseInfo)}>
                            Edit 
                            </Dropdown.Item>
                            <Dropdown.Item>
                            Delete
                            </Dropdown.Item>
                            <Dropdown.Item onClick={(e) => uploadModalTrigger(courseInfo)}>
                            Upload Cover
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
                  {courseName.substring(0, 20)}...
              </Card.Title>
              <Card.Subtitle
                  className="mb-2 text-muted"
                  tag="h6"
              >
                  {subjectAreaName}
              </Card.Subtitle>
              <Card.Text>
                {description}
                {courseCover === null && "No Cover"}
              </Card.Text>
              <Card.Text>
                {authorName}
              </Card.Text>
          </Card.Body>
      </Card>
    </>
  )
}
