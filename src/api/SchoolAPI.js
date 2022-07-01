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

  getAllStudents = async() => {
    return this.sendRequest({
      path: `/api/Account?userroleid=4`,
      method: 'GET'
    })
  }
  
  getSchoolAdmin = async() => {
    return this.sendRequest({
      path: `/api/Account?userroleid=2`,
      method: 'GET'
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