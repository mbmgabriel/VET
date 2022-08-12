import React from 'react'
import { Col, Row } from 'react-bootstrap'
import MainContainer from '../../../components/layouts/MainContainer';
import SystemAdminSideNavigation from '../components/SystemAdminSideNavigation';

import SchhoolStudentsTable from '../components/SchoolStudentsTable';

export default function StudentsList() {
  return (
    <MainContainer title="School" fluid activeHeader={"school"} style='not-scrollable'>
      <Row className="mt-4">
        <Col sm={3}>
          <SystemAdminSideNavigation active="students"/>
        </Col>
        <Col sm={9} className='scrollable vh-85 pb-5'>
          <SchhoolStudentsTable />
        </Col>
      </Row>
    </MainContainer>
  )
}
