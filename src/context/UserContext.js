import React, {Component} from 'react';
import Auth from '../api/Auth';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { SIGNALR_URL } from '../contants/url';
import Logger from '../utils/logger';
import { onExamRoute } from '../utils/windowLocationHelper';
import SchoolAPI from '../api/SchoolAPI';

export const UserContext = React.createContext();
export class UserContextProvider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: false,
      loading: true,
      connectionStatus: 'disconnected',
      takingExam: false,
      examUrl: null,
      themeColor: '#EE9337',
      themeLogo: null,
      selectedClassId: null
    };
    this.connection = React.createRef();
  }

  setSelectedClassId = (id) => {
    this.setState({selectedClassId: id})
  }

  refreshUser = async () => {
    await this.setState({loading: true})

    let response = await new Auth().profile()
    if(response.ok) {
      let user = response.data
      user.role = user.role.roleName
      switch (user.role) {
        case "Student":
          user.name = `${user.student?.fname} ${user.student?.lname}`
          user.isStudent = true
          break;
        case "Teacher":
          user.name = `${user.teacher?.fname} ${user.teacher?.lname}`
          user.isTeacher = true
          break;
        case "School Admin":
          user.name = `School Admin`
          user.isSchoolAdmin = true
          break;
        default:
          user.name = 'No name'
          break;
      }
      let themeResponse = await new Auth().theme()
      console.log({themeResponse})
      if(themeResponse.ok) {
        this.setThemeColor(themeResponse.data)
      }
      let themeLogoResponse = await new SchoolAPI().getSchoolLogo()
      if(themeLogoResponse.ok) {
        this.setThemeLogo(themeLogoResponse.data)
      }
      await this.setState({loading: false, user })
    } else {
      await this.setState({loading: false, user: null})
    }    
  };

  setThemeLogo = async (themeLogo) => {
    this.setState({themeLogo})
  }

  setThemeColor = (themeColor) => {
    document.body.style.setProperty('--primary-color', themeColor)
    this.setState({themeColor})
  }

  setLoading = (loading) => {
    this.setState({loading});
  };

  connect = async () => {
    try{
      if(this.connection.current != null){
        Logger.info("Connection already exists")
        return
      }
      this.connection.current = new HubConnectionBuilder()
      await this.setState({connectionStatus: 'connecting'})
      var token = await window.localStorage.getItem("token")
      Logger.info({token, SIGNALR_URL})
      this.connection.current = await new HubConnectionBuilder()
                        .withUrl(SIGNALR_URL, {
                          accessTokenFactory: () => token
                        })
                        .build();

      this.connection.current.on("OnthemeLogoutMessage", (user, message) => {
        Logger.info('themeLogout message received:', message);
      });

      this.connection.current.on("OnExamMessage", (user, message) => {
        Logger.info('Exam message received:', message);
        this.setState({
          takingExam: message?.isExamEnded ? false : true,
          examUrl: message?.url
        })
        if(message?.url){
          Logger.info("Has url", message?.url)
          if(message?.url != window.location.pathname){
            Logger.info("URL is different from current URL")
            window.location.pathname = message.url
          }
          Logger.info("url is same as current URL. No need to redirect")
        }else{
          Logger.info("No url")
          console.log({message})
          if(message?.isExamEnded){
            Logger.info("Exam has ended")
          }else{
            if(onExamRoute()){
              Logger.info("On exam route")
              window.location.pathname = "/"
            }
          }
        }
      });

      this.connection.current.onreconnecting(() => {
        Logger.info('reconnecting');
        this.setState({connectionStatus: 'reconnecting'});
      })

      this.connection.current.onreconnected(() => {
        Logger.info('reconnected');
        this.setState({connectionStatus: 'connected'});
      })

      await this.connection.current.start().then(() => {
        Logger.info("connected")
        this.setState({connectionStatus: 'connected'});
      });
      
    } catch (e){
      Logger.info(e);
    }
  }

  endExam = async () => {
    await this.connection.current.invoke("OnEndExam")
  }

  takeExam = async (url) => {
    await this.connection.current.invoke("OnExamTaking", url);
  }

  render() {
    const {children} = this.props;
    const {
      user,
      loading,
      connection,
      themeColor,
      connectionStatus,
      takingExam,
      themeLogo,
      selectedClassId
    } = this.state;
    return (
      <UserContext.Provider
        value={{
          data: {
            user,
            loading,
            connection,
            connectionStatus,
            takingExam,
            themeColor,
            themeLogo,
            selectedClassId,
            setSelectedClassId: this.setSelectedClassId,
            takeExam: this.takeExam,
            endExam: this.endExam,
            refreshUser: this.refreshUser,
            connect: this.connect,
            setThemeColor: this.setThemeColor,
            setThemeLogo: this.setThemeLogo,
          },
        }}>
        {children}
      </UserContext.Provider>
    );
  }
}

export default UserContextProvider;
