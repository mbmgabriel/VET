import Base from './Base';

export default class AcademicTermAPI extends Base {

  studentEbooks = async(id) => {
    return this.sendRequest({
      path: `/api/Student/${id}/ebooks`,
      method: 'GET'
    });
  };

  

}