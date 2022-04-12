import React, { useState, useEffect, useContext } from 'react'
import MainContainer from '../../../components/layouts/MainContainer'
import ClassAdminSideNavigation from './components/ClassAdminSideNavigation'
import {Card, InputGroup, FormControl, Row, Col,Button, Form, Tooltip, OverlayTrigger, Fade} from 'react-bootstrap'
import ClassesAPI from '../../../api/ClassesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import EditAnnouncement from '../../classes/components/Feed/EditAnnouncement';
import moment from 'moment';
import { useParams } from 'react-router';
import { UserContext } from '../../../context/UserContext';
import { toast } from 'react-toastify';
import AnnouncementComment from '../../classes/components/Feed/AnnouncementComment';

function ClassFeed() {
  const [title, setTitle] = useState('Feed')
  const [content, setContent] = useState('')
  const [announcementItem, setAnnouncementItem] = useState([])
  const {id} = useParams();
  const [referenceIds, setReferenceIds] = useState([id])
  const [deleteNotify, setDeleteNotify] = useState(false)
  const [itemId, setItemId] = useState('')
  const [addNotify, setAddNotity] = useState(false)
  const [editAnnouncementModal, setEditAnnouncementModal] = useState(false)
  const [editAnnouncementItem, setEditAssignAssignmentItem] = useState()
  const [feedClass, setFeedClass] = useState([])
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [showComment, setShowComment] = useState(Fade)
  const [refId, setRefId] = useState()
  const [typeId, setTypeId] = useState('')
  const [commentName, setCommentName] = useState([])
  const [commentInfo, setCommentInfo] = useState([])

  const closeNotify = () =>{
    setAddNotity(false)
  }

  const openEditAnnouncementToggle = (item) =>{
    setEditAssignAssignmentItem(item)
    setEditAnnouncementModal(!editAnnouncementModal)
  }
  
  const createAnnouncementClass = async (e) => {
    e.preventDefault()
    let typeId = 3
    let useraccountId = 0
    let status = true
    let response = await new ClassesAPI().createAnnouncementClass(typeId, {announcement:{content, title, useraccountId, status}, referenceIds:referenceIds})
      if(response.ok){
        setAddNotity(true)
        setContent('')
        getFeedClass()
      }else{
        alert(response.data.errorMessage)
      }
  }

const getComment = (item, item1, item3) => {
  setRefId(item)
  setTypeId(item1)
  setCommentInfo(item3)
  setShowComment(!showComment)
}

  const getFeedClass = async () => {
    console.log(id, 'classssssssss')
    let response = await new ClassesAPI().getFeedClass(id)
    if(response.ok){
    setFeedClass(response.data)
      if(response.data?.feedInformations?.isLike === true){
        setCommentName(response.data?.feedInformations?.commentedBy)
      }
  }else{
    alert(response.data.errorMessage)
   }
  }
  useEffect(() => {
    getFeedClass();
  }, [])

  const deleteAnnouncement = async (item) => {
    let response = await new ClassesAPI().deleteAnnouncement(item)
    if(response.ok){
      // alert('Deleted')
      getFeedClass()
      setDeleteNotify(false)
    }else{
      alert(response.data.errorMessage)
    }
  }

  const handleDeleteNotify = (item) =>{
    setDeleteNotify(true)
    setItemId(item)
  }

  const cancelSweetAlert = () => {
    setDeleteNotify(false)
  }

  const likeComment = async (refId, typeId) => {
    let response = await new ClassesAPI().likeCommentAnnouncement(id, refId, typeId)
      if(response.ok){
        getFeedClass()
      }else{
        alert(response.data.errorMessage)
      }
  }

  const renderTooltipLike= (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Like
    </Tooltip>
  )
  const renderTooltipUnlike = (props) => (
    <Tooltip id="button-tooltip" {...props}>
    Unlike
    </Tooltip>
  )

  const renderTooltipViewComment = (props) => (
    <Tooltip id="button-tooltip" {...props}>
    View Comment
    </Tooltip>
  )

  const renderTooltipNoComment = (props) => (
    <Tooltip id="button-tooltip" {...props}>
    No Comment
    </Tooltip>
  )

  return (
    <MainContainer title="School" activeHeader={"classes"}>
      <Row className="mt-4">
        <Col sm={3}>
          <ClassAdminSideNavigation active="feed"/>
        </Col>
        <Col sm={9}>
          <div className='rounded-white-container'>
            <SweetAlert
              warning
              showCancel
              show={deleteNotify}
              confirmBtnText="Yes, delete it!"
              confirmBtnBsStyle="danger"
              title="Are you sure?"
              onConfirm={() => deleteAnnouncement(itemId)}
              onCancel={cancelSweetAlert}
              focusCancelBtn
            >
              You will not be able to recover this imaginary file!
            </SweetAlert>
              {(user?.teacher === null)?(
              <></>
              ):(
              <>
                <Card className='calendar-card'>
                  <Card.Body>
                  <Form onSubmit={createAnnouncementClass}>
                  <InputGroup  size="lg">
                    <InputGroup.Text id="basic-addon2" className="feed-button"><i class="fas fa-user-circle fas-1x" ></i></InputGroup.Text>
                      <FormControl onChange={(e) => setContent(e.target.value)} value={content} className='feed-box'  aria-label="small" aria-describedby="inputGroup-sizing-sm" placeholder="Type an Announcement for the class here" type="text"/> 
                  </InputGroup>
                  <div style={{textAlign:'right', paddingTop:'15px'}}>
                  <Button className='tficolorbg-button' type='submit' >POST</Button>
                  </div>
                  </Form>
                  </Card.Body>
              </Card>
              </>
              )}
          
          {feedClass.length == 0 && <p>No class feed to display</p>}
          {feedClass?.map(item => {
            return(
              <>
              <div className='post-date' style={{paddingButton:''}}>
              <p>{moment(item?.dateUpdated).format('LL')}&nbsp;</p> 
              </div>

              {item?.feedInformations.map(feedItem =>{
                return(
                <>{(feedItem.type === 1)?(
                <>
                <Card className='post-card'>
                  <Card.Body>
                  <Row>  
                      <Col className='icon-post'>
                        <div className='inline-flex' >
                        <InputGroup.Text id="basic-addon2" className="feed-logo"><i class="fas fa-user-circle fas-1x" ></i></InputGroup.Text>
                      </div>
                      <div className='inline-flex' style={{paddingTop:'1px', fontSize:'18px', color: "#7D7D7D"}}>
                    <b>{feedItem?.updatedBy}</b> &nbsp; has Post an <div style={{color:'#EE9337'}} > &nbsp; <b>Announcement </b> </div>
                    </div>
                  
                    {(user?.teacher === null)?(<></>):(<>
                      <div className='inline-flex' style={{paddingTop:'20px', paddingTop:'6px', float:'right', }}>
                          <div style={{color:'#EE9337', fontSize:'18px',paddingTop:'4px'}}>            
                            <Button onClick={() => openEditAnnouncementToggle(feedItem)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-pencil-alt"></i>&nbsp; Edit Post</Button>
                            </div>
                            <div style={{color:'#EE9337', fontSize:'18px',paddingTop:'4px'}}> 
                            <Button onClick={() => handleDeleteNotify(feedItem?.referenceId)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="far fa-trash-alt"></i>&nbsp; Remove Post</Button>
                          </div> 
                        </div>
                    </>)}
                    </Col>
                    </Row>
                    <hr />
                    <Row>  
                      <Col className='icon-post' sm={1}>
                        <i class="fas fa-file-alt" style={{color:'#EE9337', fontSize:'30px',}}></i>
                      </Col>
                      <Col sm={11} style={{fontSize:'20px', color:'#707070'}}>
                      <p>{feedItem.description}</p>
                      </Col>
                    </Row>
                    <Row>
                      <hr />
                      <Col style={{textAlign:'center'}}>
                        <div className='inline-flex' >
                          <div style={{color:'#EE9337', fontSize:'25px',}}>
                            </div>
                            <div>
                              {feedItem?.isLike === true ? <>
                                <OverlayTrigger
                                  placement="right"
                                  delay={{ show: 10, hide: 25 }}
                                  overlay={renderTooltipUnlike}>
                                    <Button onClick={() => likeComment(feedItem?.referenceId, feedItem.type)} className='btn-like' Button variant="link"><i class="fas fa-thumbs-up"></i>&nbsp;Liked&nbsp;<b style={{fontSize:'16px', position:"absolute" }}>{feedItem?.likes?.length}</b></Button>
                              </OverlayTrigger>
                              </>:<>
                              <OverlayTrigger
                                placement="right"
                                delay={{ show: 10, hide: 25 }}
                                overlay={renderTooltipLike}>
                                  <Button onClick={() => likeComment(feedItem?.referenceId, feedItem.type, feedItem)} className='btn-like' Button variant="link"><i class="far fa-thumbs-up"></i>&nbsp;Like&nbsp;<b style={{fontSize:'16px', position:"absolute" }}>{feedItem?.likes?.length}</b></Button>
                              </OverlayTrigger>
                              </>}
                            </div>
                        </div>
                      </Col>
                      <Col style={{textAlign:'center'}}>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 10, hide: 25 }}
                        overlay={feedItem?.comments?.length ? renderTooltipViewComment : renderTooltipNoComment}>
                        <Button onClick={() => getComment(feedItem?.referenceId, feedItem.type, feedItem?.comments)} className='btn-like' Button variant="link"><i class="far fa-comment-alt"></i>&nbsp;Comment&nbsp;<b style={{fontSize:'16px', position:"absolute" }}>{feedItem?.comments?.length}</b></Button>
                      </OverlayTrigger> 
                      </Col>
                      {showComment === true && refId === feedItem?.referenceId  ? <><AnnouncementComment commentInfo={commentInfo} getFeedClass={getFeedClass} refId={refId} typeId={typeId} /></>:<span></span>}
                    </Row>
                  </Card.Body>
                </Card>
                </>
                ):
                <>
                <Card className='post-card'>
                  <Card.Body>
                  <div className='inline-flex'>
                    <div>
                    <InputGroup.Text id="basic-addon2" className="feed-logo"><i class="fas fa-user-circle fas-1x" ></i></InputGroup.Text>
                    </div>
                    <div  className='inline-flex' style={{paddingTop:'12px', fontSize:'18px', color: "#7D7D7D"}}>
                      {(feedItem.type === 2)?(<><b>{feedItem?.updatedBy}</b> &nbsp; has Post an &nbsp; <div style={{color:'#EE9337'}} > <b>Assignment </b> </div></>):<></>}
                      {(feedItem.type === 3)?(<><b>{feedItem?.updatedBy}</b> &nbsp; has Post an &nbsp; <div style={{color:'#EE9337'}} > <b>Task </b> </div></>):<></>}
                      {(feedItem.type === 4)?(<><b>{feedItem?.updatedBy}</b> &nbsp; has Post an &nbsp; <div style={{color:'#EE9337'}} > <b>Exam </b> </div></>):<></>}
                      {(feedItem.type === 5)?(<><b>{feedItem?.updatedBy}</b> &nbsp; has Post an &nbsp; <div style={{color:'#EE9337'}} > <b>Interactive </b> </div> </>):<></>}
                    
                    </div>
                  </div>
                    <hr/>
                    <Row>  
                      <Col className='icon-post' sm={1}>
                        <i class="fas fa-file-alt" style={{color:'#EE9337', fontSize:'30px', paddingTop:'30px'}}></i>
                        
                      </Col>
                      <Col sm={7} style={{fontSize:'20px', color:'#EE9337', paddingTop:'30px'}}>
                        <p>{feedItem.title}</p>
                        
                      </Col>
                      <Col  sm={4} style={{fontSize:'20px', color:'#707070', textAlign:'right'}} >
                      <div className='inline-flex'>
                        <div className='text-color-bcbcbc'>
                          Start Date:&nbsp;
                        </div>
                      <div className='text-color-707070'>
                      <p>{moment(feedItem?.startDate).format('ll')}&nbsp;</p> 
                      </div>
                        <div className='text-color-707070'>
                        / {feedItem?.startTime}
                        </div>
                      </div>
                      <div className='inline-flex'>
                        <div className='text-color-bcbcbc'>
                          Start End:&nbsp;
                        </div>
                      <div className='text-color-707070'>
                      <p>{moment(feedItem?.endDate).format('ll')}&nbsp;</p> 
                      </div>
                        <div className='text-color-707070'>
                        /  {feedItem?.endTime}
                        </div>
                      </div>
                    </Col>
                    </Row>
                      <Col>
                      <hr />
                      </Col>
                      <Row>
                      <Col style={{textAlign:'center'}}>
                        <div className='inline-flex' >
                          <div style={{color:'#EE9337', fontSize:'25px',}}>
                            </div>
                            <div>
                            {feedItem?.isLike === true ? <>
                                <OverlayTrigger
                                  placement="right"
                                  delay={{ show: 10, hide: 25 }}
                                  overlay={renderTooltipUnlike}>
                                    <Button onClick={() => likeComment(feedItem?.referenceId, feedItem.type)} className='btn-like' Button variant="link"><i class="fas fa-thumbs-up"></i>&nbsp;Liked&nbsp;<b style={{fontSize:'16px', position:"absolute" }}>{feedItem?.likes?.length}</b></Button>
                              </OverlayTrigger>
                              </>:<>
                              <OverlayTrigger
                                placement="right"
                                delay={{ show: 10, hide: 25 }}
                                overlay={renderTooltipLike}>
                                  <Button onClick={() => likeComment(feedItem?.referenceId, feedItem.type, feedItem)} className='btn-like' Button variant="link"><i class="far fa-thumbs-up"></i>&nbsp;Like&nbsp;<b style={{fontSize:'16px', position:"absolute" }}>{feedItem?.likes?.length}</b></Button>
                              </OverlayTrigger>
                              </>}
                            </div>
                        </div>
                      </Col>
                      <Col style={{textAlign:'center'}}>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 10, hide: 25 }}
                        overlay={feedItem?.comments?.length ? renderTooltipViewComment : renderTooltipNoComment}>
                        <Button onClick={() => getComment(feedItem?.referenceId, feedItem.type, feedItem.comments)} className='btn-like' Button variant="link"><i class="far fa-comment-alt"></i>&nbsp;Comment&nbsp;<b style={{fontSize:'16px', position:"absolute" }}>{feedItem?.comments?.length}</b></Button>
                      </OverlayTrigger>
                      </Col>
                      {showComment === true && refId === feedItem?.referenceId  ? <><AnnouncementComment commentInfo={commentInfo} getFeedClass={getFeedClass} refId={refId} typeId={typeId} /></>:<span></span>}
                    </Row>
                  </Card.Body>
                </Card>
                </>
                }
                  </>
                )
              })}
              </>
            )
          })}
          <SweetAlert 
            success
            show={addNotify} 
            title="Done!" 
            onConfirm={closeNotify}>
          </SweetAlert>
          <EditAnnouncement getFeedClass={getFeedClass} editAnnouncementItem={editAnnouncementItem} editAnnouncementModal={editAnnouncementModal} openEditAnnouncementToggle={openEditAnnouncementToggle} />
          </div>
        </Col>
      </Row>
    </MainContainer>
  )
}
export default ClassFeed
