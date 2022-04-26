import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";
import Classes from "../views/classes/Classes";
import Courses from "../views/courses/Courses";
import Exam from "../views/exam/Exam";
import Files from "../views/files/Files";
import ForgotPassword from "../views/forgot-password/ForgotPassword";
import Home from "../views/home/Home";
import Login from "../views/login/Login";
import Reports from "../views/reports/Reports";
import CourseContent from "../views/courses/CourseContent";
import CoursesLearn from "../views/courses/pages/Learn/CoursesLearn";
import CoursesExam from "../views/courses/pages/Exam/CoursesExam";
import CoursesDiscussion from "../views/courses/pages/Discussion/CoursesDiscussion";
import CoursesAssignment from "../views/courses/pages/Assignment/CoursesAssignment";
import CoursesTask from "../views/courses/pages/Task/CoursesTask";
import CourseFiles from "../views/courses/pages/Files/CourseFiles";
import CourseLinks from "../views/courses/pages/Links/CourseLinks";
import CoursesResources from "../views/courses/pages/Resources/CoursesResources";
import CourseExamCreation from "../views/courses/pages/Exam/CourseExamCreation";

import ClassExamCreation from '../views/classes/ClassExamCreation';
import ClassAssignment from '../views/classes/ClassAssignment'
import ClassDiscussion from '../views/classes/ClassDiscussion'
import ClassExam from '../views/classes/ClassExam'
import ClassFeed from '../views/classes/ClassFeed'
import ClassLearn from '../views/classes/ClassLearn'
import ClassLinks from '../views/classes/ClassLinks'
import ClassTask from '../views/classes/ClassTask'
import ClassInteractive from '../views/classes/ClassInteractive'
import ClassList from '../views/classes/ClassList'
import ClassFiles from '../views/classes/ClassFiles'


import ArchiveClass from "../views/classes/ArchiveClass"
import ClassesContent from "../views/classes/ClassesContent";
// import ClassList from "../views/classes/ClassList";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { UserContext } from "../context/UserContext";
import PageLoader from "../components/loaders/PageLoader";
import AuthRoute from "./components/AuthRoute";
import PageNotFound from "../components/error_pages/PageNotFound";
import ExamInformation from "../views/exam-information/ExamInformation";
import ExamCreation from "../views/exam-creation/ExamCreation";
import  Profile from "../views/profile/Profile";
import Dashboard from "../views/dashboard/Dashboard";
import SchoolProfile from "../views/school-profile/SchoolProfile";
import SchoolCourses from "../views/school-courses/SchoolCourses";
import SchoolDiscussion from "../views/school-courses/SchoolDiscussion";
import SchoolExam from "../views/school-courses/SchoolExam";
import SchoolAssignment from "../views/school-courses/SchoolAssignment";
import SchoolTask from "../views/school-courses/SchoolTask";
import SchoolInteractive from "../views/school-courses/SchoolInteractive";
import SchoolFiles from "../views/school-courses/SchoolFiles";
import SchoolTeacher from "../views/school-profile/SchoolTeachers";
import StudentsList from "../views/school-profile/StudentsList";
import SchoolAdminList from '../views/school-profile/SchoolAdmin';
import FilesClass from '../views/files/ClassFiles';
import FilesCourse from '../views/files/CourseFiles';


