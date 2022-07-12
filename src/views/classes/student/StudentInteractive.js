import React, { useContext, useState, useEffect } from 'react'
import {Row, Col, Button, Tooltip, OverlayTrigger} from 'react-bootstrap'
import moment from 'moment'
import { UserContext } from '../../../context/UserContext'
import {useParams} from 'react-router';
import axios from 'axios';
import ClassesAPI from '../../../api/ClassesAPI';

function StudentInteractive({interactive, searchTerm, classInfo}) {
  const dateCompareNow = moment().format("YYYY-MM-DD")
  const timeNow = moment().format('HH:mm');
  // const dateTimeNow = dateCompareNow + ' ' + '00:00:00';
  const [accountInfo, setAccountInfo] = useState([])
  const [schoolCode, setSchoolCode] = useState([])
  const [resultToken, setResultToken] = useState([])
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const {id} = useParams();

  const getInteractiveLink = (e, path, userId, gameId, classId) => {
    let InterActiveShoolCode = schoolCode.code
    e.preventDefault()
    window.open(path + '?sid=' + userId + '&gid=' + gameId + '&cid=' + classId + '#' + InterActiveShoolCode) 
  }

  const renderTooltipPlay = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Play
    </Tooltip>
  )

  const getAccountInfo = async() => {
    // setLoading(true)
    let response = await new ClassesAPI().getAccountInfo(user.userId)
    if(response.ok){
      setAccountInfo(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
    // setLoading(false)
  }
  
  const getSchoolCode = async() => {
    // setLoading(true)
    let response = await new ClassesAPI().getSchoolCode()
    if(response.ok){
      setSchoolCode(response.data)
      console.log("Haru", response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
    // setLoading(false)
  }

  const gParkStartGame = (tokenData1, path) => {

    let studentid = user.userId;
    let fname = user?.student?.fname;
    let lname = user?.student?.lname;
    let usernameS = accountInfo.username;
    let passwordS = accountInfo.password


    if(classInfo?.classInformation?.gradeLevelId === 1){
        const updateClassData = {
            reference_id: studentid,
            school_code:schoolCode.id,
            class_id: 417
        };


        axios.post('https://api.godspark.world/v1/student/update-class',updateClassData,{
            headers: {
                'Content-Type':'application/json',
                'X-Authorization': 'vap2ndiRKVQpvyU2ZjCapJrWCNwG1kumJHVabijLrh5B4pM4taTvIigZJYZ61WlJ',
                'token': tokenData1,
            },
            responseType: 'json'
        })
        //get data
        .then(response => {
            window.open(path+'?e='+tokenData1);
        },(error) => {
        
        })
    }else if(classInfo?.classInformation?.gradeLevelId === 2){
        const updateClassData = {
            reference_id: studentid,
            school_code:schoolCode.id,
            class_id: 418
        };


        axios.post('https://api.godspark.world/v1/student/update-class',updateClassData,{
            headers: {
                'Content-Type':'application/json',
                'X-Authorization': 'vap2ndiRKVQpvyU2ZjCapJrWCNwG1kumJHVabijLrh5B4pM4taTvIigZJYZ61WlJ',
                'token': tokenData1,
            },
            responseType: 'json'
        })
        //get data
        .then(response => {
            window.open(path+'?e='+tokenData1);
        },(error) => {
        
        })
    }else if(classInfo?.classInformation?.gradeLevelId === 3){
        const updateClassData = {
            reference_id: studentid,
            school_code:schoolCode.id,
            class_id: 419
        };


        axios.post('https://api.godspark.world/v1/student/update-class',updateClassData,{
            headers: {
                'Content-Type':'application/json',
                'X-Authorization': 'vap2ndiRKVQpvyU2ZjCapJrWCNwG1kumJHVabijLrh5B4pM4taTvIigZJYZ61WlJ',
                'token': tokenData1,
            },
            responseType: 'json'
        })
        //get data
        .then(response => {
            window.open(path+'?e='+tokenData1);
        },(error) => {
        
        })
    }else if(classInfo?.classInformation?.gradeLevelId === 4){
        const updateClassData = {
            reference_id: studentid,
            school_code:schoolCode.id,
            class_id: 425
        };


        axios.post('https://api.godspark.world/v1/student/update-class',updateClassData,{
            headers: {
                'Content-Type':'application/json',
                'X-Authorization': 'vap2ndiRKVQpvyU2ZjCapJrWCNwG1kumJHVabijLrh5B4pM4taTvIigZJYZ61WlJ',
                'token': tokenData1,
            },
            responseType: 'json'
        })
        //get data
        .then(response => {
            window.open(path+'?e='+tokenData1);
        },(error) => {
        
        })
    }else if(classInfo?.classInformation?.gradeLevelId === 5){
        const updateClassData = {
            reference_id: studentid,
            school_code:schoolCode.id,
            class_id: 426
        };


        axios.post('https://api.godspark.world/v1/student/update-class',updateClassData,{
            headers: {
                'Content-Type':'application/json',
                'X-Authorization': 'vap2ndiRKVQpvyU2ZjCapJrWCNwG1kumJHVabijLrh5B4pM4taTvIigZJYZ61WlJ',
                'token': tokenData1,
            },
            responseType: 'json'
        })
        //get data
        .then(response => {
            window.open(path+'?e='+tokenData1);
        },(error) => {
        
        })
    }else if(classInfo?.classInformation?.gradeLevelId === 6){
        const updateClassData = {
            reference_id: studentid,
            school_code:schoolCode.id,
            class_id: 427
        };


        axios.post('https://api.godspark.world/v1/student/update-class',updateClassData,{
            headers: {
                'Content-Type':'application/json',
                'X-Authorization': 'vap2ndiRKVQpvyU2ZjCapJrWCNwG1kumJHVabijLrh5B4pM4taTvIigZJYZ61WlJ',
                'token': tokenData1,
            },
            responseType: 'json'
        })
        //get data
        .then(response => {
            window.open(path+'?e='+tokenData1);
        },(error) => {
        
        })
    }
  }


  const goLinkGodsPark = (path) => {
    gParkInitialize1(path);
  }

  const gpGenerateTokenGame = (path) => {

    let studentid = user.userId;
    let fname = user?.student?.fname;
    let lname = user?.student?.lname;
    let usernameS = accountInfo.username;
    let passwordS = accountInfo.password;

    const tokenData = {
        reference_id:studentid,
        school_code:schoolCode.id,
    };
    axios.post('https://api.godspark.world/v1/student/generate-token',tokenData,{
        headers: {
            'Content-Type':'application/json',
            'X-Authorization': 'vap2ndiRKVQpvyU2ZjCapJrWCNwG1kumJHVabijLrh5B4pM4taTvIigZJYZ61WlJ',
        },
        responseType: 'json'
    })
    //get data
    .then(response => {
    setResultToken(response.data.Token)
    gParkStartGame(response.data.Token, path)
    },(error) => {
       
    })
  }

  const gParkInitialize1 = (path) => {

    // let studentid = parseInt(sessionStorage.getItem('studentid'));
    
    // let classid = sessionStorage.getItem('classid');
    // let fname = sessionStorage.getItem('fname');
    // let lname = sessionStorage.getItem('lname');
    // let usernameS = accountData.username;
    // let passwordS = accountData.password

    let studentid = user.userId;
    let fname = user?.student?.fname;
    let lname = user?.student?.lname;
    let usernameS = accountInfo.username;
    let passwordS = accountInfo.password;

    if(classInfo?.classInformation?.gradeLevelId === 1){
        const registerData = {
            class_id: 417,
            reference_id: studentid,
            school_code: schoolCode.id,
            username: "student2233",
            first_name: "A",
            last_name: "Mike",
            password: passwordS,
        };
        axios.post('https://api.godspark.world/v1/student/create',registerData,{
            headers: {
                'Content-Type':'application/json',
                'X-Authorization': 'vap2ndiRKVQpvyU2ZjCapJrWCNwG1kumJHVabijLrh5B4pM4taTvIigZJYZ61WlJ',
            },
            responseType: 'json'
        })
        //get data
        .then(response => {
            gpGenerateTokenGame(path)
        },(error) => {
        
        });
    }else if(classInfo?.classInformation?.gradeLevelId === 2){
        const registerData = {
            class_id: 418,
            reference_id: studentid,
            school_code: schoolCode.id,
            username: usernameS,
            first_name: fname,
            last_name: lname,
            password: passwordS,
        };
        axios.post('https://api.godspark.world/v1/student/create',registerData,{
            headers: {
                'Content-Type':'application/json',
                'X-Authorization': 'vap2ndiRKVQpvyU2ZjCapJrWCNwG1kumJHVabijLrh5B4pM4taTvIigZJYZ61WlJ',
            },
            responseType: 'json'
        })
        //get data
        .then(response => {
            gpGenerateTokenGame(path)
        },(error) => {
        
        });
    }else if(classInfo?.classInformation?.gradeLevelId === 3){
        const registerData = {
            class_id: 419,
            reference_id: studentid,
            school_code: schoolCode.id,
            username: usernameS,
            first_name: fname,
            last_name: lname,
            password: passwordS,
        };
        axios.post('https://api.godspark.world/v1/student/create',registerData,{
            headers: {
                'Content-Type':'application/json',
                'X-Authorization': 'vap2ndiRKVQpvyU2ZjCapJrWCNwG1kumJHVabijLrh5B4pM4taTvIigZJYZ61WlJ',
            },
            responseType: 'json'
        })
        //get data
        .then(response => {
            gpGenerateTokenGame(path)
        },(error) => {
        
        });
    }else if(classInfo?.classInformation?.gradeLevelId === 4){
        const registerData = {
            class_id: 425,
            reference_id: studentid,
            school_code: schoolCode.id,
            username: usernameS,
            first_name: fname,
            last_name: lname,
            password: passwordS,
        };
        axios.post('https://api.godspark.world/v1/student/create',registerData,{
            headers: {
                'Content-Type':'application/json',
                'X-Authorization': 'vap2ndiRKVQpvyU2ZjCapJrWCNwG1kumJHVabijLrh5B4pM4taTvIigZJYZ61WlJ',
            },
            responseType: 'json'
        })
        //get data
        .then(response => {
            gpGenerateTokenGame(path)
        },(error) => {
        
        });
    }else if(classInfo?.classInformation?.gradeLevelId === 5){
        const registerData = {
            class_id: 426,
            reference_id: studentid,
            school_code: schoolCode.id,
            username: usernameS,
            first_name: fname,
            last_name: lname,
            password: passwordS,
        };
        axios.post('https://api.godspark.world/v1/student/create',registerData,{
            headers: {
                'Content-Type':'application/json',
                'X-Authorization': 'vap2ndiRKVQpvyU2ZjCapJrWCNwG1kumJHVabijLrh5B4pM4taTvIigZJYZ61WlJ',
            },
            responseType: 'json'
        })
        //get data
        .then(response => {
            gpGenerateTokenGame(path)
        },(error) => {
        
        });
    }else if(classInfo?.classInformation?.gradeLevelId === 6){
        const registerData = {
            class_id: 427,
            reference_id: studentid,
            school_code: schoolCode.id,
            username: usernameS,
            first_name: fname,
            last_name: lname,
            password: passwordS,
        };
        axios.post('https://api.godspark.world/v1/student/create',registerData,{
            headers: {
                'Content-Type':'application/json',
                'X-Authorization': 'vap2ndiRKVQpvyU2ZjCapJrWCNwG1kumJHVabijLrh5B4pM4taTvIigZJYZ61WlJ',
            },
            responseType: 'json'
        })
        //get data
        .then(response => {
            gpGenerateTokenGame(path)
        },(error) => {
        
        });
    }

}

useEffect(() => {
  // getClassInfo()
  getAccountInfo()
  getSchoolCode()
}, [])

const renderTooltipPlay1 = (props) => (
  <Tooltip id="button-tooltip" {...props}>
    1
  </Tooltip>
)

  return (
    <div>
      {interactive?.filter((item) => {
        if(searchTerm == ''){
          return item
        }else if(item?.interactive?.interactiveName.toLowerCase().includes(searchTerm.toLowerCase())){
          return item
        }
      }).map(item => {
        return(
          <>
            {(item?.isScheduled === true)?(
            <>
               <Row>
               <Col sm={8}>
                      <div className='title-exam' >
                        {item?.interactive?.interactiveName}
                      </div>
                    </Col>
                      {(item.isLoggedUserDone === true)?(
                    <>
                    <Col sm={3} className='icon-exam'>
                        {
                          classInfo?.classInformation?.courseName === "God's Park" || classInfo?.classInformation?.courseName === "God's Park 1" || classInfo?.classInformation?.courseName === "God's Park 2" ||
                          classInfo?.classInformation?.courseName === "God's Park 3" || classInfo?.classInformation?.courseName === "God's Park 4" ||
                          classInfo?.classInformation?.courseName === "God's Park 5" || classInfo?.classInformation?.courseName === "God's Park 6" ?
                          <Button onClick={(e) => goLinkGodsPark(item?.interactive?.path)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-play" ></i></Button>
                          :
                          <Button onClick={(e) => getInteractiveLink(e, item?.interactive?.path, user?.student?.id, item?.interactive?.id, id)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-play" ></i></Button>
                        }
                    </Col>
                    </>
                  ):
                  <>
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.classInteractiveAssignment?.startDate + ' ' + item?.classInteractiveAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(item?.classInteractiveAssignment?.endDate + ' ' + item?.classInteractiveAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <Col sm={3} className='icon-exam'>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 10, hide: 25 }}
                        overlay={renderTooltipPlay}> 
                          {
                          item.module.courseId === 50005 ?
                          <button onClick={(e) => {
                            goLinkGodsPark(item?.interactive?.path)
                            }} className="btn btn-xs btn-green" >
                                {item?.interactive?.interactiveName} Start
                                {schoolCode.id}
                          </button>
                          :
                          <Button onClick={(e) => getInteractiveLink(e, item?.interactive?.path, user?.student?.id, item?.interactive?.id, id)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-play" ></i></Button>
                        }
                      </OverlayTrigger>
                      </Col>
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.classInteractiveAssignment?.endDate + ' ' + item?.classInteractiveAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <Col sm={3} className='icon-exam'>
                                              <OverlayTrigger
                        placement="right"
                        delay={{ show: 10, hide: 25 }}
                        overlay={renderTooltipPlay}> 
                          {
                          // item.module.courseId === 50005 ?
                          // <button onClick={(e) => {
                          //   goLinkGodsPark(item?.interactive?.path)
                          //   }} className="btn btn-xs btn-green" >
                          //       {item?.interactive?.interactiveName} Start
                          //       {schoolCode.id}
                          // </button>
                          classInfo?.classInformation?.courseName === "God's Park" || classInfo?.classInformation?.courseName === "God's Park 1" || classInfo?.classInformation?.courseName === "God's Park 2" ||
                          classInfo?.classInformation?.courseName === "God's Park 3" || classInfo?.classInformation?.courseName === "God's Park 4" ||
                          classInfo?.classInformation?.courseName === "God's Park 5" || classInfo?.classInformation?.courseName === "God's Park 6" ?
                          <Button onClick={(e) => goLinkGodsPark(item?.interactive?.path)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-play" ></i></Button>
                          :
                          <Button onClick={(e) => getInteractiveLink(e, item?.interactive?.path, user?.student?.id, item?.interactive?.id, id)}  className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-play" ></i></Button>
                        }
                      </OverlayTrigger>
                      </Col>
                    }
                    </>
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.classInteractiveAssignment?.startDate + ' ' + item?.classInteractiveAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(item?.classInteractiveAssignment?.endDate + ' ' + item?.classInteractiveAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <div style={{color:'#EE9337', fontSize:'15px'}}><b>Ongoing</b></div>
                    }
                    {
                      moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(item?.classInteractiveAssignment?.endDate + ' ' + item?.classInteractiveAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                      <div style={{color:'#EE9337', fontSize:'15px'}}><b>Ended</b>&nbsp;</div>  
                    }
                    <Col sm={6} className='due-date-discusstion' >
                        <div className='inline-flex'>
                          <div className='text-color-bcbcbc'>
                            Start Date:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                           {moment(item?.classInteractiveAssignment?.startDate).format('LL')}&nbsp;
                          </div>
                          <div className='text-color-bcbcbc'>
                            Start Time:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                            {item?.classInteractiveAssignment?.startTime}
                          </div>
                      </div>
                      </Col>
                      <Col className='posted-date-discusstion'>
                        <div className='inline-flex'>
                          <div className='text-color-bcbcbc'>
                            End Date:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                            {moment(item?.classInteractiveAssignment?.endDate).format('LL')}&nbsp;
                          </div>
                          <div className='text-color-bcbcbc'>
                            End Time:&nbsp;
                          </div>
                          <div className='text-color-707070'>
                            {item?.classInteractiveAssignment?.endTime}
                          </div>
                        </div>
                      </Col>
                </Row>
                <hr />
            </>
            ):(
            <>
            </>
            )}
          </>
        )
      })}
    </div>
  )
}

export default StudentInteractive