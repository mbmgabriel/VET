
import Base from './Base';

export default class ClassTermAPI extends Base {
  getTemplate = async (id, termId) => {
    return this.sendRequest({
      path: `/api/Class/${id}/grade/term/${termId}/template`,
      method: 'GET'
    });
  };

  createTemplate = async (id, termId, data) => {
    return this.sendRequest({
      path: `/api/Class/${id}/grade/term/${termId}/template`,
      method: 'POST',
      data
    });
  }

  editTemplate = async (id, termId, data) => {
    return this.sendRequest({
      path: `/api/Class/${id}/grade/term/${termId}/template`,
      method: 'PUT',
      data
    });
  }

  deleteClassTerm = async (id, termId) => {
    return this.sendRequest({
      path: `/api/Class/${id}/grade/term/${termId}/template`,
      method: 'DELETE'
    });
  }

  getAssignment = async (id) => {
    return this.sendRequest({
      path: `/api/Class/${id}/assignment`,
      method: 'GET'
    });
  }

  getTasks = async (id) => {
    return this.sendRequest({
      path: `/api/Class/${id}/task`,
      method: 'GET'
    });
  }

  getTest = async (id) => {
    return this.sendRequest({
      path: `/api/Class/${id}/test`,
      method: 'GET'
    });
  }

  getInteractive = async (id) => {
    return this.sendRequest({
      path: `/api/Class/${id}/interactive`,
      method: 'GET'
    });
  }

  getStudents = async (id) => {
    return this.sendRequest({
      path: `/api/Class/${id}/student/status/true`,
      method: 'GET'
    });
  }

  assignActivity = async (id, termId, gradeTypeId, data) => {
    return this.sendRequest({
      path: `/api/Class/${id}/grade/term/${termId}/template/type/${gradeTypeId}/activity`,
      method: 'POST',
      data
    });
  }

  getAssignedActivity = async (id, termId, gradeTypeId) => {
    return this.sendRequest({
      path: `/api/Class/${id}/grade/term/${termId}/template/type/${gradeTypeId}/activity`,
      method: 'GET'
    });
  }

}
