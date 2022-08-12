import React from 'react'
import { Col, Row } from 'react-bootstrap'
import MainContainer from '../../components/layouts/MainContainer'
import AdminSideNavigation from '../../components/side-navigation/AdminSideNavigation'
import SchoolAdminTable from './components/SchoolAdminTable'

export default function SchoolAdminList() {
  return (
    <MainContainer title="School" fluid activeHeader={"school"} style='not-scrollable'>
      <Row className="mt-4">
        <Col sm={3}>
          <AdminSideNavigation active="schooladmins"/>
        </Col>
        <Col sm={9} className='scrollable vh-85 pb-5'>
          <SchoolAdminTable />
        </Col>
      </Row>
    </MainContainer>
  )
}
