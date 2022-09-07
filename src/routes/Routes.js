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
import CoursesVideos from "../views/courses/pages/Videos/CoursesVideo";
import CoursesResources from "../views/courses/pages/Resources/CoursesResources";
import CourseExamCreation from "../views/courses/pages/Exam/CourseExamCreation";
import CourseInterActive from '../views/courses/pages/InterActive/InterActive'

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
import ClassResources from '../views/classes/ClassResources';


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
import SchoolAdminClasses from '../views/school-profile/SchoolAdminClasses';

import AdminClassFeed from '../views/school-profile/school-class/ClassFeed';
import AdminClassLearn from '../views/school-profile/school-class/ClassLearn';
import AdminClassExam from '../views/school-profile/school-class/ClassExam';
import AdminClassDiscussion from '../views/school-profile/school-class/ClassDiscussion';
import AdminClassAssignment from '../views/school-profile/school-class/ClassAssignment';
import AdminClassTask from '../views/school-profile/school-class/ClassTask';
import AdminClassInteractives from '../views/school-profile/school-class/ClassInteractives';
import AdminClassLinks from '../views/school-profile/school-class/ClassLinks';
import AdminClassList from '../views/school-profile/school-class/ClassList';
import AdminClassFiles from '../views/school-profile/school-class/ClassFiles';
import AdminClassExamCreation from '../views/school-profile/school-class/AdminClassExamCreation';
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
import Grading from "../views/grading-template/Grading";
import SchoolTerms from "../views/school-profile/SchoolTerms";
import ClassGrading from "../views/classes/ClassGrading";
import ClassGradingInformation from "../views/classes/ClassGradingInformation";
import NewClassGrading from "../views/classes/NewClassGrading";
import ClassGradingComputation from "../views/classes/ClassGradingComputation";
import ClassVideos from "../views/classes/Videos/ClassVideo";
import TeacherDashboard from "../views/dashboardfront/TeacherDashboard"
import Scratch from "../views/scratch/Scratch";
import CalendarPage from "../views/calendar/CalendarPage";
import SchoolAnouncementContent from "../views/school-profile/components/SchoolAnouncementContent";
import SchoolAnnouncement from "../views/school-profile/SchoolAnnouncement";
import ZoomClient from "../views/zoom-test/ZoomClient";
import ClassMeeting from "../views/classes/ClassMeeting";
import ParentDashboard from "../views/parent/dashboard/ParentDashboard";
import ParentProfile from "../views/parent/profile/ParentProfile";

import SystemAdminDashboard from "../views/system-admin/dashboard/SystemAdminDashboard";
import SystemAdminProfile from "../views/system-admin/profile/SystemAdminProfile";
import SystemAdminTeachers from '../views/system-admin/school/Teachers';
import SystemAdminStudent from '../views/system-admin/school/Students';
import SystemAdminSchool from '../views/system-admin/school/SchoolProfileSystemAdmin';
import SystemAdminCourses from '../views/system-admin/courses/SystemAdminCourses';
import SystemAdminSchoolAdmin from '../views/system-admin/school/SchoolAdmin';

import ExamReportPage from '../views/reports/ExamReportPage';
import TaskReportPage from '../views/reports/TaskReportPage';
import AssignmentReportPage from '../views/reports/AssignmentReportPage';
import InteractiveReportPage from '../views/reports/InteractiveReportPage';

import NotificationsPage from '../views/notification/Notifications';
import SchoolAcademicTerms from "../views/school-profile/SchoolAcademicTerm";

import MirandaAccount from '../views/system-admin/miranda/Miranda';
import EbooksFiles from '../views/courses/pages/Files/EbooksFiles';
import ClassEbooksFiles from '../views/classes/EbooksFiles';
import StudentEbooks from '../views/Ebooks/StudentEbooks';

import SystemAdminEbooks from '../views/system-admin/courses/CourseEbooks';
import SchoolResources from "../views/school-courses/SchoolResources";

