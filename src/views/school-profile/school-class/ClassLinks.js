import React, {useState, useEffect} from 'react'
import {  Col, Row, Card, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router';
import MainContainer from '../../../components/layouts/MainContainer'
import ClassAdminSideNavigation from './components/ClassAdminSideNavigation'
import ClassLearnHeader from '../../classes/components/Learn/ClassLearnHeader';
import ClassesAPI from '../../../api/ClassesAPI'
import DiscussionAPI from '../../../api/DiscussionAPI'

export default function SchoolAdminLinks() {
  

  return (
    <MainContainer title="School" activeHeader={"classes"}>
      <Row className="mt-4">
        <Col sm={3}>
          <ClassAdminSideNavigation active="learn"/>
        </Col>
        <Col sm={9}>
        
        </Col>
      </Row>
    </MainContainer>
  )
}
