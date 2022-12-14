import React, { useEffect } from 'react'
import MainContainer from '../../components/layouts/MainContainer'
import ExamHeaders from './components/ExamHeaders'
import ExamList from './components/ExamList'
import CourseContent from '../courses/CourseContent'
export default function Exam() {
  useEffect(() => {
    window.location.href = "/"
  }, []);
  
  return (
    <MainContainer activeHeader={'exam'}>
      <CourseContent>
        <ExamHeaders />
        <ExamList />
      </CourseContent>
    </MainContainer>
  )
}
