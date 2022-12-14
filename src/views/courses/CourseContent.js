import React, { useState, useEffect, useContext } from "react";
import { Tab, ListGroup, Row, Col, Button, InputGroup, FormControl, Accordion, Tooltip, OverlayTrigger } from 'react-bootstrap';
import MainContainer from '../../components/layouts/MainContainer'
import CoursesAPI from "../../api/CoursesAPI";
import { Link} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router";
import { UserContext } from '../../context/UserContext';
import { toast } from "react-toastify";

export default function CourseContent({children}) {
  const [loading, setLoading] = useState(false)
  const [courseInfo, setCourseInfo] = useState("")
  const [collapseSide, setCollapseSide] = useState(localStorage.getItem('collapsCourse') == 'false' ? false : true);
  const [showTab, setShowTab] = useState(true)
  const currentLoc = window.location.pathname;
  const {id} = useParams()
  const [moduleInfo, setModuleInfo] = useState({})
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const subsType = user.subsType;
  const [isContributor, setIsContributor] = useState(false);

  const getCourseUnitInformation = async(e) => {
    let response = await new CoursesAPI().getCourseUnit(id)
    if(response.ok){
      setModuleInfo(response.data)
    }else{
      toast.error("Something went wrong while fetching coursse unit")
    }
  }

  const getCourseInformation = async(e) => {
    let response = await new CoursesAPI().getCourseInformation(id)
    if(response.ok){
      setCourseInfo(response.data)
      let TFICourse = response.data.isTechfactors;
      if(TFICourse){
        let contriList = await new CoursesAPI().getContributor(id)
        let ifContri = contriList.data.find(i => i.userInformation?.userId == user.userId);
        setIsContributor(ifContri ? true : false);
      }else{
        setIsContributor(true);
      }
    }else{
      toast.error("Something went wrong while fetching course information.")
    }
  }

  useEffect( async() => {
    
  },[])

  useEffect(() => {
    setShowTab(localStorage.getItem('collapsCourse') == 'false' ? false : true)
  }, [collapseSide]);

  const handleClicked = (data) => {
    setCollapseSide(data);
    localStorage.setItem('collapsCourse', data)
  }

  useEffect(() => {
    getCourseInformation()
    getCourseUnitInformation()
  }, [])

  // useEffect(() => {
  //   if (user.isStudent && subsType !== 'TeacherResources') return (window.location.href = "/404");
  // }, []);

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
  const renderTooltipFiles = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Files
    </Tooltip>
  )

  const renderTooltipTeacherResources = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Teacher Resources
    </Tooltip>
  )

  const renderTooltipVideos = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Videos Upload
    </Tooltip>
  )

  return (
    <MainContainer loading={loading} fluid activeHeader={'courses'} style=''>
        <Col style={{height: 100}} />
        <Row>
          {showTab ? <Col className="row-course-bg course-widget-font" sm={3}>
            <ListGroup.Item className="list-group-item-o">
              <Row>
                <Col className="" sm={9} >
                  {courseInfo.courseName}
                  <div className="course-subtitle">{courseInfo.authorName}</div>
                </Col>
                <Col className="t-a-r" sm={3}>
                  <Col className="text-align-right">
                    <i className="fas fa-chevron-left cursor-pointer"  onClick={()=> handleClicked(false)}/>
                  </Col>
                </Col>
              </Row>
            </ListGroup.Item> 
            {subsType.includes('LMS') || subsType == 'ContainerwithTR' ?
              <>
                {
                  courseInfo.isTechfactors && subsType == 'ContainerwithTR' ?
                  <ListGroup>
                   { user.isTeacher &&  <Link className={currentLoc.includes('resources') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/resources`}>
                      Teacher Resources
                    </Link>}
                    <Link className={currentLoc.includes('interactive') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/interactive`}>
                      Interactive Exercises
                    </Link>
                  </ListGroup>
                  :
                  <ListGroup>
                    <Link className={currentLoc.includes('learn') ? "active-nav-item" : 'nav-item'} to={`/coursecontent/${id}/learn`}>
                      Learn
                    </Link>
                    <Link className={currentLoc.includes('exam') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/exam`}>
                      Exam
                    </Link>
                    <Link className={currentLoc.includes('task') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/task`}>
                      Task
                    </Link>
                    <Link className={currentLoc.includes('resources') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/resources`}>
                      Teacher Resources
                    </Link>
                    <Link className={currentLoc.includes('discussion') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/discussion`}>
                      Discussion
                    </Link>
                    <Link className={currentLoc.includes('assignment') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/assignment`}>
                      Assignment
                    </Link>
                    <Link className={currentLoc.includes('interactive') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/interactive`}>
                      Interactive Exercises
                    </Link>
                    {
                      isContributor && 
                      <>
                      <Link className={currentLoc.includes('files') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/files`}>
                        Files 
                      </Link>
                      </>
                    }
                    <Link className={currentLoc.includes('links') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/links`}>
                      Links
                    </Link>
                    {
                      courseInfo.isTechfactors && 
                      <Link className={currentLoc.includes('videos') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/videos`}>
                        Videos Upload 
                      </Link>
                    }
                  </ListGroup>
                }
              </>
              :
              null
            }
            {
              subsType == 'Ebooks' &&
              <ListGroup>
                <Link className={currentLoc.includes('learn') ? "active-nav-item" : 'nav-item'} to={`/coursecontent/${id}/learn`}>
                  Learn
                </Link>
                <Link className={currentLoc.includes('ebooks') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/ebooks`}>
                  Files
                </Link>
              </ListGroup>
            }
            {
              subsType == 'TeacherResources' &&
              <ListGroup>
                {user.isTeacher && <Link className={currentLoc.includes('resources') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/resources`}>
                  Teacher Resources
                </Link>}
                <Link className={currentLoc.includes('interactive') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/interactive`}>
                  Interactive Exercises
                </Link>
              </ListGroup>
            }
            {
              subsType == 'InteractivesandLearn' &&
              <ListGroup>
                <Link className={currentLoc.includes('learn') ? "active-nav-item" : 'nav-item'} to={`/coursecontent/${id}/learn`}>
                  Learn
                </Link>
                {user.isTeacher && <Link className={currentLoc.includes('resources') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/resources`}>
                  Teacher Resources
                </Link>}
                <Link className={currentLoc.includes('interactive') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/interactive`}>
                  Interactive Exercises
                </Link>
              </ListGroup>
            }
          </Col>
          :
          <Col className="row-course-bg course-widget-font pt-2" sm={1}>
            <Col className="text-align-right mb-2">
              <i className="fas fa-chevron-right cursor-pointer" onClick={()=> handleClicked(true)}/>
            </Col>
            {subsType.includes('LMS') || subsType == 'ContainerwithTR' ?
            <>
              { courseInfo.isTechfactors && subsType == 'ContainerwithTR' ?
                  <ListGroup>
                    {user.isTeacher && <Link className={currentLoc.includes('resources') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/resources`}>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 1, hide: 25 }}
                        overlay={renderTooltipTeacherResources}>
                        <i className="fas fa-link" />
                      </OverlayTrigger>
                    </Link>}
                    <Link className={currentLoc.includes('interactive') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/interactive`}>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 1, hide: 25 }}
                        overlay={renderTooltipInteractive}>
                        <i className='fas fa-chalkboard-teacher' />
                      </OverlayTrigger>
                    </Link>
                  </ListGroup>
                :
                <ListGroup>
                  <Link className={currentLoc.includes('learn') ? "active-nav-item" : 'nav-item'} to={`/coursecontent/${id}/learn`}>
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 1, hide: 25 }}
                      overlay={renderTooltipLearn}>
                      <i className="fas fa-book" />
                    </OverlayTrigger>
                  </Link>
                  <Link className={currentLoc.includes('exam') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/exam`}>
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 1, hide: 25 }}
                      overlay={renderTooltipExam}>
                      <i className="fas fa-file-alt" />
                    </OverlayTrigger>
                  </Link>
                  <Link className={currentLoc.includes('task') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/task`}>
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 1, hide: 25 }}
                      overlay={renderTooltipTask}>
                      <i className="fas fa-edit" />
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
                  <Link className={currentLoc.includes('discussion') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/discussion`}>
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 1, hide: 25 }}
                      overlay={renderTooltipDiscussion}>
                      <i className="fas fa-comment-alt" />
                    </OverlayTrigger>
                  </Link>
                  <Link className={currentLoc.includes('assignment') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/assignment`}>
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 1, hide: 25 }}
                      overlay={renderTooltipAssignment}>
                      <i className="fas fa-sticky-note" />
                    </OverlayTrigger>
                  </Link>
                  <Link className={currentLoc.includes('interactive') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/interactive`}>
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 1, hide: 25 }}
                      overlay={renderTooltipInteractive}>
                      <i className='fas fa-chalkboard-teacher' />
                    </OverlayTrigger>
                  </Link>
                  {
                    isContributor && 
                    <Link className={currentLoc.includes('files') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/files`}>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 1, hide: 25 }}
                        overlay={renderTooltipFiles}>
                        <i className="fas fa-folder-open" />
                      </OverlayTrigger>
                    </Link>
                  }
                  <Link className={currentLoc.includes('links') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/links`}>
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 1, hide: 25 }}
                      overlay={renderTooltipLink}>
                      <i className="fas fa-link" />
                    </OverlayTrigger>
                  </Link>
                  {
                    courseInfo.isTechfactors && 
                    <Link className={currentLoc.includes('videos') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/videos`}>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 1, hide: 25 }}
                        overlay={renderTooltipVideos}>
                        <i className="fas fa-video" />
                      </OverlayTrigger>
                    </Link>
                  }
                </ListGroup>}
              </>
              :
              null
            }
            {
              subsType == 'Ebooks' &&
              <ListGroup>
                <Link className={currentLoc.includes('learn') ? "active-nav-item" : 'nav-item'} to={`/coursecontent/${id}/learn`}>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 1, hide: 25 }}
                    overlay={renderTooltipLearn}>
                    <i className="fas fa-book" />
                  </OverlayTrigger>
                </Link>
              </ListGroup>
            }
            {
              subsType == 'TeacherResources' &&
              <ListGroup>
                {user.isTeacher && <Link className={currentLoc.includes('resources') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/resources`}>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 1, hide: 25 }}
                    overlay={renderTooltipTeacherResources}>
                    <i className="fas fa-link" />
                  </OverlayTrigger>
                </Link>}
                <Link className={currentLoc.includes('interactive') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/interactive`}>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 1, hide: 25 }}
                    overlay={renderTooltipInteractive}>
                     <i className='fas fa-chalkboard-teacher' />
                  </OverlayTrigger>
                </Link>
              </ListGroup>
            }
            {
              subsType == 'InteractivesandLearn' &&
              <ListGroup>
                <Link className={currentLoc.includes('learn') ? "active-nav-item" : 'nav-item'} to={`/coursecontent/${id}/learn`}>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 1, hide: 25 }}
                    overlay={renderTooltipLearn}>
                    <i className="fas fa-book" />
                  </OverlayTrigger>
                </Link>
                {user.isTeacher && <Link className={currentLoc.includes('resources') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/resources`}>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 1, hide: 25 }}
                    overlay={renderTooltipTeacherResources}>
                    <i className="fas fa-link" />
                  </OverlayTrigger>
                </Link>}
                <Link className={currentLoc.includes('interactive') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/interactive`}>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 1, hide: 25 }}
                    overlay={renderTooltipInteractive}>
                     <i className='fas fa-chalkboard-teacher' />
                  </OverlayTrigger>
                </Link>
              </ListGroup>
            }
          </Col>
          }
          <Col sm={ showTab ? 9 : 11} className='scrollable vh-85 pb-5 pl-20'>
           {children}
          </Col>
        </Row>
    </MainContainer>
  )
}