export default function Routes() {
  const userContext = useContext(UserContext);
  const {loading, refreshUser} = userContext.data
  const {user} = userContext.data

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <div className="content">
      {loading ? <PageLoader/> : 
        (<Router>
          <Switch>
            <PrivateRoute path='/courses' exact component={Courses}/>
            <PrivateRoute path='/coursecontent/:id/learn' exact component={CoursesLearn}/>
            {/* <PrivateRoute path='/courses/:id/learn' exact component={CoursesLearn}/> */}
            <PrivateRoute path='/courses/:id/exam' exact component={CoursesExam}/>
            <PrivateRoute path='/course/:id/exam/:examid' exact component={CourseExamCreation}/>
            <PrivateRoute path='/courses/:id/discussion' exact component={CoursesDiscussion}/>
            <PrivateRoute path='/courses/:id/assignment' exact component={CoursesAssignment}/>
            <PrivateRoute path='/courses/:id/task' exact component={CoursesTask}/>
            <PrivateRoute path='/courses/:id/files' exact component={CourseFiles}/>
            <PrivateRoute path='/courses/:id/resources' exact component={CoursesResources}/>
            <PrivateRoute path='/courses/:id/links' exact component={CourseLinks}/>

            <PrivateRoute path='/classes' exact component={Classes}/>
            <PrivateRoute path='/classescontent/:id/feed' exact component={ClassFeed}/>
            <PrivateRoute path='/class/:id/exam/:examid' exact component={ClassExamCreation}/>
            {/* <PrivateRoute path='/classes/:id/feed' exact component={ClassFeed} /> */}
            <PrivateRoute path='/classes/:id/learn' exact component={ClassLearn} />
            <PrivateRoute path='/classes/:id/exam' exact component={ClassExam} />
            <PrivateRoute path='/classes/:id/discussion' exact component={ClassDiscussion} />
            <PrivateRoute path='/classes/:id/assignment' exact component={ClassAssignment} />
            <PrivateRoute path='/classes/:id/task' exact component={ClassTask} />
            <PrivateRoute path='/classes/:id/interactives' exact component={ClassInteractive} />
            <PrivateRoute path='/classes/:id/links' exact component={ClassLinks} />
            <PrivateRoute path='/classes/:id/classList' exact component={ClassList} />
            <PrivateRoute path='/classes/:id/files' exact component={ClassFiles} />

            <PrivateRoute path='/exam' exact component={Exam}/>
            <PrivateRoute path='/reports' exact component={Reports}/>
            {/* <PrivateRoute path='/classlist' exact component={ClassList}/> */}
            <PrivateRoute path='/archive' exact component={ArchiveClass}/>
            <PrivateRoute path='/classExam/:class_id/exam/:id' exact component={ExamInformation}/>
            <PrivateRoute path='/' exact component={Home}/>
            <PrivateRoute path='/classescontent/:id' exact component={ClassesContent}/>
            <PrivateRoute path='/class/:id/exam/:examid' exact component={ExamInformation}/>
            <PrivateRoute path='/classes' exact component={Classes}/>
            <PrivateRoute path='/' exact component={Home}/>
            <PrivateRoute path='/profile/:id' exact component={Profile}/>
            <PrivateRoute path='/exam_creation/:id' exact component={ExamCreation}/>
            
            <PrivateRoute path='/files' exact component={FilesClass}/>
            <PrivateRoute path='/files/course' exact component={FilesCourse} />

            <PrivateRoute path='/dashboard' exact component={Dashboard}/>
            <PrivateRoute path='/school' exact component={SchoolProfile}/>
            <PrivateRoute path='/school_courses/:id' exact component={SchoolCourses}/>
            <PrivateRoute path='/school_courses/:id/discussion' exact component={SchoolDiscussion}/>
            <PrivateRoute path='/school_courses/:id/exam' exact component={SchoolExam}/>
            <PrivateRoute path='/school_courses/:id/assignment' exact component={SchoolAssignment}/>
            <PrivateRoute path='/school_courses/:id/task' exact component={SchoolTask}/>
            <PrivateRoute path='/school_courses/:id/interactive' exact component={SchoolInteractive}/>
            <PrivateRoute path='/school_courses/:id/files' exact component={SchoolFiles}/>
            <PrivateRoute path='/schoolTeacher' exact component={SchoolTeacher} />
            <PrivateRoute path='/studentsList' exact component={StudentsList} />
            <PrivateRoute path='/schoolAdmin' exact component={SchoolAdminList} />

            <AuthRoute path='/login' exact component={Login}/>
            <AuthRoute path='/forgot_password' exact component={ForgotPassword}/>
            <PublicRoute path='/404' exact component={PageNotFound}/>
            <PrivateRoute path='/' exact component={Home}/>
            <Redirect to="/404"/>
          </Switch>
        </Router>)
      }
    </div>
  );
}
