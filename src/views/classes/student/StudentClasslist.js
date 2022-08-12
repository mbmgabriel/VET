import React, {useContext} from 'react'
import { Card, Dropdown, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { UserContext } from '../../../context/UserContext'


function StudentClasslist({item}) {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const subsType = user.subsType;

  const handleRedirect = (id) => {
    if(subsType.includes('LMS')){
      return `/classescontent/${id}/feed`
    }
    if(subsType == 'Ebooks'){
      return `/classes/${id}/learn`
    }
    if(subsType == 'Interactives' && user.isStudent){
      return `/classes/${id}/interactives`
    }
    if(subsType == 'TeacherResources') return `/classes/${id}/interactives`;

  }

  return (
    <div>
         <Card className='class-card' >
        <Link to={handleRedirect(item.classId)}>
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
            {item.className} 
              <Col className='font-color' sm={10}>
                {item.classCode}
              </Col>
              <Col sm={10}>
                <b>
                {item.teacherName} <br /> 
                 <spam className='font-color'> {item.gradeName} </spam> <br />
                 {item.courseName}
                </b> 
                <br /> 
                <br />
              </Col>
            </Card.Subtitle>
            <Card.Text className='font-color'>
            <Row>
            <Col sm={8}>
               Student <br />
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
