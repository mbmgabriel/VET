import React, {useContext, useState} from 'react'
import { Col, Row } from 'react-bootstrap'
import MainContainer from '../../components/layouts/MainContainer'
import SummaryDashboard from '../dashboardfront/SummaryDashboard'
import TeacherDashboardSidePanel from '../dashboardfront/TeacherDashboardSidePanel'
import AnnouncementDashboard from './AnnouncementDashboard'
import { UserContext } from '../../context/UserContext'
import CalendarDashboard from './CalendarDashboard'

export default function TeacherDashboard() {
  const userContext = useContext(UserContext)
  const {user} = userContext.data;
  const [studentCount, setStudentCount] = useState(0)

  return (
    <MainContainer fluid title="Teacher Dashboard" activeHeader={'dashboard'} >
        {user?.isTeacher &&
          <>
            <Col sm={12}>
              <SummaryDashboard studentCount={studentCount}/>
            </Col>
            <Row className="mt-4">
              <Col sm={1} />
              <Col sm={3}>
                <TeacherDashboardSidePanel setStudentCount={setStudentCount}/>
              </Col>
              <Col sm={7}>
                <AnnouncementDashboard />
              </Col>
            </Row>
          </>
          }
          {user?.isStudent &&
          <>        
            <Row className="mt-4">
              <Col sm={1}></Col>
              <Col sm={3}>
                <TeacherDashboardSidePanel />
              </Col>
              <Col sm={7}>
                <AnnouncementDashboard />
              </Col>
              {/* <Col sm={3}>
                <CalendarDashboard />
              </Col> */}
            </Row> 
          </>
          }
    </MainContainer>
  )
}