import React, {useContext} from 'react'
import { Col, Row } from 'react-bootstrap'
import MainContainer from '../../components/layouts/MainContainer'
import SummaryDashboard from '../dashboardfront/SummaryDashboard'
import TeacherDashboardSidePanel from '../dashboardfront/TeacherDashboardSidePanel'
import AnnouncementDashboard from './AnnouncementDashboard'
import { UserContext } from '../../context/UserContext'
import CalendarDashboard from './CalendarDashboard'

export default function TeacherDashboard() {
  const userContext = useContext(UserContext)
  const {user} = userContext.data

  return (
    <MainContainer fluid title="Teacher Dashboard" activeHeader={'teacherdashboard'} >
        {user?.isTeacher &&
          <>
            <Row className="mt-4">
              <Col sm={12}>
                <SummaryDashboard />
              </Col>
              <Col sm={3}>
                <TeacherDashboardSidePanel />
              </Col>
              <Col sm={6}>
                <AnnouncementDashboard />
              </Col>
            </Row>
          </>
          }
          {user?.isStudent &&
          <>        
            <Row className="mt-4">
              <Col sm={3}>
                <TeacherDashboardSidePanel />
              </Col>
              <Col sm={6}>
                <AnnouncementDashboard />
              </Col>
              <Col sm={3}>
                <CalendarDashboard />
              </Col>
            </Row> 
          </>
          }
    </MainContainer>
  )
}