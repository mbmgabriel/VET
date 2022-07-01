import Base from './Base';

export default class ClassesAPI extends Base {
  getClasses = async (id) => {
    return this.sendRequest({
      path: `/api/Teacher/${id}/classes`,
      method: 'GET'
    });
  };

  getAllClass = async() => {
    return this.sendRequest({
      path: '/api/Class',
      method: 'GET'
    })
  }

  getClassesStudent = async (id) => {
    return this.sendRequest({
      path: `/api/Student/${id}/class`,
      method: 'GET'
    });
  };

  getPendingClasses = async (id) =>{
    return this.sendRequest({
      path: `/api/Student/${id}/class/pending`,
      method: 'GET'
    })
  }

  createClasses = async data => {
    return this.sendRequest({
      path: `/api/Class`,
      method: 'POST',
      data
    });
  };

  getClassInformation = async (id) => {
    return this.sendRequest({
      path: `/api/Class/${id}`,
      method: 'GET'
    });
  };

  editClasses = async (id, data) => {
    return this.sendRequest({
      path: `/api/Class/${id}`,
      method: 'PUT',
      data
    });
  };

  deleteClasses = async (id) =>{
    return this.sendRequest({
      path: `/api/Class/${id}`,
      method: 'DELETE'
    })
  }

  getStudentTaskAnwswer = async(id, classId, taskId) => {
    return this.sendRequest({
      path: `/api/Student/${id}/class/${classId}/task/${taskId}/answer`,
      method: 'GET'
    })
  }

  getStudentAssignmentAnswer = async (id, classId, assignmentId) => {
    return this.sendRequest({
      path: `/api/Student/${id}/class/${classId}/assignment/${assignmentId}/answer`,
      method: 'GET'
    })
  }

  submitStudentAssignmentAnswer = async (id, classId, assignmentId, data) => {
    return this.sendRequest({
      path: `/api/Student/${id}/class/${classId}/assignment/${assignmentId}/answer`,
      method: 'POST',
      data
    })
  }
    

  submitStudentTaskAnswer = async(id, classId, taskId, data) => {
    return this.sendRequest({
      path:`/api/Student/${id}/class/${classId}/task/${taskId}/answer`,
      method: 'POST',
      data
    })
  }

  getModule = async (id) => {
    return this.sendRequest({
      path: `/api/Module/course/${id}/item/1`,
      method: 'GET'
    });
  };

  getModuleClass = async (classId) => {
    return this.sendRequest({
      path: `/api/Module/class/${classId}/item/1`,
      method: 'GET'
    })
  }

  getTaskModule = async (id, moduleId ) => {
    return this.sendRequest({
      path: `/api/Class/${id}/module/${moduleId}/task`,
      method: 'GET'
    });
  };

creatTask = async (mId, cId,  data) => {
    return this.sendRequest({
      path: `/api/Task/module/${mId}/class/${cId}`,
      method: 'POST',
      data,
      
    })
  }

  deleteTasks = async (tId) => {
    return this.sendRequest({
      path: `/api/Task/${tId}`,
      method: 'DELETE'
    })
  }

  deleteDiscussion = async (id) => {
    return this.sendRequest({
      path: `/api/Discussion/${id}`,
      method: 'DELETE'
    })
  }

  updateTask = async (tId, data) =>{
    return this.sendRequest({
      path:`/api/Task/${tId}`,
      method: 'PUT',
      data
    })
  }

  updateDiscussion = async (id, data) =>{
    return this.sendRequest({
      path: `/api/Discussion/${id}`,
      method: 'PUT',
      data
    })
  }

  getDiscussionComments = async (id, discussionId) => {
    return this.sendRequest({
      path: `/api/Class/${id}/discussion/${discussionId}/response`,
      method: 'GET'
    })
  }
  
  assignDiscussion = async(id, discussionId, data) =>{
    return this.sendRequest({
      path:`/api/Class/${id}/discussion/${discussionId}/assign`,
      method: 'POST',
      data
    })
  }

  updateAssignDiscusion = async(id, discussionId, data) =>{
    return this.sendRequest({
      path: `/api/Class/${id}/discussion/${discussionId}/assign`,
      method: 'PUT',
      data
    })
  }

  createAssignment = async (mId, cId, data) =>{
    return this.sendRequest({
      path: `/api/Assignment/module/${mId}/class/${cId}`,
      method: 'POST',
      data
    })
  }

