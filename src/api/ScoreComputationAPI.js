import Base from './Base';

export default class ScoreComputationAPI extends Base {
  computeActivity = async (studentId, classId, termId, gradeTypeId) => {
    return this.sendRequest({
      path: `/api/Class/${classId}/grade/term/${termId}/template/type/${gradeTypeId}/student/${studentId}/activity`,
      method: 'GET'
    });
  };
  
  computeAssignment = async (id, classId, assignmentId) => {
    return this.sendRequest({
      path: `/api/Student/${id}/class/${classId}/assignment/${assignmentId}/answer`,
      method: 'GET'
    });
  };

  computeTasks = async (id, classId, taskId) => {
    return this.sendRequest({
      path: `/api/Student/${id}/class/${classId}/task/${taskId}/answer`,
      method: 'GET'
    });
  }

  computeTests = async (id, classId, testId) => {
    return this.sendRequest({
      path: `/api/Student/${id}/class/${classId}/test/${testId}/answer`,
      method: 'GET'
    });
  }

}



