import React from 'react';
import ExamCreation from '../../exam-creation/ExamCreation';
import {  Col, Row } from 'react-bootstrap';
import MainContainer from '../../../components/layouts/MainContainer'
import ClassAdminSideNavigation from './components/ClassAdminSideNavigation';

export default function SchoolAdminFiles() {


  return (
    <MainContainer title="School" activeHeader={"classes"}>
      <Row className="mt-4 not-scrollable">
        <Col sm={3}>
          <ClassAdminSideNavigation active="exam"/>
        </Col>
        <Col sm={9} className='scrollable vh-85'>
          <ExamCreation />
        </Col>
      </Row>
    </MainContainer>
  )
}
