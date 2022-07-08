import React, {useState, useEffect} from 'react'
import ClassesAPI from '../../../../api/ClassesAPI'
import {Accordion, Row, Col, Table, Button, Form, Modal} from 'react-bootstrap'
import moment from 'moment'
import ContentViewer from '../../../../components/content_field/ContentViewer';

function ShowResultExam({examAnalysis, setViewAnalysis, viewAnalysis}) {

  console.log('examAnalysis:', examAnalysis)

  return (
    <>
    <Modal  size="lg" show={viewAnalysis} onHide={() => setViewAnalysis(false)} aria-labelledby="example-modal-sizes-title-lg">
    <Modal.Header className='class-modal-header' closeButton>
      <Modal.Title id="example-modal-sizes-title-lg" >
        Exam Analysis
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <>
      <Row>
      <Col md={6}>
        <span className='font-view-analysis-header-exam'>{examAnalysis.student?.lname},  {examAnalysis.student?.fname}</span>
      </Col>
      <Col md={6}>
        <span className='font-view-analysis-header-exam float-right'>{examAnalysis.score} / {examAnalysis.assignedRawScore}</span>
      </Col>
      <Col md={6}>
        <p className='font-view-analysis-header-exam'>{examAnalysis?.test?.testName} </p>
      </Col>
      <Col md={6}>
        <p className='font-view-analysis-header-exam float-right'>{moment(examAnalysis.classTest?.startDate).format("LL")} </p>
      </Col>
    </Row>
    {examAnalysis.testPartAnswers?.map((item, index) => {
        return(
            <div>
            <div className='inline-flex'>
              <p className='font-exam-analysis-content-24-tfi' >{index + 1}.&nbsp;</p><p className='font-exam-analysis-content-24-tfi' dangerouslySetInnerHTML={{__html:item.testPart.instructions }}/>
            </div>
              {item.questionDetails.map((qd, index) => {
                return(
                qd.answerDetails.map((ad, index) => {
                  return(
                    <>
                    <br />
                      <span className='font-exam-analysis-content-24-tfi' >{index + 1}.&nbsp;  <span className='font-question-analysis' style={{color:'#707070'}}><ContentViewer>{ad.assignedQuestion}</ContentViewer></span></span>
                      <div className='inline-flex'>
                        <span className='font-exam-analysis-content-24' style={{marginRight:10}}>Student Answer :</span>
                        <span className='font-exam-analysis-content-24'>{ad.studentAnswer === null ? <>Student has no answer</>:<ContentViewer>{ad.studentAnswer}</ContentViewer>}
                        </span> 
                          {/* {ad.studentAnswer?.toLowerCase() == ad.assignedAnswer.toLowerCase() && <i className="fa fa-check-circle" style={{color:"green", marginLeft:"10px"}}></i>}
                          {ad.isConsider == true && <i className="fa fa-check-circle" style={{color:"green", marginLeft:"10px"}}></i>}
                          {ad.studentAnswer?.toLowerCase() != ad.assignedAnswer.toLowerCase() && ad.isConsider == false && <i class='fa fa-times-circle' style={{color:"red", marginLeft:"10px"}}></i>}   */}
                          <span style={{marginRight:10}}>{ad.studentScore >= 1 && <i className="fa fa-1x fa-check-circle" style={{color:"green", marginLeft:"10px"}}></i>}</span>
                          <span style={{marginRight:10}}>{ad.studentScore == 0 && <i class='fa fa-times-circle' style={{color:"red", marginLeft:"10px"}}></i>}</span>
                      </div>
                      <br />
                      <div className='inline-flex' >
                        <span className='font-exam-analysis-content-24' style={{marginRight:10}}>Correct Answer :</span>
                        <span className='font-exam-analysis-content-24' style={{marginRight:10}}><ContentViewer>{ad.assignedAnswer}</ContentViewer></span>
                      </div>
                      
                      <hr></hr>
                    </>
                  )
                })
                )
              })}
            </div>
        )
      })}
      </>
    </Modal.Body>
  </Modal>
  </>
  )
}

export default ShowResultExam