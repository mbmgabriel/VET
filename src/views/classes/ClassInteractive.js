import React, { useState, useEffect, useContext } from 'react'
import ClassInteractiveHeader from './components/Interactive/ClassInteractiveHeader'
import { Row, Col, Accordion, Button, OverlayTrigger, Tooltip} from 'react-bootstrap'
import ClassesAPI from '../../api/ClassesAPI'
import DiscussionAPI from '../../api/DiscussionAPI';
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import moment from 'moment'
import AssignInteractive from './components/Interactive/AssignInteractive'
import EditAssignInteractive from './components/Interactive/EditAssignInteractive'
import { UserContext } from '../../context/UserContext'
import StudentInteractive from './student/StudentInteractive';
import ClassSideNavigation from './components/ClassSideNavigation';
import ClassBreadcrumbs from './components/ClassBreedCrumbs';
import axios from 'axios';

function ClassInteractive() {
  const [module, setModule] = useState([])
  const [moduleId, setModuleId] = useState(null)
  const [interactive, setInteractive] = useState([])
  const [assignInteractiveModal, setAssignInteractiveModal] = useState(false)
  const [editAssignInteractiveModal, setEditAssignInteractiveModal] = useState(false)
  const [editAssignInteractiveItem, setEditAssignInteractiveItem] = useState()
  const [interactiveId, setInteractiveId] = useState()
  const {id} = useParams();
  const dateCompareNow = moment().format("YYYY-MM-DD")
  const timeNow = moment().format('HH:mm');
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [searchTerm, setSearchTerm] = useState('')
  const [classInfo, setClassInfo] = useState({});
  const [accountInfo, setAccountInfo] = useState('')
  const [schoolCode, setSchoolCode] = useState('')
  const [resultToken, setResultToken] = useState('')
  const subsType = localStorage.getItem('subsType');
  const onSearch = (item) => {
    setSearchTerm(item)
  }
  
  
  
  const getClassInfo = async() => {
    // setLoading(true)
    let response = await new DiscussionAPI().getClassInfo(id)
    if(response.ok){
      getModule(response.data.classInformation?.courseId)
      setClassInfo(response.data)
      console.log(response.data)
    }else{
      alert("Something went wrong while fetching all courses")
    }
    // setLoading(false)
  }
  
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
  
  const editAssignIteractiveToggle = (e, item) => {
    setEditAssignInteractiveItem(item)
    setEditAssignInteractiveModal(!editAssignInteractiveModal)
  }
  
  const assignInteractiveToggle = (e, item) => {
    setInteractiveId(item)
    setAssignInteractiveModal(!assignInteractiveModal)
  }
  
  const getModule = async(courseID) => {
    let response = await new ClassesAPI().getModule(courseID);
    if(response.ok){
      setModule(response.data)
    }else{
      alert('error')
    }
  }
  
  console.log('interactive:', interactive)
  
  
  
  const getIndteractive = async (e, item) =>{
    let response = await new ClassesAPI().getInteractive(id, item)
    if(response.ok){
      setInteractive(response.data)
      setModuleId(item)
    }else{
      alert('Error')
    }
  }
  
  useEffect(() => {
    if(moduleId !== null){
      return(
        getIndteractive()
        )
      } 
    if(subsType != 'LMS'){
      window.location.href = "/classes"
    }
  }, [])

  useEffect(() => {
    getClassInfo()
    getAccountInfo()
    getSchoolCode()
  }, [])

  const renderTooltipReasign = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Reassign
    </Tooltip>
  )

  const renderTooltipAssign = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Assign
    </Tooltip>
  )

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
            username: usernameS,
            first_name: "Haru",
            last_name: "Gab",
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

  return (
    <ClassSideNavigation>
      <ClassBreadcrumbs title='' clicked={() => console.log('')} />
      <ClassInteractiveHeader onSearch={onSearch} />
      <Accordion>
        {module.map((item, index) => {
          return ( <Accordion.Item eventKey={index} onClick={(e) => getIndteractive(e, item?.id)} >
          <Accordion.Header>
            <div className='unit-exam' style={{fontSize:'20px'}} >{item.moduleName}
            </div>
          </Accordion.Header>
          <Accordion.Body>
            {(user?.teacher === null)?(
            <>
              <StudentInteractive searchTerm={searchTerm}  interactive={interactive} classInfo={classInfo}  />
            </>
            ):(
            <>
            {interactive?.filter((interItem) => {
              if(searchTerm == ''){
                return interItem
              }else if (interItem?.interactive?.interactiveName.toLowerCase().includes(searchTerm.toLocaleLowerCase())){
                return interItem
              }
            }).map(interItem =>{
              return(
               <Row style={{margin:'10px'}}>
                <Col sm={8}>
                  <div className='title-exam'>
                    {/* <Link style={{color:'#EE9337', textDecoration:'none'}} to={interItem?.interactive?.path} >{interItem?.interactive?.interactiveName}</Link> */}
                    {
                      classInfo?.classInformation?.courseName === "God's Park" || classInfo?.classInformation?.courseName === "God's Park 1" || classInfo?.classInformation?.courseName === "God's Park 2" ||
                      classInfo?.classInformation?.courseName === "God's Park 3" || classInfo?.classInformation?.courseName === "God's Park 4" ||
                      classInfo?.classInformation?.courseName === "God's Park 5" || classInfo?.classInformation?.courseName === "God's Park 6" ?
                      <button onClick={(e) => {
                        goLinkGodsPark(interItem?.interactive?.path)
                        }} className="btn btn-xs btn-green" >
                            {interItem?.interactive?.interactiveName} Start
                            {schoolCode.id}
                      </button>
                      :
                      <a target="_blank" className='class-links' href={interItem?.interactive?.path}>{interItem?.interactive?.interactiveName}</a>
                    }
                  </div>
                </Col>
                {/* <Col sm={9} className='instruction-exam' >
                  <div className='inline-flex'>
                    <div className='text-color-bcbcbc' >
                      Instruction:&nbsp;
                    </div>
                    <div className='text-color-707070' >
                      Count the object. Type the number in the box
                    </div>
                  </div>
                </Col> */}
                  <Col sm={3} className='icon-exam'>
                    {/* <Button className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-eye" ></i>{' '}</Button> */}
                    {interItem?.classInteractiveAssignment?(
                    <>
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 1, hide: 0 }}
                          overlay={renderTooltipReasign}>
                           <Button onClick={(e) => editAssignIteractiveToggle(e, interItem)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-clock"></i></Button>
                       </OverlayTrigger> 
                    </>
                    ):
                    <>
                    <OverlayTrigger
                      placement="bottom"
                      delay={{ show: 1, hide: 0 }}
                      overlay={renderTooltipAssign}>
                        <Button onClick={(e) => assignInteractiveToggle(e, interItem?.interactive?.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i class="fas fa-user-clock"></i></Button>
                    </OverlayTrigger>
                    </>}
                    
                  </Col>
                  {interItem?.classInteractiveAssignment?(
                    <>
                      {
                        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(interItem?.classInteractiveAssignment?.startDate + ' ' + interItem?.classInteractiveAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&  
                          <div style={{color:'#EE9337', fontSize:'15px'}}><b>Upcoming</b></div>
                      }
                      {
                        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(interItem?.classInteractiveAssignment?.endDate + ' ' + interItem?.classInteractiveAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                          <div style={{color:'#EE9337', fontSize:'15px'}}><b>Ended</b></div>
                      }
                      {
                        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isSame(moment(interItem?.classInteractiveAssignment?.startDate + ' ' + interItem?.classInteractiveAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                          <div style={{color:'#EE9337', fontSize:'15px'}}><b>Ongoing</b></div>
                      }
                      {
                        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isAfter(moment(interItem?.classInteractiveAssignment?.startDate + ' ' + interItem?.classInteractiveAssignment?.startTime, 'YYYY-MM-DD HH:mm')) &&
                        moment(dateCompareNow + ' ' + timeNow, 'YYYY-MM-DD HH:mm').isBefore(moment(interItem?.classInteractiveAssignment?.endDate + ' ' + interItem?.classInteractiveAssignment?.endTime, 'YYYY-MM-DD HH:mm')) &&
                          <div style={{color:'#EE9337', fontSize:'15px'}}><b>Ongoing</b></div>
                      } 
                      <Col sm={7} className='due-date-discusstion' >
                      <div className='inline-flex'>
                        <div className='text-color-bcbcbc'>
                          Start Date:&nbsp;
                        </div>
                        <div className='text-color-707070'>
                          {moment(interItem?.classInteractiveAssignment?.startDate).format('LL')}&nbsp;
                        </div>
                        <div className='text-color-bcbcbc'>
                          Start Time:&nbsp;
                        </div>
                        <div className='text-color-707070'>
                          {interItem?.classInteractiveAssignment?.startTime}
                        </div>
                      </div>
                    </Col>
                    <Col className='posted-date-discusstion'>
                      <div className='inline-flex'>
                        <div className='text-color-bcbcbc'>
                          End Date:&nbsp;
                        </div>
                        <div className='text-color-707070'>
                        {moment(interItem?.classInteractiveAssignment?.endDate).format('LL')}&nbsp;
                        </div>
                        <div className='text-color-bcbcbc'>
                          End Time:&nbsp;
                        </div>
                        <div className='text-color-707070'>
                          {interItem?.classInteractiveAssignment?.endTime}
                          
                        </div>
                      </div>
                    </Col>
                    <div className='text-color-bcbcbc' >
                    <hr></hr>
                    </div>
                    </>
                  ):
                  <>
                    <div style={{color:'red'}}>
                      <b>Not Assigned</b>
                    </div>
                    <div className='text-color-bcbcbc' >
                    <hr></hr>
                    </div>
                  </>
                  }
              </Row>
              )})}
            </>
            )}

          </Accordion.Body>
          </Accordion.Item>)
        })}
      </Accordion>
      <AssignInteractive moduleId={moduleId} getIndteractive={getIndteractive} interactiveId={interactiveId} assignInteractiveToggle={assignInteractiveToggle} assignInteractiveModal={assignInteractiveModal} />
      <EditAssignInteractive getIndteractive={getIndteractive} editAssignInteractiveItem={editAssignInteractiveItem} editAssignIteractiveToggle={editAssignIteractiveToggle} editAssignInteractiveModal={editAssignInteractiveModal} />
    </ClassSideNavigation>
  )
}

export default ClassInteractive

