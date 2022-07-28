import React, { useState, useEffect, useContext } from 'react'
import {Card, InputGroup, FormControl, Row, Col,Button, Form, Tooltip, OverlayTrigger, Fade, Table} from 'react-bootstrap'
import ClassesAPI from '../../../api/ClassesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import EditAnnouncement from '../../classes/components/Feed/EditAnnouncement';
import moment from 'moment';
import { useParams } from 'react-router';
import { UserContext } from '../../../context/UserContext'
import { toast } from 'react-toastify';
import ClassSideNavigation from '../../classes/components/ClassSideNavigation';
import ClassBreadcrumbs from '../../classes/components/ClassBreedCrumbs';
import AnnouncementComment from '../../classes/components/Feed/AnnouncementComment';
import DiscussionAPI from '../../../api/DiscussionAPI';
import {Link} from 'react-router-dom'
import ShowLike from '../../classes/components/Feed/ShowLike';
import ContentField from '../../../components/content_field/ContentField';
import FilesAPI from '../../../api/FilesApi';
import FileHeader from '../../classes/components/Task/TaskFileHeader';
import ContentViewer from '../../../components/content_field/ContentViewer';
import ContentRichText from '../../../components/content_field/ContentRichText';
import MainContainer from '../../../components/layouts/MainContainer'
import ClassAdminSideNavigation from './components/ClassAdminSideNavigation'
import FullScreenLoader from '../../../components/loaders/FullScreenLoader';

