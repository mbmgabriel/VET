import Base from './Base';

export default class GradeAPI extends Base {

  newCourseFile = async (data) => {
    return this.sendRequest({
      path: `/api/Upload/course/${data.id}/file`,
      method: 'POST',
      data: data.data
    });
  };

  newTeacherResourceFile = async (data) => {
    return this.sendRequest({
      path: `/api/Upload/course/${data.id}/resource`,
      method: 'POST',
      data: data.data
    });
  };

  getTeacherResources = async (id, data) => {
    return this.sendRequest({
      path: `/api/Course/${id}/resource/v3`,
      method: 'POST',
      data
    });
  };

  updateTeacherResource = async (id, type, data) => {
    return this.sendRequest({
      path: `/api/${type}/${id}/resource/v3/update`,
      method: 'PUT',
      data
    })
  }

  getCourseFiles = async (id, data) => {
    return this.sendRequest({
      path: `/api/Course/${id}/files/v3`,
      method: 'POST',
      data
    });
  };

  newClassFile = async (data) => {
    return this.sendRequest({
      path: `/api/Upload/class/${data.id}/file`,
      method: 'POST',
      data: data.data
    });
  };

  getClassFiles = async (id, data) => {
    return this.sendRequest({
      path: `/api/Class/${id}/files/v3`,
      method: 'POST',
      data
    });
  };

  getAllClassFiles = async() => {
    return this.sendRequest({
      path: `/api/Class/files`,
      method: 'GET',
    });
  }

  getAllCourseFiles = async() => {
    return this.sendRequest({
      path: `/api/Course/files`,
      method: 'GET',
    });
  }
  deleteClassFile = async(id, data) => {
    return this.sendRequest({
      path: `/api/Class/${id}/files/v3/delete`,
      method: 'PUT',
      data
    });
  };

  getFilesForCourse = async (id) => {
    return this.sendRequest({
      path: `/api/Course/${id}/files`,
      method: 'GET'
    })
  }

  deleteCourseFile = async(id, data) => {
    return this.sendRequest({
      path: `/api/Course/${id}/files/v3/delete`,
      method: 'PUT',
      data
    });
  };

  deleteCourseTeacherResourceFile = async(id, data) => {
    return this.sendRequest({
      path: `/api/Course/${id}/resource/v3/delete`,
      method: 'PUT',
      data
    });
  };

  deleteCourseTeacherResourceFolder = async(id, data) => {
    return this.sendRequest({
      path: `/api/Course/${id}/resource/folder/v3/delete`,
      method: 'PUT',
      data
    });
  };

  editClassFile = async(id, data) => {
    return this.sendRequest({
      path: `/api/Class/${id}/files/v3/update`,
      method: 'PUT',
      data
    });
  };

  editCourseFile = async(id, data) => {
    return this.sendRequest({
      path: `/api/Course/${id}/files/v3/update`,
      method: 'PUT',
      data
    });
  }

  editTeacherResourceFile = async(id, data) => {
    return this.sendRequest({
      path: `/api/Course/${id}/resource/v3/update`,
      method: 'PUT',
      data
    });
  }

  createCourseFolder = async(id, data) => {
    return this.sendRequest({
      path: `/api/Upload/course/${id}/file/folder`,
      method: 'POST',
      data
    })
  }

  createCLassFolder = async(id, data) => {
    return this.sendRequest({
      path: `/api/Upload/class/${id}/file/folder`,
      method: 'POST',
      data
    })
  }

  createTeacherResourceFolder = async(id, data) => {
    return this.sendRequest({
      path: `/api/Upload/course/${id}/resource/folder`,
      method: 'POST',
      data
    })
  }

  updateFolderName = async (id, type, data) => {
    return this.sendRequest({
      path: `/api/${type}/${id}/folder/v3/update`,
      method: 'PUT',
      data
    })
  }

  deleteFolder = async(id, type, data) => {
    return this.sendRequest({
      path: `/api/${type}/${id}/folder/v3/delete`,
      method: 'PUT',
      data
    })
  }

  ebooksFiles = async(id, data) => {
    return this.sendRequest({
      path: `/api/Course/${id}/files/ebooks/v3`,
      method: 'POST',
      data
    })
  }

}

