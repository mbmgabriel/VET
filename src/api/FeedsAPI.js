import Base from './Base';

export default class FeedsAPI extends Base {
  fetchEvents = async(id) => {
    return this.sendRequest({
      path: `/api/Account/${id}/feed`,
      method: 'GET'
    });
  };
}