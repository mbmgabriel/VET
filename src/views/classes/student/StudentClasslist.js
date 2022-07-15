import React, {useContext} from 'react'
import { Card, Dropdown, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { UserContext } from '../../../context/UserContext'


function StudentClasslist({item}) {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const subsType = localStorage.getItem('subsType');

  return (
    <div>
         <Card className='class-card' >
        <Link to={subsType == 'LMS' ? `/classescontent/${item.classId}/feed` : `/classes/${item.classId}/learn` }>
          <Card.Header className='class-header-card' style={{ backgroundImage: `url(${item.classCover})` }} >
            <Row>
              {/* <Col sm={10}>
                {item.classCode}
              </Col>
              <Col sm={2} style={{textAlign:'right'}}>
              </Col>
              <Col sm={10}>
                <b>{item.gradeName} -  {item.className} </b>
              </Col> */}
              {/* <Col ms={22} style={{fontSize:'15px', textAlign:'right',}}>
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
                  {item.teacherName} <br />
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
        </Link>
      </Card>
    </div>
  )
}

export default StudentClasslist
