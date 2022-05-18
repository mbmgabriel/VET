import React from 'react'
import { Col, Row } from 'react-bootstrap'
import MainContainer from '../../components/layouts/MainContainer'
import SummaryDashboard from '../dashboardfront/SummaryDashboard'
import TeacherDashboardSidePanel from '../dashboardfront/TeacherDashboardSidePanel'
import AnnouncementDashboard from './AnnouncementDashboard'
import CalendarDashboard from './CalendarDashboard'

export default function TeacherDashboard() {
  return (
    <MainContainer fluid title="Teacher Dashboard" >
        <Row className="mt-4">
          <Col sm={12}>
            <SummaryDashboard />
          </Col>
        </Row>
        <Row>
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
    </MainContainer>
  )
}