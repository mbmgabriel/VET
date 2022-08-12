import React from 'react'
import { Col, Row } from 'react-bootstrap'
import MainContainer from '../../components/layouts/MainContainer'
import AdminSideNavigation from '../../components/side-navigation/AdminSideNavigation'
import SchoolProfileContent from './components/SchoolProfileContent'

export default function SchoolProfile() {
  return (
    <MainContainer title="School" fluid activeHeader={"school"}>
      <Row className="mt-4">
        <Col sm={3}>
          <AdminSideNavigation active="school-profile"/>
        </Col>
        <Col sm={9}>
          <SchoolProfileContent />
        </Col>
      </Row>
    </MainContainer>
  )
}
