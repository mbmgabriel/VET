import Base from './Base';

export default class AnnouncementAPI extends Base {
  getAllAnnouncement = async => {
    return this.sendRequest({
      path: `/api/Announcement`,
      method: 'GET'
    });
  };
}