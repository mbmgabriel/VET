import React, {useState, useEffect, useContext} from 'react'
import {  Col, Row, Card, Form, Button, Tooltip,Accordion, OverlayTrigger } from 'react-bootstrap';
import { useParams } from 'react-router';
import MainContainer from '../../../components/layouts/MainContainer'
import ClassAdminSideNavigation from './components/ClassAdminSideNavigation'
import HeaderDiscussion from '../../classes/components/Discussion/HeaderDiscussion'
import ClassesAPI from '../../../api/ClassesAPI'
import DiscussionAPI from '../../../api/DiscussionAPI'
import EditDiscussion from '../../classes/components/Discussion/EditDiscussion'
import SweetAlert from 'react-bootstrap-sweetalert';
import AssignedDiscussion from '../../classes/components/Discussion/AssignedDiscussion'
import moment from 'moment'
import EditAssignDiscussion from '../../classes/components/Discussion/EditAssignDiscussion'
import { UserContext } from '../../../context/UserContext'
import StudentDiscussion from '../../classes/student/StudentDiscussion'
import DiscussionComments from '../../classes/components/Discussion/DiscussionComments'
import FullScreenLoader from '../../../components/loaders/FullScreenLoader';
import { toast } from 'react-toastify';
import Status from '../../../components/utilities/Status';