  delateAssignment = async (aId) => {
    return this.sendRequest({
      path: `/api/Assignment/${aId}`,
      method: 'DELETE'
    })
  }

  updateAssignment = async (aId, data) => {
    return this.sendRequest({
      path: `/api/Assignment/${aId}`,
      method: 'PUT',
      data
    })
  }

  assignAssignment = async (id, assignmentId, data) => {
    return this.sendRequest({
      path: `/api/Class/${id}/assignment/${assignmentId}/assign`,
      method: 'POST',
      data
    })
  }

  updateAssignAssignment = async (id, assignmentId, data) => {
    return this.sendRequest({
      path: `/api/Class/${id}/assignment/${assignmentId}/assign`,
      method: 'PUT',
      data
    })
  }

  assignTask = async (id, taskId, data) => {
    return this.sendRequest({
      path: `/api/Class/${id}/task/${taskId}/assign`,
      method: 'POST',
      data
    })
  }

  updateAssignTask = async (id, taskId, data) => {
    return this.sendRequest({
      path: `/api/Class/${id}/task/${taskId}/assign`,
      method: 'PUT',
      data
    })
  } 

  assignInteractive = async (id, interactiveId, data) => {
    return this.sendRequest({
      path:`/api/Class/${id}/interactive/${interactiveId}/assign`,
      method: 'POST',
      data
    })
  }

  updateAssignInteractive = async (id, interactiveId, data) => {
    return this.sendRequest({
      path:`/api/Class/${id}/interactive/${interactiveId}/assign`,
      method: 'PUT',
      data
    })
  }

  createAnnouncementClass = async (typeId, data) => {
    return this.sendRequest({
      path:`/api/Announcement/type/${typeId}/reference`,
      method: 'POST',
      data
    })
  }

  getAnnouncementClass = async(classId) => {
    return this.sendRequest({
      path: `/api/Announcement/class/${classId}`,
      method: 'GET'
    })
  }

  deleteAnnouncement = async(id) => {
    return this.sendRequest({
      path: `/api/Announcement/${id}`,
      method: 'DELETE'
    })
  }

  updateAnnouncement = async (id, data) => {
    return this.sendRequest({
      path: `/api/Announcement/${id}`,
      method: 'PUT',
      data
    })
  }

  getFeedClass = async (id) => {
    return this.sendRequest({
      path: `/api/Class/${id}/feed`,
      method: 'GET'
    })
  }

  getArchive = async () => {
    return this.sendRequest({
      path:`/api/Class/archive`,
      method:'GET'
    })
  }

  retrieveArchive = async(id) => {
    return this.sendRequest({
      path: `/api/Class/${id}/archive/retrieve`,
      method: 'POST'
    })
  }

  commentAnnouncement = async (id, refId, typeId, data) => {
    return this.sendRequest({
      path:`/api/Class/${id}/feed/${refId}/type/${typeId}/comment`,
      method: 'POST',
      data
    })
  }

  getComment = async (id, refId, typeId) => {
    return this.sendRequest({
      path:`/api/Class/${id}/feed/${refId}/type/${typeId}/comment`,
      method: 'GET'
    })
  }

  likeCommentAnnouncement = async (id, refId, typeId) => {
    return this.sendRequest({
      path: `/api/Class/${id}/feed/${refId}/type/${typeId}/like`,
      method: 'PUT'
    })
  }

  deleteCommentfeed = async (id, commentId) => {
    return this.sendRequest({
      path:`/api/Class/${id}/feed/comment/${commentId}`,
      method: 'DELETE'
    })
  }

//get pages
  getPages = async (cId, mId) => {
    return this.sendRequest({
      path: `/api/Content/class/${cId}/module/${mId}/pages`,
      method: 'GET'
    });
  };

  getDiscussionUnit = async (classId,moduleId) => {
    return this.sendRequest({
      path: `/api/Class/${classId}/module/${moduleId}/discussionwithresponse`,
      method: 'GET'
    });
  };

  createDiscussionModule = async (moduleId, classId, data) =>{
    return this.sendRequest({
      path: `/api/Discussion/module/${moduleId}/class/${classId}`,
      method: 'POST',
      data
    })
  }

  submitComment = async (id, discussionId, data) => {
    return this.sendRequest({
      path: `/api/Class/${id}/discussion/${discussionId}/response`,
      method: 'POST',
      data
    })
  }

  submitRequest = async (code, data) => {
    return this.sendRequest({
      path: `/api/Class/join/${code}`,
      method: 'POST',
      data
    })
  }

