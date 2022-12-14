import React, { useState, useEffect, useContext} from 'react'
import AssignmentHeader from './components/Assignment/AssignmentHeader'
import {Accordion, Row, Col, Button, Tooltip, OverlayTrigger} from 'react-bootstrap'
import ClassesAPI from '../../api/ClassesAPI'
import DiscussionAPI from '../../api/DiscussionAPI'
import EditAssignment from './components/Assignment/EditAssignment'
import SweetAlert from 'react-bootstrap-sweetalert';
import moment from 'moment';
import { useParams } from 'react-router';
import AssignAssignment from './components/Assignment/AssignAssignment'
import EditAssignedAssignment from './components/Assignment/EditAssignedAssignment'
import { UserContext } from '../../context/UserContext'
import StudentAssignment from './student/components/StudentAssignment'
import StudentAnswerAssignment from './student/components/StudentAnswerAssignment'
import StudentSubmittedAssigment from './student/components/StudentSubmittedAssigment'
import ViewAssignment from './components/Assignment/ViewAssignment';
import ClassSideNavigation from './components/ClassSideNavigation';
import ClassBreadcrumbs from './components/ClassBreedCrumbs'
import ContentViewer from '../../components/content_field/ContentViewer'
import Status from '../../components/utilities/Status'
import { toast } from 'react-toastify'
import FullScreenLoader from '../../components/loaders/FullScreenLoader'

