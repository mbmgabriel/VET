import React, { useState } from 'react'
// import { UserContext } from '../../../context/UserContext'
import {Row, Col, Button,} from 'react-bootstrap'
import moment from 'moment'
import StudentDiscussionComment from './components/StudentDiscussionComment'
import ClassesAPI from '../../../api/ClassesAPI'
import SweetAlert from 'react-bootstrap-sweetalert';
import { useParams } from 'react-router';
import Status from '../../../components/utilities/Status'

function StudentDiscussion({discussionModule, getDiscussionUnit, moduleId, searchTerm}) {
  const [discussionId, setDiscussionId] = useState('')
  const [commentAlert, setCommentAlert] = useState(false)
  const dateCompareNow = moment().format("YYYY-MM-DD")
  const timeNow = moment().format('HH:mm');
  // const dateTimeNow = dateCompareNow + ' ' + '00:00:00';
  const [studentCommentModal, setstudentCommentModal] = useState(false)
  const [comments, setComments] = useState([])
  const [startDate, setStartDate] = useState()
  const [startTime, setStartTime] = useState()
  const [endDate, setEndDate] = useState()
  const [endTime, setEndTime] = useState()
  const [getComments, setGetComments] = useState([])
  const {id} = useParams();
  // const userContext = useContext(UserContext)
  // const {user} = userContext.data
  // const [reply, setReply] = useState('')

  const closeNotify = () =>{
    setCommentAlert(false)
  }

  const studentCommentToggle = () => {
    setstudentCommentModal(!studentCommentModal)
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
        setstudentCommentModal(true)
      }else{
        alert('Something went wrong while getCommenst')
      }
  }

  console.log('discussionModulediscussionModulediscussionModule:', discussionModule)

  return (
    <div>
      {(discussionModule?.filter((item) => {
        if(searchTerm == ''){
          return item
        }else if(item?.discussion?.discussionName?.toLowerCase().includes(searchTerm.toLowerCase())){
          return item
        }
      }).map(item => {
        return(
          <>
            {(item?.isScheduled === true)?(
            <>
          <Row style={{margin:'8px'}}>
            <Col sm={8}>
                <div className='title-exam' >
                  {item?.discussion?.discussionName}
                </div>
              </Col>
              <Col sm={9} className='instruction-exam' >
                <div className='inline-flex'>
                  <div className='text-color-bcbcbc' >
                    Instruction:&nbsp;
                  </div>
                  <div className='text-color-707070' >
                  <span style={{marginTop:"300px !important"}} dangerouslySetInnerHTML={{__html:item?.discussion?.instructions }} />
                  </div>
                </div>
              </Col>
                {(item.isLoggedUserDone === true)?(
              <>
              <Col sm={3} className='icon-exam'>
                <Button  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye" ></i>{' '}</Button>
              </Col>
                {
                  moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.discussionAssignment?.endDate + ' ' + item?.discussionAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                  <></>
                } 
              </>
              ):
              <>
                {/* {
                  moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.discussionAssignment?.startDate + ' ' + item?.discussionAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                  moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(item?.discussionAssignment?.endDate + ' ' + item?.discussionAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                  <></>
                  // <Col sm={3} className='icon-exam'>
                  //   <Button onClick={(e) => getDiscussionComments(e, item.discussion?.id, item?.discussionAssignment?.startDate, item?.discussionAssignment?.startTime, item?.discussionAssignment?.endDate, item?.discussionAssignment?.endTime)} className="m-r-5 color-white tficolorbg-button" size="sm">Comments&nbsp;{item.responseCount}</Button>
                  // </Col>
                }
                {
                  moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.discussionAssignment?.endDate + ' ' + item?.discussionAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                  <></>
                  // <Col sm={3} className='icon-exam'>
                  //   <Button onClick={(e) => getDiscussionComments(e, item.discussion?.id, item?.discussionAssignment?.startDate, item?.discussionAssignment?.startTime, item?.discussionAssignment?.endDate, item?.discussionAssignment?.endTime)} className="m-r-5 color-white tficolorbg-button" size="sm">Comments&nbsp;{item.responseCount}</Button>
                  // </Col>
                } */}
              </>
                }
                {item?.discussionAssignment === null ? (<></>):(<>
                  <Col sm={7} className='due-date-discusstion' >
                    <p className='exam-instruction m-0'>
                      <span className='d-inline-block' style={{ width: 40, fontSize: 16}}>
                        Start:
                      </span>
                        &nbsp;<b style={{ fontSize: '16px' }}>{moment(item?.discussionAssignment?.startDate).format("MMMM Do YYYY")}, {moment(item?.discussionAssignment?.startTime, 'HH:mm:ss').format('h:mm A')}</b>
                    </p>
                    <p className='exam-instruction m-0 mb-3'>
                      <span className='d-inline-block' style={{ width: 40, fontSize: 16 }}>
                        End:
                      </span>
                        &nbsp;<b style={{ fontSize: '16px' }}>{moment(item?.discussionAssignment?.endDate).format("MMMM Do YYYY")}, {moment(item?.discussionAssignment?.endTime, 'HH:mm:ss').format('h:mm A')}</b>
                    </p> 
                  </Col>
                </>)}
                <>
                <div className='inline-flex' >
                {item?.discussion?.classId == null ? ( <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Created in Course</Status></div>) : (<div style={{color:'#EE9337', fontSize:'15px'}}><Status>Created in Class</Status></div>)}
                  {
                    moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.discussionAssignment?.startDate + ' ' + item?.discussionAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                    moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(item?.discussionAssignment?.endDate + ' ' + item?.taskAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                    <>
                      <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Ongoing</Status></div>
                      <span className='commet-btn' onClick={(e) => getDiscussionComments(e, item.discussion?.id, item?.discussionAssignment?.startDate, item?.discussionAssignment?.startTime, item?.discussionAssignment?.endDate, item?.discussionAssignment?.endTime)} style={{cursor:'pointer'}} ><Status>Comments</Status> </span>
                    </>
                  }
                  {
                    moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.discussionAssignment?.endDate + ' ' + item?.discussionAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                  <>
                    <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Ended</Status>&nbsp;</div> 
                    <span className='commet-btn' onClick={(e) => getDiscussionComments(e, item.discussion?.id)} style={{cursor:'pointer'}} ><Status>Comments</Status> </span>  
                  </>
                  }
                  {
                    moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(item?.discussionAssignment?.startDate + ' ' + item?.discussionAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                    <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Upcoming</Status></div>
                  }
                  {
                    moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isSame(moment(item?.discussionAssignment?.startDate + ' ' + item?.discussionAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                    <div style={{color:'#EE9337', fontSize:'15px'}}><Status>Ongoing</Status></div>
                  }
                </div>
                </>
              {/* <Col sm={6} className='due-date-discusstion' >
                  <div className='inline-flex'>
                    <div className='text-color-bcbcbc'>
                      Start Date:&nbsp;
                    </div>
                    <div className='text-color-707070'>
                      {moment(item?.discussionAssignment?.startDate).format('LL')}&nbsp;
                    </div>
                    <div className='text-color-bcbcbc'>
                      Start Time:&nbsp;
                    </div>
                    <div className='text-color-707070'>
                      {item?.discussionAssignment?.startTime}
                    </div>
                </div>
                </Col> */}
                {/* <Col className='posted-date-discusstion'>
                  <div className='inline-flex'>
                    <div className='text-color-bcbcbc'>
                      End Date:&nbsp;
                    </div>
                    <div className='text-color-707070'>
                      {moment(item?.discussionAssignment?.endDate).format('LL')}&nbsp;
                    </div>
                    <div className='text-color-bcbcbc'>
                      End Time:&nbsp;
                    </div>
                    <div className='text-color-707070'>
                      {item?.discussionAssignment?.endTime}
                    </div>
                  </div>
                </Col> */}
          </Row>
          <hr />
            </>):(
            <>
            </>
            )}
          </>
        )
      }))}
      <StudentDiscussionComment getDiscussionComments={getDiscussionComments} getComments={getComments} endTime={endTime} endDate={endDate} startTime={startTime} startDate={startDate} getDiscussionUnit={getDiscussionUnit} moduleId={moduleId} discussionId={discussionId} comments={comments} studentCommentToggle={studentCommentToggle} studentCommentModal={studentCommentModal} />
      <SweetAlert 
          success
          show={commentAlert} 
          title="Done!" 
           onConfirm={closeNotify}>
        </SweetAlert>
    </div>
   
  )
}

export default StudentDiscussion
