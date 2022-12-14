import React, { useState, useEffect, useContext } from 'react'
import {Row, Col, Accordion, Button, Tooltip, OverlayTrigger} from 'react-bootstrap'
import HeaderDiscussion from './components/Discussion/HeaderDiscussion'
import { useParams } from 'react-router'
import ClassesAPI from '../../api/ClassesAPI'
import DiscussionAPI from '../../api/DiscussionAPI'
import EditDiscussion from './components/Discussion/EditDiscussion'
import SweetAlert from 'react-bootstrap-sweetalert';
import AssignedDiscussion from './components/Discussion/AssignedDiscussion'
import moment from 'moment'
import EditAssignDiscussion from './components/Discussion/EditAssignDiscussion'
import { UserContext } from '../../context/UserContext'
import StudentDiscussion from './student/StudentDiscussion'
import DiscussionComments from './components/Discussion/DiscussionComments'
import ClassBreadcrumbs from './components/ClassBreedCrumbs'
import ClassSideNavigation from './components/ClassSideNavigation'
import { toast } from 'react-toastify'
import FullScreenLoader from '../../components/loaders/FullScreenLoader'
import Status from '../../components/utilities/Status'

function ClassDiscussion() {
  const [discussionCommentModal, setDiscussionCommentModal] = useState(false)
  const [comments, setComments] = useState([])
  const [modal, setModal] = useState(false)
  const [module, setModule] = useState([])
  const [discussionModule, setdiscussionModule] = useState([])
  const [editDiscussionItem, setEditDiscussionItem] = useState()
  const [moduleId, setModuleId] = useState(null)
  const [deleteNotify, setDeleteNotify] = useState(false)
  const [instructions, setInstructions] = useState('')
  const {id} = useParams();
  // const courseId = classInfo?.classInformation?.courseId
  const [itemId, setItemId] = useState('')
  const [assignModal, setAssignModal] = useState(false)
  const [editAssignDiscussionItem, setEditAssignDiscussionItem] = useState()
  const [editAssignModal, setEditAssignModal] = useState(false)
  const [discussionId, setDiscussionId] = useState('')
  const [startDate, setStartDate] = useState()
  const [startTime, setStartTime] = useState()
  const [endDate, setEndDate] = useState()
  const [endTime, setEndTime] = useState()
  const dateCompareNow = moment().format("YYYY-MM-DD")
  const timeNow = moment().format('HH:mm');
  const dateTimeNow = dateCompareNow + ' ' + '00:00:00';
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [getComments, setGetComments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [classInfo, setClassInfo] = useState({});
  const [selectedDiscussionName, setSelectedDiscussionName] = useState("")
  const [loading, setLoading] = useState(false);

  const subsType = user.subsType;

  const getClassInfo = async() => {
    setLoading(true)
    let response = await new DiscussionAPI().getClassInfo(id)
    if(response.ok){
      setLoading(false)
      getModule(response.data.classInformation?.courseId)
      setClassInfo(response.data)
    }else{
      setLoading(false)
      toast.error('Something went wrong while fetching all courses')
    }
  }

  useEffect(() => {
    getClassInfo()
    // if(subsType != 'LMS'){
    //   window.location.href = "/classes"
    // }
  }, [])
  
  const onSearch = (text) => {
    setSearchTerm(text)
  }

  const discussionCommentToggle = (e) => {
    setDiscussionCommentModal(!discussionCommentModal)
  }

  const assignToggle = (e, item, name) =>{
    setSelectedDiscussionName(name)
    setDiscussionId(item)
    setAssignModal(!assignModal)
  }

  const editAssignToggle = (e, item, name) =>{
    setSelectedDiscussionName(name)
    setEditAssignDiscussionItem(item)
    setEditAssignModal(!editAssignModal)
  }

  const toggle = (e, item, item2) =>{
    setEditDiscussionItem(item)
    setInstructions(item2)
    setModal(!modal)
  }

  const cancelSweetAlert = () => {
    setDeleteNotify(false)
  }

  const handleDeleteNotify = (item) =>{
    setDeleteNotify(true)
    setItemId(item)
  }

  const getModule = async(courseID) =>{
    let response = await new ClassesAPI().getModule(courseID)
    if(response.ok){
        setModule(response.data)
    }else{
    }
  }

  const getDiscussionUnit = async(e, item) =>{
    let response = await new ClassesAPI().getDiscussionUnit(id,item)
    if(response.ok){
      setdiscussionModule(response.data)
      setModuleId(item)
    }else{
      alert("Something went wrong while getDiscussionUnit")
    }
  }

  const getDiscussionComments = async (e, item1, item2, item3, item4, item5) => {
    let response = await new ClassesAPI().getDiscussionComments(id, item1)
      if(response.ok){
        setGetComments(response.data)
        setStartDate(item2)
        setStartTime(item3)
        setEndDate(item4)
        setEndTime(item5)
        setDiscussionId(item1)
        setDiscussionCommentModal(true)
      }else{
        alert('Something went wrong while getCommenst')
      }
  }

    useEffect(() => {
      if(moduleId !== null){
        return(
          getDiscussionUnit() 
        )
      }  
    }, [])

  const deleteDiscussion = async(e, item) => {
    let response = await new ClassesAPI().deleteDiscussion(item)
    if(response.ok){
      toast.success("Successfully deleted discussion!")
      getDiscussionUnit(null, moduleId)
      setDeleteNotify(false)
    }else{
      alert("Something went wrong while Deleting a deleteDiscussion")
    }
  }

  const renderTooltipEdit = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit
    </Tooltip>
  )
  const renderTooltipReasign = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Reassign
    </Tooltip>
  )
  const renderTooltipAsign= (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Assign
    </Tooltip>
  )
  const renderTooltipDelete= (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete
    </Tooltip>
  )


  return (
    <ClassSideNavigation>
      {loading && <FullScreenLoader />}
      <ClassBreadcrumbs title='' clicked={()=> console.log('')} />
      <HeaderDiscussion onSearch={onSearch} getDiscussionUnit={getDiscussionUnit} module={module} onRefresh={() => getClassInfo()}/>
        <Accordion>
        <SweetAlert
            warning
            showCancel
            show={deleteNotify}
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            title="Are you sure?"
            onConfirm={(e) => deleteDiscussion(e, itemId)}
            onCancel={cancelSweetAlert}
            focusCancelBtn
            >
              You will not be able to recover this imaginary file!
          </SweetAlert>
        {module.map((item, index) =>{
          return (
            <Accordion.Item eventKey={index} onClick={(e) => getDiscussionUnit(e, item?.id)}>
            <Accordion.Header><div style={{fontSize:'20px'}}>{item.moduleName}</div></Accordion.Header>
            <Accordion.Body>
              {(user?.teacher === null)?(
              <>
                <StudentDiscussion searchTerm={searchTerm} moduleId={moduleId} getDiscussionUnit={getDiscussionUnit} discussionModule={discussionModule} />
              </>
              ):(
              <>
              {discussionModule?.filter((moduleitem) => {
                if(searchTerm == ''){
                  return moduleitem
                }else if (moduleitem?.discussion?.discussionName.toLowerCase().includes(searchTerm.toLocaleLowerCase())){
                  return moduleitem
                }
              }).map(moduleitem => {
                return (
                  <Row style={{margin:'10px'}}>
                    <Col sm={8}>
                      <div className='title-exam'>
                        {moduleitem?.discussion?.discussionName}
                      </div>
                    </Col>
                    <Col sm={9} className='instruction-exam' >
                      <div className='inline-flex'>
                        <div className='text-color-bcbcbc' >
                          Instruction:&nbsp;{moduleitem?.instructions}
                        </div>
                        <div className='text-color-707070' >
                        <span style={{marginTop:"300px !important"}} dangerouslySetInnerHTML={{__html:moduleitem?.discussion?.instructions }} />
                        </div>
                      </div>
                    </Col>
                    {moduleitem.discussion?.classId?(
                    <Col sm={3} className='icon-exam'>
                        {/* <Button className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye" ></i>{' '}</Button> */}
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 1, hide: 1 }}
                          overlay={renderTooltipEdit}>
                          <Button onClick={(e)=> toggle(e, moduleitem, moduleitem?.discussion?.instructions)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-edit"></i></Button>
                        </OverlayTrigger>
                        {moduleitem.discussionAssignment?.startDate?(
                          <>
                          <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 1, hide: 1 }}
                            overlay={renderTooltipReasign}>
                              <Button onClick={(e) => editAssignToggle(e, moduleitem, moduleitem?.discussion?.discussionName)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-clock"></i></Button>
                          </OverlayTrigger>
                          </>
                        ):
                          <>
                            <OverlayTrigger
                              placement="bottom"
                              delay={{ show: 1, hide: 0 }}
                              overlay={renderTooltipAsign}>
                            <Button onClick={(e) => assignToggle(e, moduleitem?.discussion?.id, moduleitem?.discussion?.discussionName)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-user-clock"></i></Button>
                            </OverlayTrigger>
                          </>
                        }
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 1, hide: 0 }}
                          overlay={renderTooltipDelete}>
                        <Button onClick={() => handleDeleteNotify(moduleitem.discussion?.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-trash-alt"></i></Button>
                        </OverlayTrigger>
                      </Col>
                      ):
                      <>
                      {moduleitem.discussionAssignment?.startDate?(
                      <>
                      <Col sm={3} className='icon-exam' >
                        {/* <Button className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye" ></i>{' '}</Button> */}
                        <div style={{marginRight:'5px'}}>
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 1, hide: 0 }}
                          overlay={renderTooltipReasign}>
                        <Button onClick={(e) => editAssignToggle(e, moduleitem, moduleitem?.discussion?.discussionName)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-clock"></i></Button>
                        </OverlayTrigger>
                        </div>
                      </Col>
                      </>
                      ):
                      <>
                      <Col sm={3} className='icon-exam'>
                        {/* <Button className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye" ></i>{' '}</Button> */}
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 1, hide: 0 }}
                          overlay={renderTooltipAsign}>
                        <Button onClick={(e) => assignToggle(e, moduleitem?.discussion?.id, moduleitem?.discussion?.discussionName)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-user-clock"></i></Button>
                        </OverlayTrigger>
                      </Col>
                      </>
                      }
                      </>
                    }
                    {moduleitem?.discussionAssignment === null ? (<></>):(<>
                      <Col sm={7} className='due-date-discusstion' >
                        <p className='exam-instruction m-0'>
                          <span className='d-inline-block' style={{ width: 40, fontSize: 16}}>
                            Start:
                          </span>
                            &nbsp;<b style={{ fontSize: '16px' }}>{moment(moduleitem?.discussionAssignment?.startDate).format("MMMM Do YYYY")}, {moment(moduleitem?.discussionAssignment?.startTime, 'HH:mm:ss').format('h:mm A')}</b>
                        </p>
                        <p className='exam-instruction m-0 mb-3'>
                          <span className='d-inline-block' style={{ width: 40, fontSize: 16 }}>
                            End:
                          </span>
                            &nbsp;<b style={{ fontSize: '16px' }}>{moment(moduleitem?.discussionAssignment?.endDate).format("MMMM Do YYYY")}, {moment(moduleitem?.discussionAssignment?.endTime, 'HH:mm:ss').format('h:mm A')}</b>
                        </p> 
                      </Col>
                    </>)}
                    {moduleitem.discussionAssignment?.startDate?(
                      <>
                  <div className='inline-flex' >
                    {moduleitem?.discussion?.classId == null ? ( <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Created in Course</Status></div>) : (<div style={{color:'#EE9337', fontSize:'15px'}}><Status>Created in Class</Status></div>)}
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(moduleitem?.discussionAssignment?.startDate + ' ' + moduleitem?.discussionAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&  
                    
                     <div style={{color:'#EE9337', fontSize:'15px'}}><b><Status>Upcoming</Status></b></div>
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(moduleitem?.discussionAssignment?.endDate + ' ' + moduleitem?.discussionAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <>
                      <div className='inline-flex'>
                      <div style={{color:'#EE9337', fontSize:'15px'}}><b><Status>Ended</Status>&nbsp;</b></div>
                      <div style={{paddingBottom:'5px'}} >
                        {/* <Button onClick={(e) => getDiscussionComments(e, moduleitem.discussion?.id)} className="m-r-5 color-white tficolorbg-button" size="sm">Comments&nbsp;{moduleitem.responseCount}</Button> */}
                       <span className='commet-btn' onClick={(e) => getDiscussionComments(e, moduleitem.discussion?.id)} style={{cursor:'pointer'}} ><Status>Comments</Status> </span> 
                      </div>
                      </div>
                      </>
                    }
                    {
                       moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isSame(moment(moduleitem?.discussionAssignment?.startDate + ' ' + moduleitem?.discussionAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                       <div className='inline-flex' >
                       <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Ongoing</Status></div>
                       <span className='commet-btn' onClick={(e) => getDiscussionComments(e, moduleitem.discussion?.id, moduleitem?.discussionAssignment?.startDate, moduleitem?.discussionAssignment?.startTime, moduleitem?.discussionAssignment?.endDate, moduleitem?.discussionAssignment?.endTime)} style={{cursor:'pointer'}} ><Status>Comments</Status> </span>
                         
                       </div>
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(moduleitem?.discussionAssignment?.startDate + ' ' + moduleitem?.discussionAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(moduleitem?.discussionAssignment?.endDate + ' ' + moduleitem?.discussionAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <>
                      <div className='inline-flex'>
                      <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Ongoing</Status> &nbsp;</div>
                      <div style={{paddingBottom:'5px'}} >
                      <span className='commet-btn' onClick={(e) => getDiscussionComments(e, moduleitem.discussion?.id, moduleitem?.discussionAssignment?.startDate, moduleitem?.discussionAssignment?.startTime, moduleitem?.discussionAssignment?.endDate, moduleitem?.discussionAssignment?.endTime)} style={{cursor:'pointer'}} ><Status>Comments</Status> </span>
                      
                        {/* <Button onClick={(e) => getDiscussionComments(e, moduleitem.discussion?.id, moduleitem?.discussionAssignment?.startDate, moduleitem?.discussionAssignment?.startTime, moduleitem?.discussionAssignment?.endDate, moduleitem?.discussionAssignment?.endTime)} className="m-r-5 color-white tficolorbg-button" size="sm">Comments&nbsp;{moduleitem.responseCount}</Button> */}
                      </div>
                      </div>
                      <>
           
                      </>
                      </> 
                    }    
                 </div>
                 <div className='text-color-bcbcbc' >
                  <hr></hr>
                </div>
                 </>
                 ):
                  <div>
                    <div className='inline-flex' >
                    {moduleitem?.discussion?.classId == null ? ( <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Created in Course</Status></div>) : (<Status>Created in Class</Status>)}
                    <Status>Unassigned</Status>
                    </div>
                  <hr />
                </div> 
                    }
              </Row>
                 )})}
              </>
              )}
              </Accordion.Body>
              </Accordion.Item>
            )
          })}
          </Accordion>
          <DiscussionComments getDiscussionComments={getDiscussionComments} getComments={getComments} endTime={endTime} endDate={endDate} startTime={startTime} startDate={startDate} getDiscussionUnit={getDiscussionUnit} moduleId={moduleId} discussionId={discussionId} comments={comments} discussionCommentToggle={discussionCommentToggle} discussionCommentModal={discussionCommentModal} />
          <EditDiscussion setModal={setModal} setInstructions={setInstructions} instructions={instructions} editDiscussionItem={editDiscussionItem} toggle={toggle} modal={modal} getDiscussionUnit={getDiscussionUnit} /> 
          <AssignedDiscussion selectedDiscussionName={selectedDiscussionName} moduleId={moduleId} getDiscussionUnit={getDiscussionUnit} discussionId={discussionId} assignToggle={assignToggle} assignModal={assignModal} />
          <EditAssignDiscussion selectedDiscussionName={selectedDiscussionName} getDiscussionUnit={getDiscussionUnit} editAssignDiscussionItem={editAssignDiscussionItem} editAssignToggle={editAssignToggle} editAssignModal={editAssignModal} />
       </ClassSideNavigation>
    )
  }
export default ClassDiscussion