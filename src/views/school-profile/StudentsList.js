import React from 'react'
import { Col, Row } from 'react-bootstrap'
import MainContainer from '../../components/layouts/MainContainer'
import AdminSideNavigation from '../../components/side-navigation/AdminSideNavigation'
import StudentsTable from './components/StudentsTable'

export default function SchoolStudents() {
  return (
    <MainContainer title="School" activeHeader={"school"} style='not-scrollable'>
      <Row className="mt-4">
        <Col sm={3}>
          <AdminSideNavigation active="students"/>
        </Col>
        <Col sm={9} className='scrollable vh-85 pb-5'>
          <StudentsTable />
        </Col>
      </Row>
    </MainContainer>
  )
}
