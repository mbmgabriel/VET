import Base from "./Base";

export default class ExamAPI extends Base {
  getExams = async (id) =>
    this.sendRequest({
      path: `/api/Class/${id}/test`,
    });

  getExamInformation = async (id) =>
    this.sendRequest({
      path: `/api/Test/${id}/information`,
    });

  getExamStatus = async (id, classId, testId) => 
  this.sendRequest({
    path: `/api/Student/${id}/class/${classId}/test/${testId}/answer/status`,
  });

  getExamPartStatuses = async (id, classId, testId) =>
    this.sendRequest({
      path: `/api/Student/${id}/class/${classId}/test/${testId}/score/analysis`,
    });

  startTest = async (id, classId, testId) =>
    this.sendRequest({
      path: `/api/Student/${id}/class/${classId}/test/${testId}/answer/start`,
      method: "POST",
    });

  endTest = async (id, classId, testId) =>
    this.sendRequest({
      path: `/api/Student/${id}/class/${classId}/test/${testId}/answer/end`,
      method: "POST",
      data: {},
    });

  submitTestPerPart = async (id, classId, testId, partId, data) =>
    this.sendRequest({
      path: `/api/Student/${id}/class/${classId}/test/${testId}/part/${partId}/answer/range`,
      method: "POST",
      data,
    });

  createExam = async (classId, moduleId, data) =>
    this.sendRequest({
      path: `/api/Test/module/${moduleId}/class/${classId}`,
      method: "POST",
      data,
    });
    
  assignExam = async (classId, id, data) => 
    this.sendRequest({
      path: `/api/Class/${classId}/test/${id}/assign`,
      method: "POST",
      data,
    });

  reAssignExam = async (classId, id, data) => 
  this.sendRequest({
    path: `/api/Class/${classId}/test/${id}/assign`,
    method: "PUT",
    data,
  });

  updateExam = async (id, data) =>
    this.sendRequest({
      path: `/api/Test/${id}`,
      method: "PUT",
      data,
    });

  deleteExam = async (id) =>
    this.sendRequest({
      path: `/api/Test/${id}`,
      method: "DELETE",
    });

  addPart = async (id, typeId, data) =>
    this.sendRequest({
      path: `/api/Test/${id}/part/${typeId}`,
      method: "POST",
      data,
    });

  editPart = async (id, data) =>
    this.sendRequest({
      path: `/api/TestPart/${id}`,
      method: "PUT",
      data,
    });

  getParts = async (id) =>
    this.sendRequest({
      path: `/api/Test/${id}/part`,
    });

  deletePart = async (id) =>
    this.sendRequest({
      path: `/api/TestPart/${id}`,
      method: "DELETE",
    });

  deleteQuestion = async (id) =>
    this.sendRequest({
      path: `/api/Question/${id}`,
      method: "DELETE",
    });

  addEssay = async (id, partId, data) =>
    this.sendRequest({
      path: `/api/Test/${id}/part/${partId}/question/type/essay`,
      method: "POST",
      data,
    });

  editEssay = async (id, data) =>
    this.sendRequest({
      path: `/api/Question/${id}`,
      method: "PUT",
      data,
    });

  addIdentification = async (id, partId, data) =>
    this.sendRequest({
      path: `/api/Test/${id}/part/${partId}/question/type/identification`,
      method: "POST",
      data,
    });

  editIdentification = async (id, data) =>
    this.sendRequest({
      path: `/api/Question/${id}`,
      method: "PUT",
      data,
    });

  editIdentificationAnswer = async (id, data) =>
    this.sendRequest({
      path: `/api/Choices/${id}`,
      method: "PUT",
      data,
    });

  addTrueOrFalse = async (id, partId, data) =>
    this.sendRequest({
      path: `/api/Test/${id}/part/${partId}/question/type/trueorfalse`,
      method: "POST",
      data,
    });

  editTrueOrFalse = async (id, data) =>
    this.sendRequest({
      path: `/api/Question/${id}`,
      method: "PUT",
      data,
    });
    
  editTrueOrFalseAnswer = async (id, data) =>
    this.sendRequest({
      path: `/api/Choices/${id}`,
      method: "PUT",
      data,
    });
  
  addMultipleChoice = async (id, partId, data) =>
    this.sendRequest({
      path: `/api/Test/${id}/part/${partId}/question/type/multiplechoice`,
      method: "POST",
      data,
    });
    
  editMultipleChoice = async (id, data) =>
    this.sendRequest({
      path: `/api/Question/${id}`,
      method: "PUT",
      data,
    });

  editMultipleChoiceAnswer = async (id, data) =>
    this.sendRequest({
      path: `/api/Choices/${id}`,
      method: "PUT",
      data,
    });

    
  addEnumeration = async (id, partId, data) =>
    this.sendRequest({
      path: `/api/Test/${id}/part/${partId}/question/type/enumeration`,
      method: "POST",
      data,
    });
    
  editEnumeration = async (id, data) =>
    this.sendRequest({
      path: `/api/Question/${id}`,
      method: "PUT",
      data,
    });
    
  editEnumerationAnswer = async (id, data) =>
    this.sendRequest({
      path: `/api/Choices/${id}`,
      method: "PUT",
      data,
    });

  uploadTestPart = async (testId, typeId, data) =>
    this.sendRequest({
      path: `/api/Test/${testId}/part/${typeId}/question/upload`,
      method: 'POST',
      data
    });

  getPartInfo = async(id, partId) => 
    this.sendRequest({
      path: `/api/Test/${id}/part/${partId}/question`,
      method: 'GET',
    });
  
  updateExamAnalysis = async (id, examId, data) => {
    this.sendRequest({
      path: `/api/Class/${id}/test/${examId}/assign`,
      method: 'PUT',
      data
    })
  }

  getExamReport = async (classId) => {
    this.sendRequest({
      path:`/api/Class/${classId}/test/report`,
      method: 'GET'
    })
  }
}
