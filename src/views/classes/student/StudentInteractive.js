import React, { useContext, useState, useEffect } from 'react'
import {Row, Col, Button, Tooltip, OverlayTrigger} from 'react-bootstrap'
import moment from 'moment'
import { UserContext } from '../../../context/UserContext'
import {useParams} from 'react-router';

function StudentInteractive({interactive, searchTerm}) {
  const dateCompareNow = moment().format("YYYY-MM-DD")
  const timeNow = moment().format('HH:mm');
  // const dateTimeNow = dateCompareNow + ' ' + '00:00:00';
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const {id} = useParams();
  let dev = 'dev'

  const getInteractiveLink = (e, path, userId, gameId, classId, dev) => {
    e.preventDefault()
    window.open(path + '?sid=' + userId + '&gid=' + gameId + '&cid=' + classId + '#' + dev) 
  }

  const renderTooltipPlay = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Play
    </Tooltip>
  )

  return (
    <div>
      {interactive?.filter((item) => {
        if(searchTerm == ''){
          return item
        }else if(item?.interactive?.interactiveName.toLowerCase().includes(searchTerm.toLowerCase())){
          return item
        }
      }).map(item => {
        return(
          <>
            {(item?.isScheduled === true)?(
            <>
               <Row>
               <Col sm={8}>
                      <div className='title-exam' >
                        {item?.interactive?.interactiveName}
                      </div>
                    </Col>
                      {(item.isLoggedUserDone === true)?(
                    <>
                    <Col sm={3} className='icon-exam'>
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 10, hide: 25 }}
                      overlay={renderTooltipPlay}> 
                        <Button onClick={(e) => getInteractiveLink(e, item?.interactive?.path, user?.student?.id, item?.interactive?.id, id, dev)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-play" ></i></Button>  
                    </OverlayTrigger>
                    </Col>
                    </>
                  ):
                  <>
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.classInteractiveAssignment?.startDate + ' ' + item?.classInteractiveAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(item?.classInteractiveAssignment?.endDate + ' ' + item?.classInteractiveAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <Col sm={3} className='icon-exam'>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 10, hide: 25 }}
                        overlay={renderTooltipPlay}> 
                          <Button onClick={(e) => getInteractiveLink(e, item?.interactive?.path, user?.student?.id, item?.interactive?.id, id, dev)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-play" ></i></Button>
                      </OverlayTrigger>
                      </Col>
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.classInteractiveAssignment?.endDate + ' ' + item?.classInteractiveAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <Col sm={3} className='icon-exam'>
                      
                      </Col>
                    }
                    </>
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.classInteractiveAssignment?.startDate + ' ' + item?.classInteractiveAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(item?.classInteractiveAssignment?.endDate + ' ' + item?.classInteractiveAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <div style={{color:'#EE9337', fontSize:'15px'}}><b>Ongoing</b></div>
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.classInteractiveAssignment?.endDate + ' ' + item?.classInteractiveAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <div style={{color:'#EE9337', fontSize:'15px'}}><b>Ended</b>&nbsp;</div>  
                    }
                    <Col sm={6} className='due-date-discusstion' >
                        <div className='inline-flex'>
                          <div className='text-color-bcbcbc'>
                            Start Date:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                           {moment(item?.classInteractiveAssignment?.startDate).format('LL')}&nbsp;
                          </div>
                          <div className='text-color-bcbcbc'>
                            Start Time:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                            {item?.classInteractiveAssignment?.startTime}
                          </div>
                      </div>
                      </Col>
                      <Col className='posted-date-discusstion'>
                        <div className='inline-flex'>
                          <div className='text-color-bcbcbc'>
                            End Date:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                            {moment(item?.classInteractiveAssignment?.endDate).format('LL')}&nbsp;
                          </div>
                          <div className='text-color-bcbcbc'>
                            End Time:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                            {item?.classInteractiveAssignment?.endTime}
                          </div>
                        </div>
                      </Col>
                </Row>
                <hr />
            </>
            ):(
            <>
            </>
            )}
          </>
        )
      })}
    </div>
  )
}

export default StudentInteractive
