import Base from './Base';

export default class GradeTermAPI extends Base {
  getTerms = async () => {
    return this.sendRequest({
      path: `/api/Grade/term`,
      method: 'GET'
    });
  };

  createTerm = async (data) => {
    return this.sendRequest({
      path: `/api/Grade/term`,
      method: 'POST', 
      data
    });
  };

  updateTerm = async (id, data) => {
    return this.sendRequest({
      path: `/api/Grade/term/${id}`,
      method: 'PUT', 
      data
    });
  };

  deleteTerm = async (id) => {
    return this.sendRequest({
      path: `/api/Grade/term/${id}`,
      method: 'DELETE'
    });
  };
}
