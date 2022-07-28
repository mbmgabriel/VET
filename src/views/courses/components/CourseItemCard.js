import React, { useState, useEffect, useContext } from "react";
import { Card, Dropdown, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.css"
import { UserContext } from './../../../context/UserContext'
import CoursesAPI from "../../../api/CoursesAPI";

export default function CoursesItemCard({courseCover, courseId, courseName, subjectAreaName, description, authorName, courseInfo, setOpenEditModal, setSelectedCourse, getCourses, uploadModalTrigger, handleClickContributor}) {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [openDropdown, setOpenDropdown] = useState(false)
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
                        <Dropdown.Item onClick={(e) => uploadModalTrigger(courseInfo)}>
                          Upload Cover
                        </Dropdown.Item>
                        <Dropdown.Item onClick={(e) => handleClickContributor(courseInfo.id)}>
                          Contributor
                        </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      </OverlayTrigger>
                    </Col>
                  </>
                }
              <Col md={12} className="t-a-c m-t-20">
              </Col>
          </Row>
        </Card.Header>
          <Card.Body>
              <OverlayTrigger
                placement="top"
                delay={{ show: 1, hide: 0 }}
                overlay={(props) => 
                  <Tooltip id="button-tooltip" {...props}>
                    {courseName}
                  </Tooltip>}
              >
                <Card.Title tag="h5">
                  {courseName?.length > 20 ? `${courseName.substring(0, 20)}...` : courseName}
                </Card.Title>
              </OverlayTrigger>

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
