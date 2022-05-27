import Base from './Base';

export default class AnnouncementAPI extends Base {
  getAllAnnouncement = async => {
    return this.sendRequest({
      path: `/api/Announcement/user`,
      method: 'GET'
    });
  };

  getMyAnnouncement = async => {
    return this.sendRequest({
      path: `/api/Announcement`,
      method: 'GET'
    });
  };

  createAnnouncementForClasses = async (typeId, data) =>{
    return this.sendRequest({
      path: `/api/Announcement/type/${typeId}`,
      method: 'POST',
      data
    })
  }
  
  deleteAnnouncement = async (id) =>{
    return this.sendRequest({
      path: `/api/Announcement/${id}`,
      method: 'DELETE'
    })
  }

  updateAnnouncement = async (id, data) => {
    return this.sendRequest({
      path: `/api/Announcement/${id}`,
      method: 'PUT',
      data
    })
  }

}