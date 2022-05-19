import Base from './Base';

export default class GradingTemplateAPI extends Base {
  getTemplates = async () => {
    return this.sendRequest({
      path: `/api/Grade/template`,
      method: 'GET'
    });
  };

  createTemplate = async (data) => {
    return this.sendRequest({
      path: `/api/Grade/template`,
      method: 'POST',
      data
    });
  }

}
