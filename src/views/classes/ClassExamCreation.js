import React, { useEffect, useContext } from 'react';
import ExamCreation from '../exam-creation/ExamCreation';
import ClassSideNavigation from './components/ClassSideNavigation';
import ClassBreadcrumbs from './components/ClassBreedCrumbs';
import { useParams, useHistory } from 'react-router';
import { UserContext } from '../../context/UserContext';

export default function CourseExamCreation() {
  const userContext = useContext(UserContext);
  const {user} = userContext.data
  const {id} = useParams();
  const subsType = user.subsType;
  const history = useHistory();

  useEffect(() => {
    if(subsType != 'LMS'){
      window.location.href = "/classes"
    }
  }, [])
  return (
    <ClassSideNavigation>
      <ClassBreadcrumbs title='Exam Information' clicked={() => history.push(`/classes/${id}/exam`)}/>
      <ExamCreation />
    </ClassSideNavigation>
  )
}