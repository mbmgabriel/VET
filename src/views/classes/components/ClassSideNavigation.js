import React, {useState, useEffect, useContext} from 'react'
import {ListGroup, Tab, Row, Col, Tooltip, OverlayTrigger} from 'react-bootstrap'
import DiscussionAPI from '../../../api/DiscussionAPI'
import { useParams } from 'react-router'
import { UserContext } from '../../../context/UserContext'
import { Link } from 'react-router-dom';
import MainContainer from '../../../components/layouts/MainContainer'

export default function ClassSideNavigation({children}) {
  const userContext = useContext(UserContext)
  const [classInfo, setClassInfo] = useState(null)
  const {id} = useParams()
  const {user} = userContext.data
  const currentLoc = window.location.pathname;
  const [collapseSide, setCollapseSide] = useState(localStorage.getItem('collaps') == 'false' ? false : true);
  const [loading, setLoading] = useState(false);
  const [showTab, setShowTab] = useState(true)
  const subsType = localStorage.getItem('subsType');

  const getClassInfo = async() => {
    setLoading(true)
    let response = await new DiscussionAPI().getClassInfo(id)
    if(response.ok){
      console.log(response.data, '--------------------------------')
      setClassInfo(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
    setLoading(false)
  }

  const renderTooltipFeed = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Feed
    </Tooltip>
  )
  const renderTooltipLearn = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Learn
    </Tooltip>
  )
  const renderTooltipExam = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Exam
    </Tooltip>
  )
  const renderTooltipDiscussion = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Discussion
    </Tooltip>
  )
  const renderTooltipAssignment = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Assignment
    </Tooltip>
  )
  const renderTooltipTask = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Task
    </Tooltip>
  )
  const renderTooltipInteractive = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Interactive
    </Tooltip>
  )
  const renderTooltipLink = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Links
    </Tooltip>
  )
  const renderTooltipClassList = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Class List
    </Tooltip>
  )
  const renderTooltipFiles = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Files
    </Tooltip>
  )

  const renderTooltipVideos = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Videos Upload
      </Tooltip>
  )
  
  const renderTooltipTeacherResources = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Teacher Resources
    </Tooltip>
  )

  useEffect(() => {
    getClassInfo();
  }, [window.location.pathname])
  
  useEffect(() => {
    console.log(localStorage.getItem('collaps'))
    setShowTab(localStorage.getItem('collaps') == 'false' ? false : true)
  }, [collapseSide])

  const handleClicked = (data) => {
    setCollapseSide(data);
    localStorage.setItem('collaps', data)
  }

  return (
    <MainContainer activeHeader={'classes'} loading={loading} fluid style=''>
    <Col style={{height: 100}} />
    <Row>
      {showTab ? <Col className="row-course-bg course-widget-font" sm={3}>
          <ListGroup.Item className="list-group-item-o">
            <Row>
              <Col className="" sm={9} >
                <div className="class-subtitle-section">{classInfo?.classInformation?.className}</div>
                <div className="class-subtitle-code" > {classInfo?.classInformation?.classCode}</div>
                <div className="class-subtitle-section">{classInfo?.classInformation?.teacherName}</div>
                <div className="class-subtitle-subject">{classInfo?.classInformation?.gradeName}</div>
                <div className="class-subtitle-name">{classInfo?.classInformation?.courseName}</div>
              </Col>
              <Col className="ellipsis-top-right" sm={3}>
                <i className="fas fa-chevron-left cursor-pointer color-black" onClick={()=> handleClicked(false)}/>
                <div className='fa-user-size'>
                <i className="fas fa-user"></i> {classInfo?.students?.length}
                </div>
              </Col>
            </Row>
          </ListGroup.Item>
        {subsType == 'LMS' ? 
          <ListGroup>
            <Link className={currentLoc.includes('feed') ? "active-nav-item" : 'nav-item'} to={`/classescontent/${id}/feed`}>
              Feed
            </Link>
            <Link className={currentLoc.includes('learn') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/learn`}>
              Learn
            </Link>
            <Link className={currentLoc.includes('exam') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/exam`}>
              Exam
            </Link>
            <Link className={currentLoc.includes('task') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/task`}>
              Task
            </Link>
            {user?.teacher !== null &&
              <Link className={currentLoc.includes('resources') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/resources`}>
                Teacher Resources
              </Link>
            }
            <Link className={currentLoc.includes('links') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/links`}>
              Links
            </Link>
            <Link className={currentLoc.includes('discussion') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/discussion`}>
              Discussion
            </Link>
            <Link className={currentLoc.includes('assignment') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/assignment`}>
              Assignment
            </Link>
            <Link className={currentLoc.includes('interactives') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/interactives`}>
              Class Interactives
            </Link>
            {
              classInfo?.classInformation?.course?.isTechfactors && 
              <Link className={currentLoc.includes('videos') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/videos`}>
                Videos Upload
              </Link>
            }
            <Link className={currentLoc.includes('files') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/files`}>
              Files
            </Link>
            {
              (user?.teacher != null) && 
              <>
                <Link className={currentLoc.includes('classList') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/classList`}>
                  Class List
                </Link>
                  <Link className={currentLoc.includes('class_grading') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/class_grading`}>
                  Class Grading
                </Link>
                  <Link className={currentLoc.includes('class_meeting') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/class_meeting`}>
                  Class Meeting
                </Link>
              </>
            }
          </ListGroup>
          :
          <ListGroup>
            <Link className={currentLoc.includes('learn') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/learn`}>
              Learn
            </Link>
          </ListGroup>
        }
      </Col>
      :
      <Col className='row-course-bg course-widget-font' sm={1}>
        <Col className="text-align-right mb-2">
          <i className="fas fa-chevron-right" style={{color: '#EE9337'}} onClick={()=> handleClicked(true)}/>
        </Col>
        {subsType == 'LMS' ? 
          <ListGroup>
            <Link className={currentLoc.includes('feed') ? "active-nav-item" : 'nav-item'} to={`/classescontent/${id}/feed`}>
              <OverlayTrigger
                placement="right"
                delay={{ show: 1, hide: 1 }}
                overlay={renderTooltipFeed}>
                <i className='fas fa-comment' />
              </OverlayTrigger>
            </Link>
            <Link className={currentLoc.includes('learn') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/learn`}>
              <OverlayTrigger
                placement="right"
                delay={{ show: 1, hide: 1 }}
                overlay={renderTooltipLearn}>
                <i className="fas fa-book" />
              </OverlayTrigger>
            </Link>
            <Link className={currentLoc.includes('exam') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/exam`}>
              <OverlayTrigger
                placement="right"
                delay={{ show: 1, hide: 1 }}
                overlay={renderTooltipExam}>
                <i className="fas fa-file-alt" />
              </OverlayTrigger>
            </Link>
            <Link className={currentLoc.includes('discussion') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/discussion`}>
            <OverlayTrigger
                placement="right"
                delay={{ show: 1, hide: 1 }}
                overlay={renderTooltipDiscussion}>
                <i className="fas fa-comment-alt" />
              </OverlayTrigger>
            </Link>
            <Link className={currentLoc.includes('assignment') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/assignment`}>
              <OverlayTrigger
                placement="right"
                delay={{ show: 1, hide: 1 }}
                overlay={renderTooltipAssignment}>
                <i className="fas fa-sticky-note" />
              </OverlayTrigger>
            </Link>
            <Link className={currentLoc.includes('task') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/task`}>
              <OverlayTrigger
                placement="right"
                delay={{ show: 1, hide: 1 }}
                overlay={renderTooltipTask}>
                <i className="fas fa-edit" />
              </OverlayTrigger>
            </Link>
            <Link className={currentLoc.includes('interactives') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/interactives`}>
              <OverlayTrigger
                placement="right"
                delay={{ show: 1, hide: 1 }}
                overlay={renderTooltipInteractive}>
                <i className='fas fa-chalkboard-teacher' />
              </OverlayTrigger>
            </Link>
            <Link className={currentLoc.includes('resources') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/resources`}>
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 1, hide: 25 }}
                  overlay={renderTooltipTeacherResources}>
                  <i className="fas fa-link" />
                </OverlayTrigger>
              </Link>
            <Link className={currentLoc.includes('links') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/links`}>
              <OverlayTrigger
                placement="right"
                delay={{ show: 1, hide: 1 }}
                overlay={renderTooltipLink}>
                <i className='fa fa-link' />
              </OverlayTrigger>
            </Link>
            {
              classInfo?.classInformation.course?.isTechfactors && 
              <Link className={currentLoc.includes('videos') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/videos`}>
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 1, hide: 25 }}
                  overlay={renderTooltipVideos}>
                  <i className="fas fa-video" />
                </OverlayTrigger>
              </Link>
            }
            {(user?.teacher != null)
            &&
            <>
              <Link className={currentLoc.includes('classList') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/classList`}>
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 1, hide: 1 }}
                  overlay={renderTooltipClassList}>
                  <i className="fas fa-users" />
                </OverlayTrigger>
              </Link>
              <Link className={currentLoc.includes('files') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/files`}>
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 1, hide: 1 }}
                  overlay={renderTooltipFiles}>
                  <i className="fas fa-folder-open" />
                </OverlayTrigger>
              </Link>
            </>}
          </ListGroup>
          :
          <ListGroup>
            <Link className={currentLoc.includes('learn') ? "active-nav-item" : 'nav-item'} to={`/classes/${id}/learn`}>
              <OverlayTrigger
                placement="right"
                delay={{ show: 1, hide: 1 }}
                overlay={renderTooltipLearn}>
                <i className="fas fa-book" />
              </OverlayTrigger>
            </Link>
          </ListGroup>
        }
      </Col>
      }
      <Col sm={showTab ? 9 : 11} className='scrollable vh-85 pb-5  pl-20'>
        {children}
      </Col> 
    </Row>
    </MainContainer>
  )
}