export default function SchoolAdminDiscussion() {
  const [discussionCommentModal, setDiscussionCommentModal] = useState(false)
  const [comments, setComments] = useState([])
  const [modal, setModal] = useState(false)
  const [module, setModule] = useState([])
  const [discussionModule, setdiscussionModule] = useState([])
  const [editDiscussionItem, setEditDiscussionItem] = useState()
  const [moduleId, setModuleId] = useState(null)
  const [deleteNotify, setDeleteNotify] = useState(false)
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
  const [loading, setLoading] = useState(false)

  const getClassInfo = async() => {
    setLoading(true)
    let response = await new DiscussionAPI().getClassInfo(id)
    if(response.ok){
      setLoading(false)
      getModule(response.data.classInformation?.courseId)
      setClassInfo(response.data)
    }else{
      toast.error('Something went wrong while fetching all courses')
    }
    setLoading(false)
  }


  useEffect(() => {
    getClassInfo()
  }, [])
  
  const onSearch = (text) => {
    setSearchTerm(text)
  }

  const discussionCommentToggle = (e) => {
    setDiscussionCommentModal(!discussionCommentModal)

  }

  const assignToggle = (e, item) =>{
    setDiscussionId(item)
    setAssignModal(!assignModal)
  }

  const editAssignToggle = (e, item) =>{
    setEditAssignDiscussionItem(item)
    setEditAssignModal(!editAssignModal)
  }

  const toggle = (e, item) =>{
    setEditDiscussionItem(item)
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
      toast.error('Something went wrong while fetching discussion unit"')
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
      // alert('delete discussion')
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
    <MainContainer title="School" activeHeader={"classes"} style='not-scrollable' loading={loading}>
      {loading && <FullScreenLoader />}
      <Row className="mt-4">
        <Col sm={3}>
          <ClassAdminSideNavigation active="discussion"/>
        </Col>
        <Col sm={9} className='scrollable vh-85'>
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
                    {/* {moduleitem.discussion?.classId?(
                    <Col sm={3} className='icon-exam'>
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 1, hide: 1 }}
                          overlay={renderTooltipEdit}>
                          <Button onClick={(e)=> toggle(e, moduleitem)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-edit"></i></Button>
                        </OverlayTrigger>
                        {moduleitem.discussionAssignment?.startDate?(
                          <>
                          <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 1, hide: 1 }}
                            overlay={renderTooltipReasign}>
                              <Button onClick={(e) => editAssignToggle(e, moduleitem)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-clock"></i></Button>
                          </OverlayTrigger>
                          </>
                        ):
                          <>
                            <OverlayTrigger
                              placement="bottom"
                              delay={{ show: 1, hide: 0 }}
                              overlay={renderTooltipAsign}>
                            <Button onClick={(e) => assignToggle(e, moduleitem?.discussion?.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-user-clock"></i></Button>
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
                        <div style={{marginRight:'5px'}}>
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 1, hide: 0 }}
                          overlay={renderTooltipReasign}>
                        <Button onClick={(e) => editAssignToggle(e, moduleitem)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-clock"></i></Button>
                        </OverlayTrigger>
                        </div>
                      </Col>
                      </>
                      ):
                      <>
                      <Col sm={3} className='icon-exam'>
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 1, hide: 0 }}
                          overlay={renderTooltipAsign}>
                        <Button onClick={(e) => assignToggle(e, moduleitem?.discussion?.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-user-clock"></i></Button>
                        </OverlayTrigger>
                      </Col>
                      </>
                      }
                      </>
                    } */}
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
                    {moduleitem?.discussion?.classId == null ? ( <div style={{color:'#EE9337', fontSize:'15px'}}><Status> Created in Course</Status></div>) : (<div style={{color:'#EE9337', fontSize:'15px'}}><Status>Created in Class</Status></div>)}
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(moduleitem?.discussionAssignment?.startDate + ' ' + moduleitem?.discussionAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&  
                    
                     <div style={{color:'#EE9337', fontSize:'15px'}}><b></b><Status>Upcoming</Status></div>
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(moduleitem?.discussionAssignment?.endDate + ' ' + moduleitem?.discussionAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <>
                      <div className='inline-flex'>
                      <div style={{color:'#EE9337', fontSize:'15px'}}><b></b><Status>Ended</Status></div>
                      <div style={{paddingBottom:'5px'}} >
                        <span className='commet-btn' onClick={(e) => getDiscussionComments(e, moduleitem.discussion?.id)} ><Status>Comments</Status> </span> 
                        {/* <Button onClick={(e) => getDiscussionComments(e, moduleitem.discussion?.id)} className="m-r-5 color-white tficolorbg-button" size="sm">Comments&nbsp;{moduleitem.responseCount}</Button> */}
                      </div>
                      </div>
                      </>
                    }
                    {
                       moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isSame(moment(moduleitem?.discussionAssignment?.startDate + ' ' + moduleitem?.discussionAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                       <div style={{color:'#EE9337', fontSize:'15px'}}><b></b><Status>Ongoing</Status></div>
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(moduleitem?.discussionAssignment?.startDate + ' ' + moduleitem?.discussionAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(moduleitem?.discussionAssignment?.endDate + ' ' + moduleitem?.discussionAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <>
                      <div className='inline-flex'>
                      <div style={{color:'#EE9337', fontSize:'15px'}}><b></b><Status>Ongoing</Status></div>
                      <div style={{paddingBottom:'5px'}} >
                        <span className='commet-btn' onClick={(e) => getDiscussionComments(e, moduleitem.discussion?.id, moduleitem?.discussionAssignment?.startDate, moduleitem?.discussionAssignment?.startTime, moduleitem?.discussionAssignment?.endDate, moduleitem?.discussionAssignment?.endTime)} style={{cursor:'pointer'}} ><Status>Comments</Status> </span> 
                        {/* <Button onClick={(e) => getDiscussionComments(e, moduleitem.discussion?.id, moduleitem?.discussionAssignment?.startDate, moduleitem?.discussionAssignment?.startTime, moduleitem?.discussionAssignment?.endDate, moduleitem?.discussionAssignment?.endTime)} className="m-r-5 color-white tficolorbg-button" size="sm">Comments&nbsp;{moduleitem.responseCount}</Button> */}
                      </div>
                      </div>
                      <>
                      <br />
                      </>
                      </> 
                    }                
                  
                  {/* <Col sm={7} className='due-date-discusstion' >
                     <div className='inline-flex'>
                       <div className='text-color-bcbcbc font-16'>
                         Start Date:&nbsp;
                       </div>
                       <div className='text-color-707070 font-16'>
                         {moment(moduleitem?.discussionAssignment?.startDate).format('LL')}&nbsp;
                       </div>
                       <div className='text-color-bcbcbc font-16'>
                         Start Time:&nbsp;
                       </div>
                       <div className='text-color-707070 font-16'>
                         {moduleitem?.discussionAssignment?.startTime}
                       </div>
                     </div>
                   </Col>
                   <Col className='posted-date-discusstion'>
                     <div className='inline-flex'>
                       <div className='text-color-bcbcbc font-16'>
                         End Date:&nbsp;
                       </div>
                       <div className='text-color-707070 font-16'>
                       {moment(moduleitem?.discussionAssignment?.endDate).format('LL')}&nbsp;
                       </div>
                       <div className='text-color-bcbcbc font-16'>
                         End Time:&nbsp;
                       </div>
                       <div className='text-color-707070 font-16'>
                         {moduleitem?.discussionAssignment?.endTime}
                         
                       </div>
                     </div>
                   </Col> */}

                
                 </div>
                 <div>
                  <hr />
                 </div>
                 </>
                 ):
                  <div>
                    <div className='inline-flex' style={{color:'red'}}>
                      {moduleitem?.discussion?.classId == null ? ( <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Created in Course</Status></div>) : (<div style={{color:'#EE9337', fontSize:'15px'}}><Status>Created in Class</Status></div>)}
                      <Status>Unassigned</Status>
                    </div>
                  <hr />
                </div> 
                    }
              </Row>
                 )})}
              </>
              </Accordion.Body>
              </Accordion.Item>
            )
          })}
          </Accordion>
          <DiscussionComments getDiscussionComments={getDiscussionComments} getComments={getComments} endTime={endTime} endDate={endDate} startTime={startTime} startDate={startDate} getDiscussionUnit={getDiscussionUnit} moduleId={moduleId} discussionId={discussionId} comments={comments} discussionCommentToggle={discussionCommentToggle} discussionCommentModal={discussionCommentModal} />
          <EditDiscussion editDiscussionItem={editDiscussionItem} toggle={toggle} modal={modal} getDiscussionUnit={getDiscussionUnit} /> 
          <AssignedDiscussion moduleId={moduleId} getDiscussionUnit={getDiscussionUnit} discussionId={discussionId} assignToggle={assignToggle} assignModal={assignModal} />
          <EditAssignDiscussion getDiscussionUnit={getDiscussionUnit} editAssignDiscussionItem={editAssignDiscussionItem} editAssignToggle={editAssignToggle} editAssignModal={editAssignModal} />
        </Col>
      </Row>
    </MainContainer>
  )
}
