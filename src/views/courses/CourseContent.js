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
  const [isContributor, setIsContributor] = useState(true);

  const getCourseUnitInformation = async(e) => {
    setLoading(true)
    let response = await new CoursesAPI().getCourseUnit(id)
    setLoading(false)
    if(response.ok){
      setModuleInfo(response.data)
      console.log(response.data)
    }else{
      toast.error("Something went wrong while fetching coursse unit")
    }
  }

  const getCourseInformation = async(e) => {
    setLoading(true)
    let response = await new CoursesAPI().getCourseInformation(id)
    setLoading(false)
    if(response.ok){
      setCourseInfo(response.data)
      let TFICourse = response.data.isTechfactors;
      console.log(response.data, 'infoooooooooooooooooo', TFICourse)
      if(TFICourse){
        let contriList = await new CoursesAPI().getContributor(id)
        console.log(contriList, "--------------------------------");
        let ifContri = contriList.data.find(i => i.userInformation?.userId == user.userId);
        console.log(ifContri, user.userId, '-=-=-=')
        setIsContributor(ifContri ? true : false);
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

  useEffect(() => {
    if (user.isStudent) return (window.location.href = "/404");
  }, []);

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
            {subsType == 'LMS' &&
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
                {
                  isContributor && 
                  <Link className={currentLoc.includes('files') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/files`}>
                    Files
                  </Link>
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
              <Link className={currentLoc.includes('resources') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/resources`}>
                Teacher Resources
              </Link>
            }
          </Col>
          :
          <Col className="row-course-bg course-widget-font pt-2" sm={1}>
            <Col className="text-align-right mb-2">
              <i className="fas fa-chevron-right cursor-pointer" onClick={()=> handleClicked(true)}/>
            </Col>
            {subsType == 'LMS' &&
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
                
                <Link className={currentLoc.includes('files') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/files`}>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 1, hide: 25 }}
                    overlay={renderTooltipFiles}>
                    <i className="fas fa-folder-open" />
                  </OverlayTrigger>
                </Link>
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
              </ListGroup>
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
              <Link className={currentLoc.includes('resources') ? "active-nav-item" : 'nav-item'} to={`/courses/${id}/resources`}>
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 1, hide: 25 }}
                  overlay={renderTooltipTeacherResources}>
                  <i className="fas fa-link" />
                </OverlayTrigger>
              </Link>
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