  deleteComment = async (id, discussionId, responseId) => {
    return this.sendRequest({
      path: `/api/Class/${id}/discussion/${discussionId}/response/${responseId}`,
      method: 'DELETE'
    })
  }

  getContent = async (cId, mId, pId) => {
    return this.sendRequest({
    path: `/api/Content/class/${cId}/module/${mId}/pages/${pId}`,
    method: 'GET',
    });
  }

  getLink = async (id, typeId) => {
    return this.sendRequest({
      path: `/api/Class/${id}/link/type/${typeId}`,
      method: 'GET',
    });
  }

  createLinks = async (id, typeId, data) =>{
    return this.sendRequest({
      path: `/api/Class/${id}/link/type/${typeId}`,
      method: 'POST',
      data
    })
  }

  deleteLinks = async (id, linkId) =>{
    return this.sendRequest({
      path: `/api/Class/${id}/link/${linkId}`,
      method: 'DELETE'
    })
  }
  
  getStudentList = async (id, isAccepted) =>{
    return this.sendRequest({
      path: `/api/Class/${id}/student/status/${isAccepted}`,
      method: 'GET'
    })
  }
  getStudentEnrolledList = async (id, isAccepted) =>{
    return this.sendRequest({
      path: `/api/Class/${id}/student/status/${isAccepted}`,
      method: 'GET'
    })
  }

  acceptStudent = async (id, isAccepted, data) =>{
    return this.sendRequest({
      path: `/api/Class/${id}/student/status/${isAccepted}`,
      method: 'PUT',
      data
    })
  }
  removeStudentWaitingList = async (id, data) =>{
    return this.sendRequest({
      path: `/api/Class/${id}/student/status`,
      method: 'PUT',
      data
    })
  }
  removeStudentClassList = async (id, studentId) =>{
    return this.sendRequest({
      path: `/api/Class/${id}/student/${studentId}/status`,
      method: 'DELETE',
    })
  }
  editClassLinks = async (id, linkId, data) => {
    return this.sendRequest({
      path: `/api/Class/${id}/link/${linkId}`,
      method: 'PUT',
      data
    })
  }

  getInteractive = async (id, moduleId) =>{
    return this.sendRequest({
      path: `/api/Class/${id}/module/${moduleId}/interactive`,
      method: 'GET'
    })
  }

  getAssignment = async (id, moduleId) =>{
    return this.sendRequest({
      path: `/api/Class/${id}/module/${moduleId}/assignment`,
      method: 'GET'
    })
  }

  getClassModules = async (id) =>{
    return this.sendRequest({
      path: `/api/Module/class/${id}/item/1`,
      method: 'GET'
    })
  }

  getClassTestModules = async (classid, moduleid) =>{
    return this.sendRequest({
      path: `/api/Class/${classid}/module/${moduleid}/test`,
      // path: `/api/Class/${classid}/test/info?moduleId=${moduleid}`,
      method: 'GET'
    })
  }

  getTestReport = async (classid, testid) =>{
    return this.sendRequest({
      path: `/api/Class/${classid}/test/${testid}/report`,
      method: 'GET'
    })
  }

  getClassAssignmentModules = async (classid, moduleid) =>{
    return this.sendRequest({
      path: `/api/Class/${classid}/module/${moduleid}/assignment`,
      method: 'GET'
    })
  }

  getAssignmentReport = async (classid, assignmentid) =>{
    return this.sendRequest({
      // path: `/api/Class/${classid}/assignment/report`,
      path: `/api/Class/${classid}/assignment/${assignmentid}/report`,
      method: 'GET'
    })
  }

  getClassTaskModules = async (classid, moduleid) =>{
    return this.sendRequest({
      path: `/api/Class/${classid}/module/${moduleid}/task`,
      method: 'GET'
    })
  }

  getTaskReport = async (classid, taskid) =>{
    return this.sendRequest({
      // path: `/api/Class/${classid}/task/report`,
      path: `/api/Class/${classid}/task/${taskid}/report`,
      method: 'GET'
    })
  }

  getExamAnalysis = async (studentid, classid, testid) =>{
    return this.sendRequest({
      path: `/api/Student/${studentid}/class/${classid}/test/${testid}/score/analysis`,
      method: 'GET'
    })
  }

  getAssignmentAnalysis = async (studentid, classid, assignmentid) =>{
    return this.sendRequest({
      path: `/api/Student/${studentid}/class/${classid}/assignment/${assignmentid}/analysis`,
      method: 'GET'
    })
  }

