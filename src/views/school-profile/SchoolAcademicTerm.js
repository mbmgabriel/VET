import React from 'react'
import { Col, Row } from 'react-bootstrap'
import MainContainer from '../../components/layouts/MainContainer'
import AdminSideNavigation from '../../components/side-navigation/AdminSideNavigation'
import SchoolTeachersTable from './components/SchoolTeachersTable'
import AcademicTermTable from './components/AcademicTermTable'

export default function SchoolAcademicTerms() {
  return (
    <MainContainer title="School" activeHeader={"school"} style='not-scrollable'>
      <Row className="mt-4">
        <Col sm={3}>
          <AdminSideNavigation active="academicTerm"/>
        </Col>
        <Col sm={9} className='rounded-white-container px-4'>
          <AcademicTermTable />
        </Col>
      </Row>
    </MainContainer>
  )
}
