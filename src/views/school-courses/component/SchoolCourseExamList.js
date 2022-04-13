import React, { useEffect } from 'react';
import CourseContent from '../../CourseContent';
import CourseBreadcrumbs from '../../components/CourseBreadcrumbs';
import { useParams } from 'react-router';
import CourseExamCreation from '../../courses/pages/Exam/CourseExamCreation';


function SchoolCourseExamList() {
  return (
    <CourseExamCreation />
  )
}

export default SchoolCourseExamList