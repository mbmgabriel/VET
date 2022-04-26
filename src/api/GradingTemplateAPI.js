import Base from './Base';

export default class GradingTermplateAPI extends Base {
  getTemplates = async () => {
    return this.sendRequest({
      path: `/api/Grade/template`,
      method: 'GET'
    });
  };

}