function ClassFeed() {
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
  const {user, selectedClassId, setSelectedClassId} = userContext.data
  const [showComment, setShowComment] = useState(Fade)
  const [refId, setRefId] = useState()
  const [typeId, setTypeId] = useState('')
  const [commentName, setCommentName] = useState([])
  const [commentInfo, setCommentInfo] = useState([])
  const [classInfo, setClassInfo] = useState(null)
  const subsType = user.subsType;
  const [showLike, setShowLike] = useState(false)
  const [feedItemLike, setFeedItemLike] = useState([])
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [loading, setLoading] = useState(false)

  const [displayFiles, setDisplayFiles] = useState([]);
  const [showFilesFolders, setShowFilesFolders] = useState(false);
  const [breedCrumbsItemClass, setBreedCrumbsItemClass] = useState([])
  const [showFiles, setShowFiles] = useState(false);
  const [displayType, setDisplayType] = useState('');
  const subFolderDirectory = breedCrumbsItemClass?.map(item => { return `/${item.value}`}) //to get sub directory based on breedcrumbs
  const [displayFolder, setDisplayFolder] = useState([]);
  const [courseId, setCourseId] = useState(null)
  const classId = id

  const closeNotify = () =>{
    setAddNotity(false)
  }

  const handleShowLike = (feedItem) => {
    setShowLike(true)
    setFeedItemLike(feedItem)
  }

  const openEditAnnouncementToggle = (item, item2) =>{
    setEditAssignAssignmentItem(item)
    setContent(item2)
    setEditAnnouncementModal(true)
  }
  
  const createAnnouncementClass = async (e) => {
    e.preventDefault()
    setIsButtonDisabled(true)
    setTimeout(()=> setIsButtonDisabled(false), 1000)
    let typeId = 3
    let useraccountId = 0
    let status = true
    let title = classInfo?.classInformation?.className
    let response = await new ClassesAPI().createAnnouncementClass(typeId, {announcement:{content, title, useraccountId, status}, referenceIds:referenceIds})
      if(response.ok){
        // setAddNotity(true)
        postToast()
        setContent('')
        getFeedClass()
      }else{
        toast.error(response.data.errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      }
  }

  const getClassInfo = async() => {
    let response = await new DiscussionAPI().getClassInfo(id)
    if(response.ok){
      setClassInfo(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
  
  }

  const getClassInformation = async() => {
    setLoading(true)
    let response = await new ClassesAPI().getClassInformation(id)
    if(response.ok){
      setLoading(false)
      setCourseId(response?.data?.courseId)
    }
    setLoading(false)
  }

  useEffect(() => {
    getClassInformation();
  }, [])

  useEffect(() => {
    getClassInfo();
  }, [window.location.pathname])


const getComment = (item, item1, item3) => {
  setRefId(item)
  setTypeId(item1)
  setCommentInfo(item3)
  setShowComment(!showComment)
}

  const getFeedClass = async () => {
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
    setSelectedClassId(id)
    getFeedClass();
    if(subsType != 'LMS'){
      window.location.href = "/classes"
    }
  }, [])

  const deleteAnnouncement = async (item) => {
    let response = await new ClassesAPI().deleteAnnouncement(item)
    if(response.ok){
      // alert('Deleted')
      deleteToast()
      getFeedClass()
      setDeleteNotify(false)
    }else{
      alert(response.data.errorMessage)
    }
  }

  const deleteToast = () => {
    toast.success('Successfully removed announcement!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }
  
  const postToast = () => {
    toast.success('Successfully added announcement!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
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

  const clickFile = (link) => {
    navigator.clipboard.writeText(link)
    toast.success('File link copied to clipboard.')
  }

  const handleClickedBreadcrumbsItem = (value, index, type) => {
    if(type == 'Class'){
      subFolderDirectory.length = index+1;
      breedCrumbsItemClass.length = index+1;
      handleGetClassFiles(subFolderDirectory.join(''));
    }
  }

  const handleClickType = (type) => {
    setDisplayType(type);
    setShowFilesFolders(!showFilesFolders)
    setBreedCrumbsItemClass([]);
    if(type == 'Class'){
      handleGetClassFiles('')
    }
    if(type == 'Course'){
      handleGetCourseFiles('')
    }
  }

  const handleGetClassFiles = async(name) => {
    // setLoading(true)
    let data = {
      "subFolderLocation": name
    }
    let response = await new FilesAPI().getClassFiles(classId, data)
    // setLoading(false)
    if(response.ok){
      setDisplayFiles(response.data.files)
      setDisplayFolder(response.data.folders)
    }else{
      alert("Something went wrong while fetching class files ;;.")
    }
  }

  const handleGetCourseFiles = async(name) => {
    // setLoading(true)
    let data = {
      "subFolderLocation": name
    }
    let response = await new FilesAPI().getCourseFiles(courseId, data)
    // setLoading(false)
    if(response.ok){
      setDisplayFiles(response.data.files)
      setDisplayFolder(response.data.folders)
    }else{
      alert(courseId)
      alert("Something went wrong while fetching Course files.111111111111111")
    }
  }

  const handleFileBreed = () => {
    setBreedCrumbsItemClass([]);
    if(displayType == 'Class'){
      handleGetClassFiles('')
    }
    if(displayType == 'Course'){
      handleGetCourseFiles('')
    }
  }

  const handleClickedFolder = (name, type) =>{
    if(type == 'Class'){
      let temp = {
        naame: name,
        value: name
      }
      breedCrumbsItemClass.push(temp)
      setBreedCrumbsItemClass(breedCrumbsItemClass);
      handleGetClassFiles(`${subFolderDirectory.join('')}/${name}`);
    }else{
      let temp = {
        naame: name,
        value: name
      }
      breedCrumbsItemClass.push(temp)
      setBreedCrumbsItemClass(breedCrumbsItemClass);
      handleGetCourseFiles(`${subFolderDirectory.join('')}/${name}`);
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
    <MainContainer title="School" activeHeader={"classes"} style='not-scrollable' loading={loading}>
      {loading && <FullScreenLoader />}
    <Row className="mt-4">
      <Col sm={3}>
        <ClassAdminSideNavigation active="feed"/>
      </Col>
      <Col sm={9} className='scrollable vh-85'>
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
        <Card className='calendar-card'>
          <Card.Body>
          <Card.Title>
            <div className="col-md-10 pages-header">
              <p className='title-header'>Announcement </p>
              <div>
                <Button onClick={()=> getClassInformation()} className='ml-3'>
                  <i className="fa fa-sync"></i>
                </Button>
              </div>
            </div>
          </Card.Title>
          <Form onSubmit={createAnnouncementClass}>
          <div className={showFiles ? 'mb-3' : 'd-none'}>
          {displayType == 'Class' ?
            <FileHeader type='Class' id={classId}  subFolder={`${subFolderDirectory.join('')}`}  doneUpload={()=> handleGetClassFiles(subFolderDirectory.join(''))} />
            :
            <div>
              <p className='title-header'>Files</p>
            </div>
          }
          <div>
            <span onClick={()=> handleClickType('')} className={displayType ? 'colored-class-task' : 'fix-color-bread'}>Files</span>
            {displayType && <span onClick={()=> handleFileBreed()} className={breedCrumbsItemClass.length == 0 ? 'fix-color-bread' : 'colored-class-task'}> <i class="fas fa-chevron-right m-l-10 m-r-10"></i> {displayType} Files</span>}
            {
              breedCrumbsItemClass?.map((item, index) => {
                return <span onClick={() => handleClickedBreadcrumbsItem(item.value, index, 'Class')} className={breedCrumbsItemClass.length == (index+1) ? 'fix-color-bread' : 'colored-class-task'}>  <i class="fas fa-chevron-right m-l-10 m-r-10"></i> {item.naame}</span>
              })
            }
          </div>
          { showFilesFolders ?
            <>
            {
              displayFiles.map( (item,ind) => {
                  return(
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 1, hide: 0 }}
                      overlay={(props) => 
                        <Tooltip id="button-tooltip" {...props}>
                          {item.name}
                        </Tooltip>}
                    >
                    {item.pathBase?.match(/.(jpg|jpeg|png|gif|pdf)$/i) ? 
                      <img key={ind+item.name} src={item.pathBase.replace('http:', 'https:')} onClick={() => clickFile(item.pathBase)} className='p-1' alt={item.name} height={30} width={30}/>
                      :
                      <i className="fas fa-sticky-note" onClick={() => clickFile(item.pathBase)} style={{paddingRight: 5}}/>
                    }
                    </OverlayTrigger>
                  )
                })
              }
              {
                displayFolder.map((itm) => {
                  return(
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 1, hide: 0 }}
                      overlay={(props) => 
                        <Tooltip id="button-tooltip" {...props}>
                          {itm.name}
                        </Tooltip>}
                    >
                      <i className='fas fa-folder-open' onClick={()=> handleClickedFolder(itm.name, displayType)} title='' style={{height: 30, width: 30}}/>
                    </OverlayTrigger>
                  )
                })
              }
            </>
            :
            <Table responsive="sm">
              <thead>
                <tr>
                  <th>Name</th>  {/* icon for sorting <i class="fas fa-sort-alpha-down td-file-page"></i> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3} onClick={() => handleClickType('Class')} className='ellipsis w-25 task-folder'><i className="fas fa-folder" /><span> Class Files</span></td>
                </tr>
                <tr>
                  <td colSpan={3} onClick={() => handleClickType('Course')} className='ellipsis w-25 task-folder'><i className="fas fa-folder" /><span> Course Files</span></td>
                </tr>
              </tbody>
            </Table>
          }
        </div> 
            {/* <InputGroup  size="lg">
              <InputGroup.Text id="basic-addon2" className="feed-button"><i class="fas fa-user-circle fas-1x" ></i></InputGroup.Text>
                <FormControl onChange={(e) => setContent(e.target.value)} value={content} className='feed-box'  aria-label="small" aria-describedby="inputGroup-sizing-sm" placeholder="Type an Announcement for the class here" type="text"/> 
            </InputGroup> */}
              {/* <Form.Group  style={{display:'inline-flex'}} >
                <Form.Label className="feed-button" ><i class="fas fa-user-circle fas-1x" ></i></Form.Label>
                  <ContentField value={content}  placeholder='Enter instruction here'  onChange={value => setContent(value)} />
                </Form.Group> */}
                
                <ContentRichText value={content}  placeholder='Enter Announcement here'  onChange={value => setContent(value)} />
            <div style={{textAlign:'right', paddingTop:'15px'}}>
            <Button onClick={()=> setShowFiles(!showFiles)}>File Library</Button>&nbsp;
            <Button disabled={isButtonDisabled} className='tficolorbg-button' type='submit' >POST</Button>
            </div>
          </Form>
        </Card.Body>
        </Card>
        {feedClass?.map(item => {
          return(
            <>
            <div className='post-date' style={{paddingButton:''}}>
            {/* <p>{moment(item?.dateUpdated).format('LL')}&nbsp;</p>  */}
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
                        <b>{feedItem?.updatedBy}</b> &nbsp; has Posted an <div className='font-color' > &nbsp; <b>Announcement </b> </div>
                      </div>
                      <p style={{marginLeft:58}}><small><i className="fas fa-clock"></i> {moment(item?.dateUpdated).format('LL')}&nbsp;</small></p> 
                    </Col>
                    <Col md={3}>
                      <div className='inline-flex' style={{paddingTop:'20px', paddingTop:'6px', float:'right', }}>
                        <div style={{color:'#EE9337', fontSize:'18px',paddingTop:'4px'}}>
                          <Button onClick={() => openEditAnnouncementToggle(feedItem, feedItem.description)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-pencil-alt"></i>&nbsp; </Button>
                          </div>
                          <div style={{color:'#EE9337', fontSize:'18px',paddingTop:'4px'}}> 
                          <Button onClick={() => handleDeleteNotify(feedItem?.referenceId)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="far fa-trash-alt"></i>&nbsp; </Button>
                        </div> 
                      </div>
                    </Col>
                  </Row>
                  <Row>  
                    <Col className='icon-post' sm={1}>
                    </Col>
                    <Col sm={11} style={{fontSize:'16px', color:'#707070', textAlign: 'justify'}}>
                    <div className='font-color' >
                      <ContentViewer>{feedItem.description}</ContentViewer>
                    </div>
                    </Col>
                  </Row>
                  <Row>
                    <div className='like-show-name'>
                  <Link to={'#'} onClick={() => handleShowLike(feedItem)} >
                          {feedItem?.likes?.slice(0,2).map(item => {
                            return(
                              <>{item?.likeBy},</>
                            )
                          })}
                          </Link>
                          {feedItem?.likes?.length <= 2? (<></>):(<>&nbsp;and {feedItem?.likes?.length - 2} others</>)}   
                    </div>
                    <hr />
                    <Col style={{textAlign:'center'}}>
                      <div className='inline-flex' >
                        <div style={{color:'#EE9337', }}>
                          </div>
          
                          <div > 
                            {feedItem?.isLike === true ? <>
                              <OverlayTrigger
                                placement="right"
                                delay={{ show: 10, hide: 25 }}
                                overlay={renderTooltipUnlike}>
                                  <Button onClick={() => likeComment(feedItem?.referenceId, feedItem.type)} className='btn-like' Button variant="link"><i class="fas fa-thumbs-up"></i>&nbsp;{feedItem?.likes?.length} Liked&nbsp;<b style={{fontSize:'12px', position:"absolute" }}></b></Button>
                            </OverlayTrigger>
                            </>:<>
                            <OverlayTrigger
                              placement="right"
                              delay={{ show: 10, hide: 25 }}
                              overlay={renderTooltipLike}>
                                <Button onClick={() => likeComment(feedItem?.referenceId, feedItem.type, feedItem)} className='btn-like' Button variant="link"><i class="far fa-thumbs-up"></i>&nbsp;{feedItem?.likes?.length} Like&nbsp;<b style={{fontSize:'12px', position:"absolute" }}></b></Button>
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
                      <Button onClick={() => getComment(feedItem?.referenceId, feedItem.type, feedItem?.comments)} className='btn-like' Button variant="link"><i class="far fa-comment-alt"></i>&nbsp;{feedItem?.comments?.length > 1 ? feedItem?.comments?.length + " " + "Comments" : feedItem?.comments?.length + " " + "Comment"} &nbsp;<b style={{fontSize:'12px', position:"absolute" }}></b></Button>
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
                    {(feedItem.type === 2)?(<><b>{feedItem?.updatedBy}</b> &nbsp; posted a new &nbsp; <div style={{color:'#EE9337'}} > <b>Assignment </b> </div></>):<></>}
                    {(feedItem.type === 3)?(<><b>{feedItem?.updatedBy}</b> &nbsp; posted a new &nbsp; <div style={{color:'#EE9337'}} > <b>Task </b> </div></>):<></>}
                    {(feedItem.type === 4)?(<><b>{feedItem?.updatedBy}</b> &nbsp; posted a new &nbsp; <div style={{color:'#EE9337'}} > <b>Exam </b> </div></>):<></>}
                    {(feedItem.type === 5)?(<><b>{feedItem?.updatedBy}</b> &nbsp; posted a new &nbsp; <div style={{color:'#EE9337'}} > <b>Interactive </b> </div> </>):<></>}
                  
                  </div>
                </div>
                <p style={{marginLeft:58}}><small><i className="fas fa-clock"></i> {moment(item?.dateUpdated).format('LL')}&nbsp;</small></p>
                  <Row>  
                    <Col className='icon-post' sm={1} />
                    <Col sm={11} style={{fontSize:'16px', color:'#EE9337', paddingTop:'30px'}}>
                      <p>{feedItem.title}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12} style={{fontSize:'14px', color:'#707070', textAlign:'justify', paddingLeft:55}} >
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
                    </Col>
                    <Col sm={12} style={{fontSize:'14px', color:'#707070', textAlign:'justify', paddingLeft:55}} >
                      <div className='inline-flex'>
                        <div className='text-color-bcbcbc'>
                          End Date:&nbsp;
                        </div>
                      <div className='text-color-707070'>
                      <p>{moment(feedItem?.endDate).format('ll')}&nbsp;</p> 
                      </div>
                        <div className='text-color-707070'>
                        /  {(feedItem?.endTime)} 
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className='like-show-name'>
                  <Link to={'#'} onClick={() => handleShowLike(feedItem)} >
                          {feedItem?.likes?.slice(0,2).map(item => {
                            return(
                              <>{item?.likeBy},</>
                            )
                          })}
                          </Link>
                          {feedItem?.likes?.length <= 2? (<></>):(<>&nbsp;and {feedItem?.likes?.length - 2} others</>)} 
                    </div>
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
                      <Button onClick={() => getComment(feedItem?.referenceId, feedItem.type, feedItem.comments)} className='btn-like' Button variant="link"><i class="far fa-comment-alt"></i>&nbsp;{feedItem?.comments?.length > 1 ? feedItem?.comments?.length + " " + "Comments" : feedItem?.comments?.length + " " + "Comment"}&nbsp;<b style={{fontSize:'16px', position:"absolute" }}></b></Button>
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
        </Col>
        <EditAnnouncement setEditAnnouncementModal={setEditAnnouncementModal} content={content} setContent={setContent} getFeedClass={getFeedClass} editAnnouncementItem={editAnnouncementItem} editAnnouncementModal={editAnnouncementModal} openEditAnnouncementToggle={openEditAnnouncementToggle} />
        <ShowLike feedItemLike={feedItemLike} showLike={showLike} setShowLike={setShowLike} /> 
      </Row>
    </MainContainer>
  )
}
export default ClassFeed
