import Base from './Base';

export default class ProfileInfoAPI extends Base {

  getStudentInfo = async (id) => {
    return this.sendRequest({
      path:`/api/Student/${id}`,
      method: 'GET'
    })
  }
  getTeacherInfo = async (id) => {
    return this.sendRequest({
      path:`/api/Teacher/${id}`,
      method:'GET'
    })
  }

  updateStudentInfo = async(id, data) => {
    return this.sendRequest({
      path:`/api/Student/${id}`,
      method: 'PUT',
      data
    })
  }

  updateTeacherInfo = async(id, data) => {
    return this.sendRequest({
      path:`/api/Teacher/${id}`,
      method: 'PUT',
      data
    })
  }

  uploadProfile = async (id, data) => {
    return this.sendRequest({
      path:`/api/Upload/user/${id}/profile`,
      method: 'POST',
      data
    })
  }

  getProfileImage = async(id) => {
    return this.sendRequest({
      path: `/api/Account/${id}/Image`,
      method: 'GET',
    })
  }

}