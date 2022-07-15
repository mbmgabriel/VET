import React from 'react'
import { Col, Row } from 'react-bootstrap'
import MainContainer from '../../../components/layouts/MainContainer';
import SystemAdminSideNavigation from '../components/SystemAdminSideNavigation';

import SchoolAdminTable from '../components/SchoolAdminTable';

export default function StudentsList() {
  return (
    <MainContainer title="School" activeHeader={"school"} style='not-scrollable'>
      <Row className="mt-4">
        <Col sm={3}>
          <SystemAdminSideNavigation active="school_admin"/>
        </Col>
        <Col sm={9} className='scrollable vh-85 pb-5'>
          <SchoolAdminTable />
        </Col>
      </Row>
    </MainContainer>
  )
}
