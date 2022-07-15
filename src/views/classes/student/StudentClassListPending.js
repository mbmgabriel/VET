import React from 'react'
import { Card, Dropdown, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function StudentClassListPending({item}) {
  return (
    <div>
       <Card className='class-card' >
          <Card.Header className='class-header-card-pending' >
            <Row>
              <Col sm={10}>
                {/* {item.classCode} */}
              </Col>
              <Col sm={2} style={{textAlign:'right'}}>
              </Col>
              <Col sm={10}>
                {/* <b>{item.gradeName} -  {item.className} </b> */}
              </Col>
              {/* <Col sm={8}>
               {item.courseName}
              </Col>
              <Col ms={22} style={{fontSize:'15px', textAlign:'right',}}>
                <i className="fas fa-user"></i> 30
             </Col> */}
           </Row>
          </Card.Header>
          <Card.Body>
          <Card.Title>
            </Card.Title>
            <Card.Subtitle>
            {item.courseName} 
              <Col className='font-color' sm={10}>
                {item.classCode}
              </Col>
              <Col sm={10}>
                <b>
                  {item.className} <br /> 
                 <p className='font-color'> {item.gradeName} </p> 
                </b> 
              </Col>
            </Card.Subtitle>
            <Card.Text className='font-color'>
            <Row>
            <Col sm={8}>
               Student
              </Col>
              <Col ms={22} style={{fontSize:'15px', textAlign:'right',}}>
                <i className="fas fa-user"></i> {item?.classEnrolledCount}
                <br />
             </Col>
            </Row>
            </Card.Text>
          </Card.Body>
      </Card>
    </div>
  )
}

export default StudentClassListPending