function ClassAssignment() {
  const [submittedAssignment, setSubmittedAssignment] = useState(false)
  const [answerModal, setAnswerModal] = useState(false)
  const [modal, setModal] = useState(false)
  const [assginModal, setAssignModal] = useState(false)
  const [editAssignAssignmentItem, setEditAssignAssignmentItem] = useState()
  const [editAssignedAssignmentModal, setEditAssignedAssignmentModal] = useState(false)
  const [assignmentId, setAssignmentId] = useState('')
  const [module, setModule] = useState([])
  const [assignment, setAssignment] = useState([])
  const [editAssignment, setEditAssignment] = useState()
  const {id} = useParams()
  const [deleteNotify, setDeleteNotify] = useState(false)
  const [itemId, setItemId] = useState('')
  const [moduleId, setModuleId] = useState(null)
  const dateCompareNow = moment().format("YYYY-MM-DD")
  const timeNow = moment().format('HH:mm');
  // const dateTimeNow = dateCompareNow + ' ' + '00:00:00';
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [viewAssignmentModal, setViewAssigmentModal] = useState(false)
  const [viewAssignmentItem, setViewAssignmentItem] = useState([])
  const [viewAssignmentAssign, setViewAssignmentAssign] = useState()
  const [searchTerm, setSearchTerm] = useState('')
  const [assignmentName, setAssignmentName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [rate, setRate] = useState('')
  const [unit, setUnit] = useState('')
  const [xmoduleId, setXModuleId] = useState(null)
  const [selectedAssignmentName, setSelectedAssignmentName] = useState("")
  const subsType = user.subsType;
  const [loading, setLoading] = useState(false);
  const [sequenceNo, setSequenceNo] = useState(null)

  const onSearch = (text) => {
    setSearchTerm(text)
  }

  const updateShareAssignment = async (share, instructions, assignmentName, assignmentId, moduleId, rate) =>{
    if(share === null){
      let isShared = true
      let response = await new ClassesAPI().updateAssignment(assignmentId, {
        assignmentName,
        instructions,
        rate,
        isShared
      })
      if(response.ok){
        successShared()
        getAssignmentList(null, moduleId)
      }else{
        alert('No good')
      }
    }else{
      let isShared = null
      let response = await new ClassesAPI().updateAssignment(assignmentId, {
        assignmentName,
        instructions,
        rate,
        isShared
      })
      if(response.ok){
        successUnShared()
        getAssignmentList(null, moduleId)
      }else{
        alert('No good')
      }
    }
  }

  const successShared = () =>{
    toast.success('Successfully shared task!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }

  const successUnShared = () => {
    toast.success('Successfully unshared task!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }

  useEffect(() => {
    getClassInfo(); 
    // if(subsType != 'LMS'){
    //   window.location.href = "/classes"
    // }
  }, [])

  const getClassInfo = async() => {
    setLoading(true)
    let response = await new DiscussionAPI().getClassInfo(id)
    if(response.ok){
    setLoading(false)
      getModule(response.data.classInformation?.courseId)
    }else{
      toast.error('Something went wrong while fetching all courses')
    }
    setLoading(false)
  }


  const viewAssignmentToggle = (item, item1) => {
    setViewAssignmentItem(item)
    setViewAssignmentAssign(item1)
    setViewAssigmentModal(!viewAssignmentModal)
  }

  const submittedAssignmentToggle = () => {
    setSubmittedAssignment(!submittedAssignment)
  }

  const answerAnswerToggle = () => {
    setAnswerModal(!answerModal)
  }

  const toggle = (e, item, item2, item3, item4, item5, item6, item7) =>{
    setInstructions(item)
    setAssignmentName(item2)
    setUnit(item3)
    setAssignmentId(item4)
    setXModuleId(item5)
    setRate(item6)
    setSequenceNo(item7)
    setModal(true)
  }

  const editAssignedAssignmentToggle = (e, item, name) => {
    setSelectedAssignmentName(name)
    setEditAssignAssignmentItem(item)
    setEditAssignedAssignmentModal(!editAssignedAssignmentModal)
  }

  const assignAssignmentToggle = (e, item, name) => {
    setSelectedAssignmentName(name)
    setAssignmentId(item)
    setAssignModal(!assginModal)
  }

  const cancelSweetAlert = () => {
    setDeleteNotify(false)
  }

  const handleDeleteNotify = (item, item1) =>{
    setDeleteNotify(true)
    setItemId(item)
    setModuleId(item1)
  }

  const getModule = async (courseID) =>{
    let response = await new ClassesAPI().getModule(courseID)
    if(response.ok){
        setModule(response.data)
    }else{
      alert("Something went wrong while fetching all Module")
    }
  }


  const getAssignmentList = async (e, item) => {
    let response = await new ClassesAPI().getAssignment(id, item)
      if(response.ok){
        setAssignment(response.data)
        setModuleId(item)
    }else{
      alert("Something went wrong while fetching all Assignment")
    }
  }

  const removeAssignment = async (e, item, item1) => {
    let response = await new ClassesAPI().delateAssignment(item)
    if(response.ok){
      getAssignmentList(null, item1)
      // alert('Assingment Deleted')
      setDeleteNotify(false)
    }else{
      alert("Something went wrong while Deleting a task")
    }
  }

  useEffect(() => {
    if(moduleId !== null){
      return(
        getAssignmentList() 
      )
    }  
  }, [])

  const renderTooltipView = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      View
    </Tooltip>
  )
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
  const renderTooltipAsign = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Assign
    </Tooltip>
  )

  const renderTooltipDelete = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete
    </Tooltip>
  )

  const renderTooltipUnShare = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Unshare
    </Tooltip>
  )

  const renderTooltipShare = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Share
    </Tooltip>
  )

  return (
    <ClassSideNavigation>
      {loading && <FullScreenLoader />}
      <ClassBreadcrumbs title='' clicked={()=> console.log('')}/>
      <AssignmentHeader onSearch={onSearch} module={module} onRefresh={()=> getClassInfo()} getAssignmentList={getAssignmentList} />
      <Accordion>
        <SweetAlert
          warning
          showCancel
          show={deleteNotify}
          confirmBtnText="Yes, delete it!"
          confirmBtnBsStyle="danger"
          title="Are you sure?"
          onConfirm={(e) => removeAssignment(e, itemId, moduleId)}
          onCancel={cancelSweetAlert}
          focusCancelBtn
        >
          You will not be able to recover this imaginary file!
        </SweetAlert>
      {module.map((item, index) => {
        return(<Accordion.Item eventKey={index} onClick={(e) => getAssignmentList(e, item?.id)} >
        <Accordion.Header>
          <div className='unit-exam'style={{fontSize:'20px'}} >{item?.moduleName}
          </div>
        </Accordion.Header>
        <Accordion.Body>
          {(user?.isStudent)?(
          <>
            <StudentAssignment searchTerm={searchTerm} assignment={assignment} getAssignmentList={getAssignmentList} moduleId={moduleId}  />
          </>
          ):
          (
          <>
            {assignment?.filter((assigItem) => {
              if(searchTerm == ''){
                return assigItem
              }else if (assigItem?.assignment?.assignmentName.toLowerCase().includes(searchTerm.toLocaleLowerCase())){
                return assigItem
              }
            }).map(assigItem => {
          return( 
          <Row style={{margin:'10px'}}>
            <Col sm={8}>
              <div className='title-exam'>
                {assigItem?.assignment?.assignmentName}
              </div>
            </Col>
            <Col sm={9} className='instruction-exam' >
              <div className='inline-flex'>
                <div className='text-color-bcbcbc' >
                  Instruction:&nbsp;
                </div>
                <div className='text-color-707070' >
                  <ContentViewer>{assigItem?.assignment?.instructions}</ContentViewer>
                </div>
              </div>
            </Col>
            <Col sm={9} className='instruction-exam' >
              <div className='inline-flex'>
                <div className='text-color-bcbcbc' >
                  Rate:&nbsp;
                </div>
                <div className='text-color-707070' >
                  {assigItem?.assignment?.rate === null ? <></>:<ContentViewer>{assigItem?.assignment?.rate}</ContentViewer>}
                </div>
              </div>
            </Col>
            {assigItem.assignment.classId?( 
              <>
              <Col sm={3} className='icon-exam'>
                {/* <Button onClick={() => submittedAssignmentToggle()} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye" ></i>{' '}</Button>
                <Button onClick={() => answerAnswerToggle()} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-user-edit"></i></Button>
                Student Modal Answers */}
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 1, hide: 0 }}
                    overlay={renderTooltipView}>
                    <Button onClick={() => viewAssignmentToggle(assigItem?.assignment, assigItem?.classAssignment)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye" ></i>{' '}</Button>
                  </OverlayTrigger>
                {assigItem?.classAssignment?(
                  <>
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 1, hide: 0 }}
                    overlay={renderTooltipReasign}>
                      <Button onClick={(e) => editAssignedAssignmentToggle(e, assigItem, assigItem?.assignment?.assignmentName)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-clock"></i></Button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 1, hide: 0 }}
                    overlay={assigItem?.assignment?.isShared ? renderTooltipUnShare : renderTooltipShare}>
                      <Button onClick={() => updateShareAssignment(assigItem?.assignment?.isShared, assigItem?.assignment?.instructions, assigItem?.assignment?.assignmentName, assigItem?.assignment?.id, assigItem?.module?.id, assigItem?.assignment?.rate)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class={`fas fa-share ${assigItem?.assignment?.isShared && "rotate"}`}></i></Button>
                  </OverlayTrigger>
                  </>  
                ):
                // <OverlayTrigger
                //   placement="bottom"
                //   delay={{ show: 1, hide: 0 }}
                //   overlay={renderTooltipAsign}>
                //     <Button onClick={(e) => assignAssignmentToggle(e, assigItem?.assignment?.id, assigItem?.assignment?.assignmentName)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-user-clock"></i></Button>
                // </OverlayTrigger>
                // } 
                // <OverlayTrigger
                //   placement="bottom"
                //   delay={{ show: 1, hide: 0 }}
                //   overlay={renderTooltipDelete}>
                //     <Button onClick={() => handleDeleteNotify(assigItem?.assignment?.id, item?.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-trash-alt"></i></Button>
                // </OverlayTrigger>
                <>
                {assigItem?.assignment?.isShared === true? (
                  <>
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 1, hide: 0 }}
                      overlay={renderTooltipAsign}>
                      <Button onClick={(e) => assignAssignmentToggle(e, assigItem?.assignment?.id, assigItem?.assignment?.assignmentName)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-user-clock"></i></Button>
                    </OverlayTrigger>
                    {assigItem?.assignment?.classId == id ? (<>
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 1, hide: 0 }}
                        overlay={assigItem?.assignment?.isShared ? renderTooltipUnShare : renderTooltipShare}>
                          <Button onClick={() => updateShareAssignment(assigItem?.assignment?.isShared, assigItem?.assignment?.instructions, assigItem?.assignment?.assignmentName, assigItem?.assignment?.id, assigItem?.module?.id, assigItem?.assignment?.rate)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class={`fas fa-share ${assigItem?.assignment?.isShared && "rotate"}`}></i></Button>
                      </OverlayTrigger>
                    </>):(<></>)}
                  </>
                ):(
                  <>
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 1, hide: 0 }}
                      overlay={renderTooltipAsign}>
                        <Button onClick={(e) => assignAssignmentToggle(e, assigItem?.assignment?.id, assigItem?.assignment?.assignmentName)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-user-clock"></i></Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 1, hide: 0 }}
                      overlay={renderTooltipEdit}>
                        <Button onClick={(e) => toggle(e, assigItem?.assignment?.instructions, assigItem?.assignment?.assignmentName, item?.moduleName, assigItem?.assignment?.id, assigItem?.module?.id, assigItem?.assignment?.rate, assigItem?.assignment?.sequenceNo)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-edit"></i></Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 1, hide: 0 }}
                      overlay={assigItem?.assignment?.isShared ? renderTooltipUnShare : renderTooltipShare}>
                        <Button onClick={() => updateShareAssignment(assigItem?.assignment?.isShared, assigItem?.assignment?.instructions, assigItem?.assignment?.assignmentName, assigItem?.assignment?.id, assigItem?.module?.id, assigItem?.assignment?.rate)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class={`fas fa-share ${assigItem?.assignment?.isShared && "rotate"}`}></i></Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 1, hide: 0 }}
                      overlay={renderTooltipDelete}>
                        <Button onClick={() => handleDeleteNotify(assigItem?.assignment?.id, item?.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-trash-alt"></i></Button>
                    </OverlayTrigger>
                  </>
                )}
                </>
                } 
              </Col>
              </>
            ):
            <>
            {assigItem.assignment.classId?(
              <>
              <Col sm={3} className='icon-exam'>
                {/* <Button className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye" ></i>{' '}</Button> */}
                <Button onClick={(e) => assignAssignmentToggle(e, assigItem?.assignment?.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-user-clock"></i>0</Button>
              </Col>
              </>
            ):
              <>
              {assigItem.classAssignment?.startDate?(
              <>
              <Col sm={3} className='icon-exam'>
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 1, hide: 0 }}
                overlay={renderTooltipView}>
                <Button onClick={() => viewAssignmentToggle(assigItem?.assignment, assigItem?.classAssignment)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye" ></i>{' '}</Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 1, hide: 0 }}
                overlay={renderTooltipReasign}> 
                <Button onClick={(e) => editAssignedAssignmentToggle(e, assigItem, assigItem?.assignment?.assignmentName)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-clock"></i></Button>
              </OverlayTrigger>
              </Col>
              </>
              ):(
              <>
                <Col sm={3} className='icon-exam'>
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 1, hide: 0 }}
                  overlay={renderTooltipView}>
                  <Button onClick={() => viewAssignmentToggle(assigItem?.assignment, assigItem?.classAssignment)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye" ></i>{' '}</Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 1, hide: 0 }}
                  overlay={renderTooltipAsign}>  
                  <Button onClick={(e) => assignAssignmentToggle(e, assigItem?.assignment?.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-user-clock"></i></Button>
                </OverlayTrigger>
                </Col>
              </>
              )
              }
              </>
            }
              </>
            }
            {assigItem?.classAssignment === null ? (<></>):(<>
              <Col sm={7} className='due-date-discusstion' >
                <p className='exam-instruction m-0'>
                  <span className='d-inline-block' style={{ width: 40, fontSize: 16}}>
                    Start:
                  </span>
                    &nbsp;<b style={{ fontSize: '16px' }}>{moment(assigItem?.classAssignment?.startDate).format("MMMM Do YYYY")}, {moment(assigItem?.classAssignment?.startTime, 'HH:mm:ss').format('h:mm A')}</b>
                </p>
                <p className='exam-instruction m-0 mb-3'>
                  <span className='d-inline-block' style={{ width: 40, fontSize: 16 }}>
                    End:
                  </span>
                    &nbsp;<b style={{ fontSize: '16px' }}>{moment(assigItem?.classAssignment?.endDate).format("MMMM Do YYYY")}, {moment(assigItem?.classAssignment?.endTime, 'HH:mm:ss').format('h:mm A')}</b>
                </p> 
              </Col>
             </>)}
            {assigItem?.classAssignment?(
              <Row>
                <div className='inline-flex' >
                  {assigItem?.assignment?.classId == null ? ( <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Created in Course</Status></div>) : (<Status>Created in Class</Status>)}
                  {
                    moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(assigItem?.classAssignment?.startDate + ' ' + assigItem?.classAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&  
                      <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Upcoming</Status></div>
                  }
                  {
                    moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(assigItem?.classAssignment?.endDate + ' ' + assigItem?.classAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Ended</Status></div>
                  }
                  {
                    moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isSame(moment(assigItem?.classAssignment?.startDate + ' ' + assigItem?.classAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                    <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Ongoing</Status></div>
                  }
                  {
                    moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(assigItem?.classAssignment?.startDate + ' ' + assigItem?.classAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                    moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(assigItem?.classAssignment?.endDate + ' ' + assigItem?.classAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Ongoing</Status></div>
                  } 
                  {assigItem?.assignment?.classId == null ?(<></>):(<>{assigItem?.assignment?.isShared == true?(<Status>Shared</Status>):(<Status>Not Shared</Status>)} </>)} 
                  
                </div>
                <div className='text-color-bcbcbc' >
                  <hr></hr>
                </div>
            </Row>):
            <>
              <div className='inline-flex' >
                {assigItem?.assignment?.classId == null ? ( <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Created in Course</Status><Status>Unassigned</Status></div>) : (
                  <>
                    <Status>Created in Class</Status>
                    <Status>Unassigned</Status>
                    {assigItem?.assignment?.isShared == true?(<Status>Shared</Status>):(<Status>Not Shared</Status>)}  
                  </>
                )}                  
              </div>
              <div className='text-color-bcbcbc' >
                <hr></hr>
                </div>
            </>
            }
          </Row>)
        })}
          </>
          )}
        </Accordion.Body>
        </Accordion.Item>)
      })}
      </Accordion>
      <ViewAssignment setViewAssigmentModal={setViewAssigmentModal} viewAssignmentAssign={viewAssignmentAssign}  viewAssignmentItem={viewAssignmentItem} viewAssignmentToggle={viewAssignmentToggle} viewAssignmentModal={viewAssignmentModal} />
      <StudentSubmittedAssigment submittedAssignmentToggle={submittedAssignmentToggle} submittedAssignment={submittedAssignment}  />
      <StudentAnswerAssignment answerAnswerToggle={answerAnswerToggle} answerModal={answerModal} />
      <EditAssignment sequenceNo={sequenceNo} setSequenceNo={setSequenceNo} setRate={setRate} rate={rate} xmoduleId={xmoduleId} assignmentId={assignmentId} unit={unit} setUnit={setUnit} setAssignmentName={setAssignmentName} assignmentName={assignmentName} setModal={setModal} instructions={instructions} setInstructions={setInstructions} toggle={toggle} modal={modal} editAssignment={editAssignment} getAssignmentList={getAssignmentList} moduleId={moduleId} />
      <AssignAssignment selectedAssignmentName={selectedAssignmentName} moduleId={moduleId} assignmentId={assignmentId} assginModal={assginModal} assignAssignmentToggle={assignAssignmentToggle} getAssignmentList={getAssignmentList} />
      <EditAssignedAssignment selectedAssignmentName={selectedAssignmentName} moduleId={moduleId} getAssignmentList={getAssignmentList} editAssignAssignmentItem={editAssignAssignmentItem} editAssignedAssignmentModal={editAssignedAssignmentModal} editAssignedAssignmentToggle={editAssignedAssignmentToggle} />
    </ClassSideNavigation>
  )
}
export default ClassAssignment
