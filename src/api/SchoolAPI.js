import Base from './Base';

export default class SchoolAPI extends Base {

  getSchoolLogo = async () => {
    return this.sendRequest({
      path:`/api/School/logo`,
      method: 'GET'
    })
  }

  updateSchoolLogo = async (data) => {
    return this.sendRequest({
      path:`/api/School/logo`,
      method: 'POST',
      data
    })
  }

  getSchoolTheme = async () => {
    return this.sendRequest({
      path:`/api/School/Theme`,
      method:'GET'
    })
  }

  updateSchoolTheme = async (data) => {
    return this.sendRequest({
      path:`/api/School/Theme`,
      method:'PUT',
      data
    })
  }

  getAllTeacher = async() => {
    return this.sendRequest({
      path: `/api/Account?userroleid=3`,
      method: 'GET'
    })
  }

  getTeachersList = async () => {
    return this.sendRequest({
      path:`/api/Teacher`,
      method: 'GET'
    })
  }

  createSchoolAdmin = async(data) => {
    return this.sendRequest({
      path: `/api/Account/admin/school`,
      method: 'POST',
      data
    })
  }

  updateAccount = async(id, data) => {
    return this.sendRequest({
      path: `/api/Account/${id}`,
      method: 'PUT',
      data
    })
  }

  deleteTeacher = async (id) => {
    return this.sendRequest({
      path: `/api/Teacher/${id}`,
      method: 'DELETE'
    })
  }
  uploadTeacherList = async (data) => {
    return this.sendRequest({
      path: `/api/Teacher/Register/Excel`,
      method: 'POST',
      data
    })
  }

  registerTeacher = async (data) => {
    return this.sendRequest({
      path: `/api/Teacher/Register`,
      method: 'POST',
      data
    })
  }

  updateTeacherInfo = async (id, data)  => {
    return this.sendRequest({
      path: `/api/Teacher/${id}`,
      method: 'PUT',
      data
    })
  }

  getAllStudents = async() => {
    return this.sendRequest({
      path: `/api/Account?userroleid=4`,
      method: 'GET'
    })
  }

  getStudentsList = async () => {
    return this.sendRequest({
      path:`/api/Student`,
      method: 'GET'
    })
  }

  deleteStudent = async (id) => {
    return this.sendRequest({
      path: `/api/Student/${id}`,
      method: 'DELETE'
    })
  }
 
  uploadStudentList = async (data) => {
    return this.sendRequest({
      path: `/api/Student/Register/Excel`,
      method: 'POST',
      data
    })
  }

  registerStudent = async (data) => {
    return this.sendRequest({
      path: `/api/Student/Register`,
      method: 'POST',
      data
    })
  }

  updateStudentInfo = async (id, data)  => {
    return this.sendRequest({
      path: `/api/Student/${id}`,
      method: 'PUT',
      data
    })
  }
  
  getSchoolAdmin = async() => {
    return this.sendRequest({
      path: `/api/Account?userroleid=2`,
      method: 'GET'
    })
  }

  deleteAccount = async (id) => {
    return this.sendRequest({
      path: `/api/Account/${id}`,
      method: 'DELETE'
    })
  }

  resetDefaultPassword = async(id) => {
    return this.sendRequest({
      path: `/api/Account/${id}/password/default`,
      method: 'PUT'
    })
  }

  changePassword = async(id, data) => {
    return this.sendRequest({
      path: `/api/Account/${id}/password`,
      method: 'PUT',
      data
    })
  }
  
  getSchoolList = async() => {
    return this.sendRequest({
      path: `/api/School`,
      method: 'GET'
    })
  }

  getSchoolInfo = async(sc, df, dt) => {
    return this.sendRequest({
      path: `/api/Admin/schoolcode/${sc}/datefrom/${df}/dateto/${dt}`,
      method: 'GET'
    })
  }

  getTeachers = async() => {
    return this.sendRequest({
      path: `/api/Teacher`,
      method: 'GET'    
    })
  }

  

}