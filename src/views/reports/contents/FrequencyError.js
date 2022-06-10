import React from 'react'
import { Row, Col,Modal, Card } from 'react-bootstrap'
import ContentViewer from '../../../components/content_field/ContentViewer'

function FrequencyError({frequencyItem, setFrequencyModal, frequencyModal}) {
  console.log('frequencyItem:', frequencyItem)
  return (
    <>
    <Modal  size="lg" show={frequencyModal} onHide={() => setFrequencyModal(false)} aria-labelledby="example-modal-sizes-title-lg">
    <Modal.Header className='class-modal-header' closeButton>
      <Modal.Title id="example-modal-sizes-title-lg" >
        Frequency of error
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <>{frequencyItem.map((item, index) =>{
        return(
          <>
            <Card>
            <Card.Header className='header-frequency-card'>{index + 1}. {item?.questionPart?.instructions}</Card.Header>
              <Card.Body>
                {item?.errorFrequencies?.map((item, index) => {
                  return(

                    <>
                  <Card.Title>
                  <span className='font-exam-frequency-content'>{index + 1}.&nbsp;  <span className='font-question-analysis'><ContentViewer>{item?.question}</ContentViewer></span></span>
                  </Card.Title>
                <Card.Text>
                 <b> <p style={{color:'#7D7D7D'}}>Number of correct students: {item?.noOfCorrectAnswer}
                  <br />
                  Number of incorrect students: {item?.noOfWrongAnswer}</p></b>
                  <hr></hr>
                </Card.Text> 
                    </>
                  )
                })}
              </Card.Body>
            </Card>
            <br />
          </>
        )
      })}
      </>
    </Modal.Body>
  </Modal>
  </>
  )
}

export default FrequencyError