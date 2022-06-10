import React, { useEffect } from 'react';
import ExamCreation from '../exam-creation/ExamCreation';
import ClassSideNavigation from './components/ClassSideNavigation';
import ClassBreadcrumbs from './components/ClassBreedCrumbs';
import { useParams } from 'react-router';

export default function CourseExamCreation() {
  const {id} = useParams();
  const subsType = localStorage.getItem('subsType');

  useEffect(() => {
    if(subsType != 'LMS'){
      window.location.href = "/classes"
    }
  }, [])
  return (
    <ClassSideNavigation>
      <ClassBreadcrumbs title='Exam Information' clicked={() => window.location.replace(`/classes/${id}/exam`)}/>
      <ExamCreation />
    </ClassSideNavigation>
  )
}