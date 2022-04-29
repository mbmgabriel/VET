import React from 'react'
import { Col, Row } from 'react-bootstrap'
import MainContainer from '../../components/layouts/MainContainer'
import AdminSideNavigation from '../../components/side-navigation/AdminSideNavigation'
import SchoolTeachersTable from './components/SchoolTeachersTable'
import SchoolTermTable from './components/SchoolTermTable'

export default function SchoolTerms() {
  return (
    <MainContainer title="School" activeHeader={"school"} style='not-scrollable'>
      <Row className="mt-4">
        <Col sm={3}>
          <AdminSideNavigation active="terms"/>
        </Col>
        <Col sm={9} className='rounded-white-container px-4'>
          <SchoolTermTable />
        </Col>
      </Row>
    </MainContainer>
  )
}
