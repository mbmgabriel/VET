import React, { useState, useContext, useEffect } from 'react'
import {Row, Col, Accordion, Button, Tooltip, OverlayTrigger} from 'react-bootstrap'
import moment from 'moment'
import StundentAnswerTask from './components/StundentAnswerTask';
import StudentSubmittedTask from './components/StudentSubmittedTask';
import { useParams } from 'react-router';
import { UserContext } from '../../../context/UserContext'
import ClassesAPI from '../../../api/ClassesAPI';
import StudentViewTask from './components/StudentViewTask';
import ContentViewer from '../../../components/content_field/ContentViewer';
import Status from '../../../components/utilities/Status';

function StudentTask({taskModule, searchTerm, moduleId, getTaskModule}) {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [answerTaskModal, setAnswerTaskModal] = useState(false)
  const [submittedTaskModal, setSubmittedTaskModal] = useState(false)
  const [taskId, setTaskId] = useState(null)
  const [taskAnswerItem, setTaskAnswerItem] = useState()
  const {id} = useParams();
  const dateCompareNow = moment().format("YYYY-MM-DD")
  const timeNow = moment().format('HH:mm');
  const [viewTaskMotal, setViewTaskModal] = useState()
  const [viewTaskItem, setViewTaskItem] = useState([])
  const [startDate, setStartDate] = useState()
  const [startTime, setStartTime] = useState()
  const [endDate, setEndDate] = useState()
  const [endTime, setEndTime] = useState() 

  console.log("taskModuletaskModuletaskModule:", taskModule)

  const viewTaskToggle = (item, item1, item2, item3, item4) => {
    setViewTaskItem(item)
    setStartDate(item1)
    setStartTime(item2)
    setEndDate(item3)
    setEndTime(item4)
    setViewTaskModal(!viewTaskMotal)
  }

  const answerTaskToggle = (item) => {
    setTaskId(item)
    setAnswerTaskModal(!answerTaskModal)
  }


  const submittedTaskToggle = () => {
    setSubmittedTaskModal(true)
  }

  const getStudentTaskAnwswer = async(item) =>{
    let studentId = user?.student?.id
    let classId = id
    let response = await new ClassesAPI().getStudentTaskAnwswer(studentId, classId, item)
    if(response.ok){
      setTaskAnswerItem(response.data)
      getTaskModule(id, moduleId)
    }else{
      alert('ERROR')
    }
  }

  const handleGetStudentAnswer = (item) => {
    setSubmittedTaskModal(true)
    getStudentTaskAnwswer(item)
  }
  
  useEffect(() => {
    if(taskId !== null){
      return(
        getStudentTaskAnwswer()
      )
    }
    
  }, [])

  const renderTooltipAnswer = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Answer
    </Tooltip>
  )

  const renderTooltipGrade = (props) => (
    <Tooltip id="tooltip-bottom" {...props}>
      View Grade
    </Tooltip>
  )

  const renderTooltipView = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      View
    </Tooltip>
  )

  return (
    <div>
      {taskModule.filter((item) => {
        if(searchTerm == ''){
          return item
        }else if(item?.task?.taskName.toLowerCase().includes(searchTerm.toLowerCase())){
          return item
        }
      }).map(item => {
        return(
          <>
              {(item?.isScheduled === true)?(
              <>
              <Row style={{margin:'8px'}} >
               <Col sm={8}>
                      <div className='title-exam' >
                        {item?.task?.taskName}
                      </div>
                    </Col>
                    <Col sm={9} className='instruction-exam' >
                      <div className='inline-flex'>
                        <div className='text-color-bcbcbc' >
                          Instruction:&nbsp;
                        </div>
                        <div className='text-color-707070' >
                        <ContentViewer>{item?.task?.instructions}</ContentViewer>
                        </div>
                      </div>
                    </Col>
                      {(item.isLoggedUserDone === true)?(
                    <>
                      <Col sm={3} className='icon-exam'>
                      {/* <Button  className="m-r-5 color-white tficolorbg-button" size="sm">Submitted</Button> */}
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 1, hide: 1}}
                        overlay={renderTooltipView}>  
                         <Button onClick={(e) => viewTaskToggle(item?.task, item?.taskAssignment?.startDate, item?.taskAssignment?.startTime, item?.taskAssignment?.endDate, item?.taskAssignment?.endTime)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye" ></i>{' '}</Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 1, hide: 1 }}
                        overlay={renderTooltipGrade}> 
                         <Button onClick={() => handleGetStudentAnswer(item?.task?.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-book-reader"></i></Button>
                      </OverlayTrigger>
                    </Col>
                      {
                        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.taskAssignment?.endDate + ' ' + item?.taskAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                        <></>
                      } 
                    </>
                  ):
                  <>
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.taskAssignment?.startDate + ' ' + item?.taskAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(item?.taskAssignment?.endDate + ' ' + item?.taskAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <Col sm={3} className='icon-exam'>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 1, hide: 1 }}
                        overlay={renderTooltipAnswer}>
                          {!user.isSchoolAdmin && <Button onClick={() => answerTaskToggle(item?.task?.id)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-user-edit"></i></Button>}
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 1, hide: 1 }}
                        overlay={renderTooltipView}>
                          <Button onClick={() => viewTaskToggle(item?.task, item?.taskAssignment?.startDate, item?.taskAssignment?.startTime, item?.taskAssignment?.endDate, item?.taskAssignment?.endTime)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye"></i></Button>
                      </OverlayTrigger>
                      </Col>
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.taskAssignment?.endDate + ' ' + item?.taskAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <Col sm={3} className='icon-exam'>
                      {/* {!user.isSchoolAdmin && <Button  className="m-r-5 color-white tficolorbg-button" size="sm">Not Submitted</Button>} */}
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 1, hide: 1 }}
                        overlay={renderTooltipView}> 
                      <Button onClick={() => viewTaskToggle(item?.task, item?.taskAssignment?.startDate, item?.taskAssignment?.startTime, item?.taskAssignment?.endDate, item?.taskAssignment?.endTime)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye"></i></Button>
                      </OverlayTrigger>
                      </Col>
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(item?.taskAssignment?.startDate + ' ' + item?.taskAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                      <Col sm={3} className='icon-exam'>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 1, hide: 1 }}
                        overlay={renderTooltipView}> 
                          <Button onClick={() => viewTaskToggle(item?.task, item?.taskAssignment?.startDate, item?.taskAssignment?.startTime, item?.taskAssignment?.endDate, item?.taskAssignment?.endTime)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-book-reader"></i></Button>
                      </OverlayTrigger>
                      </Col>
                    }
                    </>
                    }
                    {item?.taskAssignment === null ? (<></>):(<>
                      <Col sm={7} className='due-date-discusstion' >
                        <p className='exam-instruction m-0'>
                          <span className='d-inline-block' style={{ width: 40, fontSize: 16}}>
                            Start:
                          </span>
                            &nbsp;<b style={{ fontSize: '16px' }}>{moment(item?.taskAssignment?.startDate).format("MMMM Do YYYY")}, {moment(item?.taskAssignment?.startTime, 'HH:mm:ss').format('h:mm A')}</b>
                        </p>
                        <p className='exam-instruction m-0 mb-3'>
                          <span className='d-inline-block' style={{ width: 40, fontSize: 16 }}>
                            End:
                          </span>
                            &nbsp;<b style={{ fontSize: '16px' }}>{moment(item?.taskAssignment?.endDate).format("MMMM Do YYYY")}, {moment(item?.taskAssignment?.endTime, 'HH:mm:ss').format('h:mm A')}</b>
                        </p> 
                      </Col>
                      </>)}
                  <>
                  <div className='inline-flex' >
                    {item?.task?.classId == null ? ( <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Created in Course</Status></div>) : (<Status>Created in Class</Status>)}
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.taskAssignment?.startDate + ' ' + item?.taskAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(item?.taskAssignment?.endDate + ' ' + item?.taskAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Ongoing</Status></div>
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.taskAssignment?.endDate + ' ' + item?.taskAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Ended</Status>&nbsp;</div>  
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(item?.taskAssignment?.startDate + ' ' + item?.taskAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                      <div style={{color:'#EE9337', fontSize:'15px'}}><b><Status>Upcoming</Status></b></div>
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isSame(moment(item?.taskAssignment?.startDate + ' ' + item?.taskAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                      <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Ongoing</Status></div>
                    }
                    {(item.isLoggedUserDone === true ?(<>
                      <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Completed</Status></div>
                    </>):(<>
                      <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Not Completed</Status></div>
                    </>))}
                  </div>
                  </>
                    {/* <Col sm={6} className='due-date-discusstion' >
                        <div className='inline-flex'>
                          <div className='text-color-bcbcbc'>
                            Start Date:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                           {moment(item?.taskAssignment?.startDate).format('LL')}&nbsp;
                          </div>
                          <div className='text-color-bcbcbc'>
                            Start Time:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                            {item?.taskAssignment?.startTime}
                          </div>
                      </div>
                      </Col>
                      <Col className='posted-date-discusstion'>
                        <div className='inline-flex'>
                          <div className='text-color-bcbcbc'>
                            End Date:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                            {moment(item?.taskAssignment?.endDate).format('LL')}&nbsp;
                          </div>
                          <div className='text-color-bcbcbc'>
                            End Time:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                            {item?.taskAssignment?.endTime}
                          </div>
                        </div>
                      </Col> */}
                </Row>
                <hr />
              </>
              ):
              <>
              </>}
          </>
        )
      })}
      <StundentAnswerTask getStudentTaskAnwswer={getStudentTaskAnwswer} taskId={taskId} answerTaskToggle={answerTaskToggle} answerTaskModal={answerTaskModal} />
      <StudentViewTask startDate={startDate} startTime={startTime} endDate={endDate} endTime={endTime} viewTaskItem={viewTaskItem} viewTaskToggle={viewTaskToggle} setViewTaskModal={setViewTaskModal} viewTaskMotal={viewTaskMotal} />
      <StudentSubmittedTask setSubmittedTaskModal={setSubmittedTaskModal} taskAnswerItem={taskAnswerItem} submittedTaskToggle={submittedTaskToggle} submittedTaskModal={submittedTaskModal} />
    </div>
  )
}

export default StudentTask
