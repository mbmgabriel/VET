import React, { useContext, useState, useEffect } from 'react'
import {Row, Col, Button, Tooltip, OverlayTrigger} from 'react-bootstrap'
import moment from 'moment'
import { useParams } from 'react-router'
import { UserContext } from '../../../../context/UserContext'
import StudentAnswerAssignment from './StudentAnswerAssignment'
import StudentSubmittedAssigment from './StudentSubmittedAssigment'
import ClassesAPI from '../../../../api/ClassesAPI'
import StudentViewAssignment from './StudentViewAssignment'
import ContentViewer from '../../../../components/content_field/ContentViewer'

function StudentAssignment({assignment, searchTerm}) {
  const [answerModal, setAnswerModal] = useState(false)
  const [submittedAssignment, setSubmittedAssignment] = useState(false)
  const [studentAnswer, setStudentAnswer] = useState()
  const [assignmentId, setAssignmentId] = useState(null)
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const {id} = useParams();
  const dateCompareNow = moment().format("YYYY-MM-DD")
  const timeNow = moment().format('HH:mm');
  const dateTimeNow = dateCompareNow + ' ' + '00:00:00';
  const [viewAssignmentModal, setViewAssignmentModal] = useState(false)
  const [viewAssignmentItem, setViewAssignmentItem] = useState([])
  const [startDate, setStartDate] = useState()
  const [startTime, setStartTime] = useState()
  const [endDate, setEndDate] = useState()
  const [endTime, setEndTime] = useState()

  const viewAssignmentToggle = (item, item1, item2, item3, item4) => {
    setViewAssignmentItem(item)
    setStartDate(item1)
    setStartTime(item2)
    setEndDate(item3)
    setEndTime(item4)
    setViewAssignmentModal(!viewAssignmentModal)
    }

  const answerAnswerToggle = (item) => {
    setAssignmentId(item)
    setAnswerModal(!answerModal)
  }

  const submittedAssignmentToggle =  () => {
    setSubmittedAssignment(!submittedAssignment)
  }

  const getStudentAssignmentAnswer = async(item) => {
    let studentId = user.student.id
    let classId = id
    let response = await new ClassesAPI().getStudentAssignmentAnswer(studentId, classId, item)
      if(response.ok){
        setStudentAnswer(response.data)
        submittedAssignmentToggle()
      }else{
       alert('ERROR getStudentAssignmentAnswer')
      }
  }

  useEffect(() => {
    if(assignmentId !== null){
      return(
        getStudentAssignmentAnswer()
      )
    }
    
  }, [])

  const renderTooltipAnswer = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Answer
    </Tooltip>
  )

  const renderTooltipView = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      View
    </Tooltip>
  )

  return (
    <div>
      {assignment.filter((item)=>{
        if(searchTerm == ''){
          return item
        }else if(item?.assignment?.assignmentName.toLowerCase().includes(searchTerm.toLowerCase())){
          return item
        }
      }).map(item =>{
        return(
          <>
            {(item?.isScheduled === true)?(
              <>
              <Row  style={{margin:'8px'}} >
               <Col sm={8}>
                      <div className='title-exam' >
                        {item?.assignment?.assignmentName}
                      </div>
                    </Col>
                    <Col sm={9} className='instruction-exam' >
                      <div className='inline-flex'>
                        <div className='text-color-bcbcbc' >
                          Instruction:&nbsp;
                        </div>
                        <div className='text-color-707070' >
                        <ContentViewer>{item?.assignment?.instructions}</ContentViewer>
                        </div>
                      </div>
                    </Col>
                      {(item.isLoggedUserDone === true)?(
                    <>
                      <Col sm={3} className='icon-exam'>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 1, hide: 1 }}
                        overlay={renderTooltipView}>
                          <Button onClick={() => viewAssignmentToggle(item?.assignment, item?.classAssignment?.startDate, item?.classAssignment?.startTime, item?.classAssignment?.endDate, item?.classAssignment?.endTime)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye" ></i>{' '}</Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 1, hide: 1 }}
                        overlay={renderTooltipAnswer}>
                          <Button onClick={() => getStudentAssignmentAnswer(item?.assignment?.id)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-book-reader"></i></Button>
                      </OverlayTrigger>
                    </Col>
                      {
                        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.classAssignment?.endDate + ' ' + item?.classAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                        <></>
                      } 
                    </>
                  ):
                  <>
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.classAssignment?.startDate + ' ' + item?.classAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(item?.classAssignment?.endDate + ' ' + item?.classAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <Col sm={3} className='icon-exam'>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 1, hide: 1 }}
                        overlay={renderTooltipAnswer}>
                          {!user.isSchoolAdmin && <Button onClick={() => answerAnswerToggle(item?.assignment?.id)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-user-edit"></i></Button>}
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 1, hide: 1 }}
                        overlay={renderTooltipView}>
                        <Button onClick={() => viewAssignmentToggle(item?.assignment, item?.classAssignment?.startDate, item?.classAssignment?.startTime, item?.classAssignment?.endDate, item?.classAssignment?.endTime)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye"></i></Button>
                      </OverlayTrigger>
                      </Col>
                      }
                      {
                        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.classAssignment?.endDate + ' ' + item?.classAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                        <Col sm={3} className='icon-exam'>
                        {!user.isSchoolAdmin && <Button  className="m-r-5 color-white tficolorbg-button" size="sm">Not Submitted</Button>}
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 1, hide: 1 }}
                          overlay={renderTooltipView}>
                            <Button onClick={() => viewAssignmentToggle(item?.assignment, item?.classAssignment?.startDate, item?.classAssignment?.startTime, item?.classAssignment?.endDate, item?.classAssignment?.endTime)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye"></i></Button>
                        </OverlayTrigger>
                        </Col>
                      }
                      {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(item?.classAssignment?.startDate + ' ' + item?.classAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                      <Col sm={3} className='icon-exam'>
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 1, hide: 1 }}
                          overlay={renderTooltipView}>
                           <Button onClick={() => viewAssignmentToggle(item?.assignment, item?.classAssignment?.startDate, item?.classAssignment?.startTime, item?.classAssignment?.endDate, item?.classAssignment?.endTime)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye"></i></Button>
                        </OverlayTrigger>
                      </Col>
                      }
                    </>
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.classAssignment?.startDate + ' ' + item?.classAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(item?.classAssignment?.endDate + ' ' + item?.classAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <div style={{color:'#EE9337', fontSize:'15px'}}><b>Ongoing</b></div>
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.classAssignment?.endDate + ' ' + item?.classAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <div style={{color:'#EE9337', fontSize:'15px'}}><b>Ended</b>&nbsp;</div>  
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(item?.classAssignment?.startDate + ' ' + item?.classAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                      <div style={{color:'#EE9337', fontSize:'15px'}}><b>Upcoming</b></div>
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isSame(moment(item?.classAssignment?.startDate + ' ' + item?.classAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                      <div style={{color:'#EE9337', fontSize:'15px'}}><b>Ongoing</b></div>
                    }
                    <Col sm={6} className='due-date-discusstion' >
                        <div className='inline-flex'>
                          <div className='text-color-bcbcbc'>
                            Start Date:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                           {moment(item?.classAssignment?.startDate).format('LL')}&nbsp;
                          </div>
                          <div className='text-color-bcbcbc'>
                            Start Time:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                            {item?.classAssignment?.startTime}
                          </div>
                        </div>
                    </Col>
                      <Col className='posted-date-discusstion'>
                        <div className='inline-flex'>
                          <div className='text-color-bcbcbc'>
                            End Date:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                            {moment(item?.classAssignment?.endDate).format('LL')}&nbsp;
                          </div>
                          <div className='text-color-bcbcbc'>
                            End Time:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                            {item?.classAssignment?.endTime}
                          </div>
                        </div>
                      </Col>
                </Row>
               <hr />
              </>
              ):
              <>
              </>}
          </>
        )
      })}
      <StudentAnswerAssignment assignmentId={assignmentId} answerAnswerToggle={answerAnswerToggle} answerModal={answerModal} />
      <StudentViewAssignment setViewAssignmentModal={setViewAssignmentModal} startDate={startDate} startTime={startTime} endDate={endDate} endTime={endTime} viewAssignmentItem={viewAssignmentItem} viewAssignmentToggle={viewAssignmentToggle} viewAssignmentModal={viewAssignmentModal} />
      <StudentSubmittedAssigment studentAnswer={studentAnswer} submittedAssignmentToggle={submittedAssignmentToggle} submittedAssignment={submittedAssignment} />
    </div>
  )
}

export default StudentAssignment
