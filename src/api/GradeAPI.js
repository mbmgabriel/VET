import Base from './Base';

export default class GradeAPI extends Base {
  getGrade = async () => {
    return this.sendRequest({
      path: `/api/GradeLevel`,
      method: 'GET'
    });
  };

}