  getTaskAnalysis = async (studentid, classid, taskid) =>{
    return this.sendRequest({
      path: `/api/Student/${studentid}/class/${classid}/task/${taskid}/analysis`,
      method: 'GET'
    })
  }

  getClassInteractiveModules = async (classid, moduleid) =>{
    return this.sendRequest({
      path: `/api/Class/${classid}/module/${moduleid}/interactive`,
      method: 'GET'
    })
  }

  getInformationExam = async (testId) => {
    return this.sendRequest({
      path: `/api/Test/${testId}/information`,
      method: 'GET'
    })
  }

  getInteractiveReport = async (classid, interactiveid) =>{
    return this.sendRequest({
      // path: `/api/Class/${classid}/task/report`,
      path: `/api/Class/${classid}/interactive/${interactiveid}/report`,
      method: 'GET'
    })
  }
  
  considerAnswerExamTrue = async (studentid, classid, testid, answerid, data) =>{
    return this.sendRequest({
      path:`/api/Student/${studentid}/class/${classid}/test/${testid}/answer/${answerid}`,
      method: 'PUT',
      data
    });
  };

  updateExamPoints = async (studentid, classid, testid, answerid, data) =>{
    return this.sendRequest({
      path:`/api/Student/${studentid}/class/${classid}/test/${testid}/answer/${answerid}`,
      method: 'PUT',
      data
    });
  };

  updateAssignmentPoints = async (studentid, classid, assignmentid, answerid, data) =>{
    return this.sendRequest({
      path:`/api/Student/${studentid}/class/${classid}/assignment/${assignmentid}/answer/${answerid}`,
      method: 'PUT',
      data
    });
  };

  updateTaskPoints = async (studentid, classid, taskid, answerid, data) =>{
    return this.sendRequest({
      path:`/api/Student/${studentid}/class/${classid}/task/${taskid}/answer/${answerid}`,
      method: 'PUT',
      data
    });
  };

  retakeExam = async (classid, testid, studentid) =>{
    return this.sendRequest({
      path:`/api/Class/${classid}/test/${testid}/student/${studentid}/retake`,
      method: 'DELETE',
    });
  };

  uploadClassList = async(data) => {
    return this.sendRequest({
      path:`/api/Class/${data.classId}/student/excel`,
      method: 'POST',
      data: data.data
    });
  }
  getStudentInformation = async(id, classId) => {
    return this.sendRequest({
      path:`/api/Student/${id}/class/information/status?classId=${classId}`,
      method: 'GET'
    })
  }

  getVideoInformation = async (id, moduleid) => {
    return this.sendRequest({
      path: `/api/Class/${id}/video?moduleid=${moduleid}`,
      method: 'GET',
    });
  };

  deleteVideo = async(id, videoid) => {
    return this.sendRequest({
      path: `/api/Class/${id}/video/${videoid}`,
      method: 'DELETE'
    })
  }
  
  getExamReport = async (classId) => {
    this.sendRequest({
      path:`/api/Class/${classId}/test/report`,
      method: 'GET'
    })
  }

  getClassUnit = async (id) => {
    return this.sendRequest({
      path: `/api/Module/class/${id}/item/1`,
      method: 'GET',
    });
  };

  getAccountInfo = async (id) => {
    return this.sendRequest({
      path: `/api/Account/${id}`,
      method: 'GET',
    });
  };

  getSchoolCode = async (id) => {
    return this.sendRequest({
      path: `/api/School/code`,
      method: 'GET',
    });
  };

  updateMeeting = async (id, data) => {
    return this.sendRequest({
      path: `/api/Class/${id}/Meeting`,
      method: 'PUT',
      data,
    });
  };
  
  getFrequencyReport = async (classId, testId) => {
    return this.sendRequest({
      path: `/api/Class/${classId}/test/${testId}/report/frequency`,
      method:'GET'
    })
  }

  reTakeAssigment = async (id, assignmentId, studentId) => {
    return this.sendRequest({
      path: `/api/Class/${id}/assignment/${assignmentId}/student/${studentId}/retake`,
      method: 'DELETE'
    })
  }

  reTakeTask = async (id, taskId, studentId) => {
    return this.sendRequest({
      path:`/api/Class/${id}/task/${taskId}/student/${studentId}/retake`,
      method: 'DELETE'
    })
  }

}