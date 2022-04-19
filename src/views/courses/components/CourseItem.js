import React, { useState, useEffect, useContext } from "react";
import { Card, Dropdown, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import "../../../../node_modules/@fortawesome/fontawesome-free/css/all.css"
import { Link } from 'react-router-dom'
import userEvent from "@testing-library/user-event";
import { UserContext } from './../../../context/UserContext'

export default function CoursesItem({subjectAreaName, filter, setFilter, course, setLoading, setOpenEditModal, setSelectedCourse}) {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [openDropdown, setOpenDropdown] = useState(false)
  const [data, setData] = useState([])
  
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
  
  return (
    <React.Fragment>
        {subjectAreaName.filter(item =>
          item.courseName.toLowerCase().includes(filter.toLowerCase())).map
          ((item, index) => {  
        return(
          <Col md={3}>
            <Link to={user.isTeacher ? `coursecontent/${item.id}/learn` : `/school_courses/${item.id}`} onClick={() => setCourseId(item.id)} course={course} setLoading={setLoading} className="active card-title">
            
            <Card className="card-design b-0px">
              <Card.Header className="card-header-courses">
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
                                  <Dropdown.Item>
                                  Delete
                                  </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                                </OverlayTrigger>
                              }
                            </Col>
                        </>
                      }
                    <Col md={12} className="t-a-c m-t-20">
                      <i className="fa fa-book-open fa-7x"></i>
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
                    </Card.Text>
                    <Card.Text>
                      {item.authorName}
                    </Card.Text>
                </Card.Body>
            </Card>
            </Link>
          </Col>
        )
        })  
    }
    </React.Fragment>
  )
}
