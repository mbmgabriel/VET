import Base from './Base';

export default class AcademicTermAPI extends Base {
  fetchAcademicTerm = async => {
    return this.sendRequest({
      path: `/api/AcademicTerm`,
      method: 'GET'
    });
  };


  addAcademicTerm = async(data) => {
    return this.sendRequest({
      path: `/api/AcademicTerm`,
      method: 'POST',
      data
    });
  };

  deleteAcademicTerm = async(id) => {
    return this.sendRequest({
      path: `/api/AcademicTerm/${id}`,
      method: 'DELETE',
    })
  }

  updateAcademicTerm = async(id, data) => {
    return this.sendRequest({
      path: `/api/AcademicTerm/${id}`,
      method: 'PUT',
      data
    })
  }

  setCurrentAcademicTerm = async(id) => {
    return this.sendRequest({
      path: `/api/AcademicTerm/${id}/setcurrent`,
      method: 'PUT'
    })
  }

}