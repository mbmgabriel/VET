import React, { useState, useEffect, useContext } from 'react'
import ClassInteractiveHeader from '../../classes/components/Interactive/ClassInteractiveHeader'
import { Row, Col, Accordion, Button, OverlayTrigger, Tooltip} from 'react-bootstrap'
import ClassesAPI from '../../../api/ClassesAPI'
import DiscussionAPI from '../../../api/DiscussionAPI';
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import moment from 'moment'
import AssignInteractive from '../../classes/components/Interactive/AssignInteractive'
import EditAssignInteractive from '../../classes/components/Interactive/EditAssignInteractive'
import { UserContext } from '../../../context/UserContext'
import StudentInteractive from '../../classes/student/StudentInteractive';
import MainContainer from '../../../components/layouts/MainContainer'
import ClassAdminSideNavigation from './components/ClassAdminSideNavigation'

export default function SchoolAdminInteractives() {
  const [module, setModule] = useState([])
  const [moduleId, setModuleId] = useState(null)
  const [interactive, setInteractive] = useState([])
  const [assignInteractiveModal, setAssignInteractiveModal] = useState(false)
  const [editAssignInteractiveModal, setEditAssignInteractiveModal] = useState(false)
  const [editAssignInteractiveItem, setEditAssignInteractiveItem] = useState()
  const [interactiveId, setInteractiveId] = useState()
  const {id} = useParams();
  const dateCompareNow = moment().format("YYYY-MM-DD")
  const timeNow = moment().format('HH:mm');
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [searchTerm, setSearchTerm] = useState('')
  const [classInfo, setClassInfo] = useState({});
  const [loading, setLoading] = useState(false)

  const onSearch = (item) => {
    setSearchTerm(item)
  }

  useEffect(() => {
    getClassInfo()
  }, [])

const getClassInfo = async() => {
  setLoading(true)
  let response = await new DiscussionAPI().getClassInfo(id)
  if(response.ok){
    console.log({response})
    getModule(response.data.classInformation?.courseId)
    setClassInfo(response.data)
    console.log(response.data)
  }else{
    alert("Something went wrong while fetching all courses")
  }
  setLoading(false)
}

  const editAssignIteractiveToggle = (e, item) => {
    setEditAssignInteractiveItem(item)
    setEditAssignInteractiveModal(!editAssignInteractiveModal)
  }

  const assignInteractiveToggle = (e, item) => {
    setInteractiveId(item)
    setAssignInteractiveModal(!assignInteractiveModal)
  }

  const getModule = async(courseID) =>{
    let response = await new ClassesAPI().getModule(courseID);
    if(response.ok){
        setModule(response.data)
    }else{
      alert('error')
    }
  }

  console.log('interactive:', interactive)



  const getIndteractive = async (e, item) =>{
    let response = await new ClassesAPI().getInteractive(id, item)
    if(response.ok){
      setInteractive(response.data)
      setModuleId(item)
    }else{
      alert('Error')
    }
  }

  useEffect(() => {
    if(moduleId !== null){
      return(
        getIndteractive()
      )
    } 
  }, [])

  const renderTooltipReasign = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Assign
    </Tooltip>
  )

  return (
    <MainContainer title="School" activeHeader={"classes"} style='not-scrollable' loading={loading}>
      <Row className="mt-4">
        <Col sm={3}>
          <ClassAdminSideNavigation active="interactives"/>
        </Col>
        <Col sm={9} className='scrollable vh-85'>
          <ClassInteractiveHeader onSearch={onSearch} onRefresh={() => getClassInfo()}/>
          <Accordion>
            {module.map((item, index) => {
              return ( <Accordion.Item eventKey={index} onClick={(e) => getIndteractive(e, item?.id)} >
              <Accordion.Header>
                <div className='unit-exam' style={{fontSize:'20px'}} >{item.moduleName}
                </div>
              </Accordion.Header>
              <Accordion.Body>
                {(user?.teacher === null)?(
                <>
                  <StudentInteractive searchTerm={searchTerm}  interactive={interactive} />
                </>
                ):(
                <>
                {interactive?.filter((interItem) => {
                  if(searchTerm == ''){
                    return interItem
                  }else if (interItem?.interactive?.interactiveName.toLowerCase().includes(searchTerm.toLocaleLowerCase())){
                    return interItem
                  }
                }).map(interItem =>{
                  return(
                  <Row style={{margin:'10px'}}>
                    <Col sm={8}>
                      <div className='title-exam'>
                        {/* <Link style={{color:'#EE9337', textDecoration:'none'}} to={interItem?.interactive?.path} >{interItem?.interactive?.interactiveName}</Link> */}
                        <a target="_blank" style={{color:'#EE9337', textDecoration:'none'}} href={interItem?.interactive?.path}>{interItem?.interactive?.interactiveName}</a>
                      </div>
                    </Col>
                    {/* <Col sm={9} className='instruction-exam' >
                      <div className='inline-flex'>
                        <div className='text-color-bcbcbc' >
                          Instruction:&nbsp;
                        </div>
                        <div className='text-color-707070' >
                          Count the object. Type the number in the box
                        </div>
                      </div>
                    </Col> */}
                      <Col sm={3} className='icon-exam'>
                        {/* <Button className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye" ></i>{' '}</Button> */}
                        {interItem?.classInteractiveAssignment?(
                        <>
                            <OverlayTrigger
                              placement="bottom"
                              delay={{ show: 1, hide: 0 }}
                              overlay={renderTooltipReasign}>
                              <Button onClick={(e) => editAssignIteractiveToggle(e, interItem)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-clock"></i></Button>
                          </OverlayTrigger> 
                        </>
                        ):
                        <>
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 1, hide: 0 }}
                          overlay={renderTooltipReasign}>
                            <Button onClick={(e) => assignInteractiveToggle(e, interItem?.interactive?.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-user-clock"></i></Button>
                        </OverlayTrigger>
                        </>}
                        
                      </Col>
                      {interItem?.classInteractiveAssignment?(
                        <>
                          {
                            moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(interItem?.classInteractiveAssignment?.startDate + ' ' + interItem?.classInteractiveAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&  
                              <div style={{color:'#EE9337', fontSize:'15px'}}><b>Upcoming</b></div>
                          }
                          {
                            moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(interItem?.classInteractiveAssignment?.endDate + ' ' + interItem?.classInteractiveAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                              <div style={{color:'#EE9337', fontSize:'15px'}}><b>Ended</b></div>
                          }
                          {
                            moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isSame(moment(interItem?.classInteractiveAssignment?.startDate + ' ' + interItem?.classInteractiveAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                              <div style={{color:'#EE9337', fontSize:'15px'}}><b>Ongoing</b></div>
                          }
                          {
                            moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(interItem?.classInteractiveAssignment?.startDate + ' ' + interItem?.classInteractiveAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                            moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(interItem?.classInteractiveAssignment?.endDate + ' ' + interItem?.classInteractiveAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                              <div style={{color:'#EE9337', fontSize:'15px'}}><b>Ongoing</b></div>
                          } 
                          <Col sm={7} className='due-date-discusstion' >
                          <div className='inline-flex'>
                            <div className='text-color-bcbcbc'>
                              Start Date:&nbsp;
                            </div>
                            <div className='text-color-707070'>
                              {moment(interItem?.classInteractiveAssignment?.startDate).format('LL')}&nbsp;
                            </div>
                            <div className='text-color-bcbcbc'>
                              Start Time:&nbsp;
                            </div>
                            <div className='text-color-707070'>
                              {interItem?.classInteractiveAssignment?.startTime}
                            </div>
                          </div>
                        </Col>
                        <Col className='posted-date-discusstion'>
                          <div className='inline-flex'>
                            <div className='text-color-bcbcbc'>
                              End Date:&nbsp;
                            </div>
                            <div className='text-color-707070'>
                            {moment(interItem?.classInteractiveAssignment?.endDate).format('LL')}&nbsp;
                            </div>
                            <div className='text-color-bcbcbc'>
                              End Time:&nbsp;
                            </div>
                            <div className='text-color-707070'>
                              {interItem?.classInteractiveAssignment?.endTime}
                              
                            </div>
                          </div>
                        </Col>
                        <div className='text-color-bcbcbc' >
                        <hr></hr>
                        </div>
                        </>
                      ):
                      <>
                        <div style={{color:'red'}}>
                          <b>Not Assigned</b>
                        </div>
                        <div className='text-color-bcbcbc' >
                        <hr></hr>
                        </div>
                      </>
                      }
                  </Row>
                  )})}
                </>
                )}

              </Accordion.Body>
              </Accordion.Item>)
            })}
          </Accordion>
          <AssignInteractive moduleId={moduleId} getIndteractive={getIndteractive} interactiveId={interactiveId} assignInteractiveToggle={assignInteractiveToggle} assignInteractiveModal={assignInteractiveModal} />
          <EditAssignInteractive getIndteractive={getIndteractive} editAssignInteractiveItem={editAssignInteractiveItem} editAssignIteractiveToggle={editAssignIteractiveToggle} editAssignInteractiveModal={editAssignInteractiveModal} />
        </Col>
      </Row>
    </MainContainer>
  )
}
