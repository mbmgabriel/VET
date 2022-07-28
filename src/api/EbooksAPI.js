import Base from './Base';

export default class EbooksAPI extends Base {

  studentEbooks = async(id) => {
    return this.sendRequest({
      path: `/api/Account/${id}/ebooks`,
      method: 'GET'
    });
  };
 
  uploadLinks = async(id, type, data) => {
    return this.sendRequest({
      path: `/api/Course/${id}/ebooklink/${type}/upload`,
      method: 'POST',
      data
    });
  };

  getEbooksPerCourse = async(id) => {
    return this.sendRequest({
      path: `/api/Course/${id}/ebooklink`,
      method: 'GET'
    })
  }

}