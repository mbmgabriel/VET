import React, { useEffect, useState } from 'react';
import { useContext } from "react";
import ExamCreation from '../../../exam-creation/ExamCreation';
import CourseContent from '../../CourseContent';
import CourseBreadcrumbs from '../../components/CourseBreadcrumbs';
import { useParams } from 'react-router';
import { UserContext } from '../../../../context/UserContext';
import CourseSideNav from '../../../../components/side-navigation/CourseSideNav';
import MainContainer from '../../../../components/layouts/MainContainer';
import { Col, Row } from 'react-bootstrap'
import CoursesAPI from '../../../../api/CoursesAPI';



export default function CourseExamCreation() {
  const {id} = useParams();
  const userContext = useContext(UserContext);
  const { user } = userContext.data;
  const [courseInfos, setCourseInfos] = useState([])

  const getCourseInformation = async () =>{
    let response = await new CoursesAPI().getCourseInformation(id)
    if(response.ok){
      setCourseInfos(response.data)
    }
  }

  useEffect(() => {
    getCourseInformation();
  }, [])

  return (
    <>
    {user.isSchoolAdmin && 
    <>
      <MainContainer title="Exam" activeHeader={"exam"}>
        <Row className="mt-4">
          <Col sm={3}>
            <CourseSideNav courseInfos={courseInfos} active="Exam" />
          </Col>
          <Col sm={9}>
            <ExamCreation />
          </Col>
        </Row>
      </MainContainer>
    </>
    }
    <CourseContent>
      <CourseBreadcrumbs title='Exam Information' clicked={() => window.location.replace(`/courses/${id}/exam`)}/>
      <ExamCreation />
    </CourseContent>
    </>
  )
}
