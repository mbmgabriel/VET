import React from 'react'
import {Badge, Table, Button, Form, Card, Row, Col} from 'react-bootstrap'
import ContentViewer from '../../../components/content_field/ContentViewer'

function FrequencyOferror({frequencyItem}) {
  return (
    <>
    {frequencyItem.map(item => {
      return(
        <>
        <div style={{display:'flex', paddingRight:'20px'}}> 
            <div style={{float:'right', paddingTop:'65px'}}>
            <div className='analytics-exam-header'><ContentViewer>{item?.questionPart?.instructions}</ContentViewer></div> 
            </div>
        </div>
         
        <Table striped hover size='sm'>
        <thead>
        <tr>
          <th>Question</th>
          <th>No of Correct</th>
          <th>% Frequency</th>
        </tr>
      </thead>
      <tbody>
       
        {item?.errorFrequencies?.map(item =>{
          return(
            <>
               <tr>
                  <td >
                      <span >
                        <ContentViewer>{item?.question.substring(0, 100)}</ContentViewer>
                      </span> 
                  </td>
                  <td>
                   <span style={{display:'inline-flex'}}><ContentViewer>{item?.noOfCorrectAnswer}</ContentViewer>/<ContentViewer>{item?.noOfTotalAnswer}</ContentViewer></span>
                  </td>
                  <td>
                  {(item?.noOfCorrectAnswer / item?.noOfTotalAnswer * 100).toFixed(2)} %
                  </td>
                  </tr>
            </>
          )
        })}
               
              </tbody>
        </Table>
        </>
      )

    })}
    </>
  )
}

export default FrequencyOferror