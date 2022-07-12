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
  const subsType = localStorage.getItem('subsType');

  const getCourseInformation = async () =>{
    let response = await new CoursesAPI().getCourseInformation(id)
    if(response.ok){
      setCourseInfos(response.data)
    }
  }

  useEffect(() => {
    getCourseInformation();
    if(subsType != 'LMS'){
      window.location.href = "/courses"
    }
  }, [])

  return (
    <>
    {user.isSchoolAdmin && 
    <>
      <MainContainer title="Exam" style='not-scrollable' activeHeader={"exam"}>
        <Row className="mt-4 not-scrollable">
          <Col sm={3}>
            <CourseSideNav courseInfos={courseInfos} active="Exam" />
          </Col>
          <Col sm={9} className='scrollable vh-85'>
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