import EditClassGrading from "../views/classes/EditClassGrading";


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
            <PrivateRoute path='/courses/:id/videos' exact component={CoursesVideos}/>
            <PrivateRoute path='/courses/:id/resources' exact component={CoursesResources}/>
            <PrivateRoute path='/courses/:id/links' exact component={CourseLinks}/>
            <PrivateRoute path='/courses/:id/interactive' exact component={CourseInterActive}/>

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
            <PrivateRoute path='/classes/:id/class_grading' exact component={ClassGrading} />
            <PrivateRoute path='/classes/:id/class_grading/:term_id' exact component={ClassGradingInformation} />
            <PrivateRoute path='/classes/:id/class_grading/:term_id/computation' exact component={ClassGradingComputation} />
            <PrivateRoute path='/classes/:id/class_grading/:term_id/new' exact component={NewClassGrading} />
            <PrivateRoute path='/classes/:id/class_grading/:term_id/edit' exact component={EditClassGrading} />
            <PrivateRoute path='/classes/:id/class_meeting' exact component={ClassMeeting} />
            <PrivateRoute path='/classes/:id/files' exact component={ClassFiles} />
            <PrivateRoute path='/classes/:id/videos' exact component={ClassVideos} />

            <PrivateRoute path='/classes/:id/resources' exact component={ClassResources}/>

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
            <PrivateRoute path='/dashboard' exact component={TeacherDashboard}/>
            <PrivateRoute path='/teacherdashboard' exact component={TeacherDashboard}/>
            <PrivateRoute path='/admin_dashboard' exact component={Dashboard}/>
            <PrivateRoute path='/schoolannouncement' exact component={SchoolAnnouncement}/>
            <PrivateRoute path='/school' exact component={SchoolProfile}/>
            <PrivateRoute path='/school_courses/:id' exact component={SchoolCourses}/>
            <PrivateRoute path='/school_courses/:id/discussion' exact component={SchoolDiscussion}/>
            <PrivateRoute path='/school_courses/:id/exam' exact component={SchoolExam}/>
            <PrivateRoute path='/school_courses/:id/assignment' exact component={SchoolAssignment}/>
            <PrivateRoute path='/school_courses/:id/task' exact component={SchoolTask}/>
            <PrivateRoute path='/school_courses/:id/interactive' exact component={SchoolInteractive}/>
            <PrivateRoute path='/school_courses/:id/files' exact component={SchoolFiles}/>
            <PrivateRoute path='/school_courses/:id/resources' exact component={SchoolResources}/>

            <PrivateRoute path='/schoolTeacher' exact component={SchoolTeacher} />
            <PrivateRoute path='/studentsList' exact component={StudentsList} />
            <PrivateRoute path='/schoolAdmin' exact component={SchoolAdminList} />

            <PrivateRoute path='/schoolAdminClasses' exact component={SchoolAdminClasses} />
            <PrivateRoute path='/school_classes/:id/feed' exact component={AdminClassFeed}/>
            <PrivateRoute path='/school_classes/:id/exam/:examid' exact component={AdminClassExamCreation}/>
            <PrivateRoute path='/school_classes/:id/learn' exact component={AdminClassLearn} />
            <PrivateRoute path='/school_classes/:id/exam' exact component={AdminClassExam} />
            <PrivateRoute path='/school_classes/:id/discussion' exact component={AdminClassDiscussion} />
            <PrivateRoute path='/school_classes/:id/assignment' exact component={AdminClassAssignment} />
            <PrivateRoute path='/school_classes/:id/task' exact component={AdminClassTask} />
            <PrivateRoute path='/school_classes/:id/interactives' exact component={AdminClassInteractives} />
            <PrivateRoute path='/school_classes/:id/links' exact component={AdminClassLinks} />
            <PrivateRoute path='/school_classes/:id/classList' exact component={AdminClassList} />
            <PrivateRoute path='/school_classes/:id/files' exact component={AdminClassFiles} />

            <PrivateRoute path='/reports/exam' exact component={ExamReportPage} />
            <PrivateRoute path='/reports/assignment' component={AssignmentReportPage} />
            <PrivateRoute path='/reports/task' exact component={TaskReportPage} />
            <PrivateRoute path='/reports/interactive' exact component={InteractiveReportPage} />

            {/* Parent routes */}
            <PrivateRoute path='/parent/dashboard' exact component={ParentDashboard} />
            <PrivateRoute path='/parent/profile' exact component={ParentProfile} />
            {/* Parent routes end */}

            {/* System admin routes */}
            <PrivateRoute path='/system-admin/dashboard' exact component={SystemAdminDashboard} />
            <PrivateRoute path='/system-admin/profile' exact component={SystemAdminProfile} />
            <PrivateRoute path='/system-admin/teachers' exact component={SystemAdminTeachers} />
            <PrivateRoute path='/system-admin/students' exact component={SystemAdminStudent} />
            <PrivateRoute path='/system-admin/school-profile' exact component={SystemAdminSchool} />
            <PrivateRoute path='/system-admin/courses' exact component={SystemAdminCourses} />
            <PrivateRoute path='/system-admin/school_admin' exact component={SystemAdminSchoolAdmin} />
            <PrivateRoute path='/system-admin/miranda' exact component={MirandaAccount} />
            <PrivateRoute path='/system-admin/ebooks' exact component={SystemAdminEbooks} />

            {/* System admin routes end */}

            <PrivateRoute path='/notifications' exact component={NotificationsPage} />
            <PrivateRoute path='/academicTerm' exact component={SchoolAcademicTerms} />

            <PrivateRoute path='/courses/:id/ebooks' exact component={EbooksFiles} />
            <PrivateRoute path='/classes/:id/ebooksFiles' exact component={ClassEbooksFiles} />
            <PrivateRoute path='/ebook_links' exact component={StudentEbooks} />
            
            <PrivateRoute path='/terms' exact component={SchoolTerms} />
            <PrivateRoute path='/admin/grading' exact component={Grading} />
            <PublicRoute path='/calendar' exact component={CalendarPage}/>
            <PublicRoute path='/scratch' exact component={Scratch}/>
            <PublicRoute path='/zoom-client' exact component={ZoomClient}/>
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
