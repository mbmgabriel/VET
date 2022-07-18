import Base from './Base';

export default class AcademicTermAPI extends Base {

  fetchMirandaAccounts = async => {
    return this.sendRequest({
      path: `/api/Miranda`,
      method: 'GET'
    });
  };

  updateMirandaAccounts = async(id, data) => {
    return this.sendRequest({
      path: `/api/Miranda/${id}`,
      method: 'PUT',
      data
    });
  }

  uploadAccounts = async(data) => {
    return this.sendRequest({
      path: `/api/Miranda/excel`,
      method: 'POST',
      data
    });
  }

}