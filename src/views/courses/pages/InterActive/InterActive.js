import React, { useEffect, useState, useContext } from 'react'
import { Tab, Row, Col, Button, InputGroup, FormControl, Accordion, Tooltip, OverlayTrigger } from 'react-bootstrap';
import ClassesAPI from '../../../../api/ClassesAPI';
import CourseContent from '../../CourseContent'
import {useParams} from 'react-router';
import CoursesAPI from '../../../../api/CoursesAPI';
import InterActiveHeader from './InterActiveHeader';
import CourseBreadcrumbs from '../../components/CourseBreadcrumbs';
import { UserContext } from '../../../../context/UserContext';
import { toast } from 'react-toastify';
import CreateInterActive from './CreateInterActive';
import EditInteractive from './EditInteractive';
import SweetAlert from 'react-bootstrap-sweetalert';

function InterActive() {
  const [module, setModule] = useState([])
  const [moduleId, setModuleId] = useState()
  const [interActiveItems, setInterActiveItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isContributor, setIsContributor] = useState(true);
  const userContext = useContext(UserContext);
  const {user} = userContext.data;
  const subsType = user.subsType;
  const [openCreateInterModal, setOpenCreateInteractive] = useState(false)
  const [interactiveName, setInteractiveName] = useState('')
  const [path, setPath] = useState('')
  const [rate, setRate] = useState(null)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [interActiveId, setInterActiveId] = useState()
  const [sweetError, setSweetError] = useState(false)
  const [sequenceNo, setSequenceNo] = useState('')
  
  const handleOpenEditModel = (interactiveName, path, rate, interActiveId, sequenceNo) => {
    setInteractiveName(interactiveName)
    setPath(path)
    setRate(rate)
    setOpenEditModal(true)
    setSequenceNo(sequenceNo)
    setInterActiveId(interActiveId)
  }

  const {id} = useParams();

  const onSearch = (item) => {
    setSearchTerm(item)
  }

  const handleOpenModelCreateInteractive = (moduleId) => {
    setOpenCreateInteractive(true)
    setModuleId(moduleId)
  }

  const getModule = async(id) => {
    let response = await new ClassesAPI().getModule(id);
    if(response.ok){
      setModule(response.data)
      console.log('QQQQQ:', response.data)
    }else{
      alert('error')
    }
  }

  const getIndteractive = async(id) => {
    let response = await new CoursesAPI().getInterActive(id);
    if(response.ok){
      setInterActiveItems(response.data)
      setModuleId(id)
    }else{
      alert('ERROR')
    } 
  }

  const deleteInterActive = async(interActiveId) => {
    let response = await new CoursesAPI().deleteInterActive(interActiveId)
      if(response.ok){
        getIndteractive(id)
      }else{
        alert('No good')
      }
  }

  useEffect(() => {
    getModule(id)
  }, [])

  const handleRefresh = () => {
    getIndteractive(moduleId)
    getModule(id)
  }

  const cancelSweetError = () => {
    setSweetError(false)
  }

  const confirmSweetError = (id) => {
    deleteInterActive(id)
    setSweetError(false)
    notifyDeletedInteractive()
  }

  const handleSweetAlert = (id) => {
    setSweetError(true)
    setInterActiveId(id)
  }

  const notifyDeletedInteractive = () => 
  toast.success('Successfully Deleted Interactive!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const renderTooltipEdit = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Edit
    </Tooltip>
  )

  const renderTooltipDelete = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete
    </Tooltip>
  )


  return (
    <CourseContent>
      <CourseBreadcrumbs />
      <InterActiveHeader onSearch={onSearch} refresh={() => handleRefresh()} />
    <Accordion defaultActiveKey="0">
      {module?.map((item, index) =>{
        return(
          <>
      <Accordion.Item eventKey={index} onClick={() => getIndteractive(item?.id)} >
        <Accordion.Header>{item.moduleName}
        {isContributor &&
          <>{( user?.teacher?.positionID == 7 ?(<><Button onClick={() => handleOpenModelCreateInteractive(item?.id)} className="btn-create-class" variant="link" ><i className="fa fa-plus"></i> Add Interactive</Button></>):(<></>)) }</>
          // <Button className="btn-create-class" variant="link" ><i className="fa fa-plus"></i> Add Task</Button>
        }
        </Accordion.Header>
        <Accordion.Body>
          {interActiveItems?.filter(item =>{
            if(searchTerm == ''){
              return item
            }else if(item?.interactiveName.toLowerCase().includes(searchTerm.toLocaleLowerCase())){
              return item
            }
          }).map(item => {
            return(
              <>
                {/* <Row >
                  <div className='title-exam' >
                  <Col md={9}>
                      <a target="_blank" className='class-links' href={item?.path}>{item?.interactiveName}</a><br />
                      <span style={{fontSize:'18px'}} > Rate: {item?.rate}</span>
                    </Col>
                 
                  {isContributor &&
                    <>
                      {(user?.teacher?.positionID === 7 ?(<>
                        <Col md={3}>
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 1, hide: 25 }}
                          overlay={renderTooltipEdit}>
                          <Button className="m-r-5 color-white tficolorbg-button" size="sm" ><i className="fa fa-edit"></i></Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 1, hide: 25 }}
                          overlay={renderTooltipDelete}>
                        <Button className="m-r-5 color-white tficolorbg-button" size="sm"><i className="fa fa-trash" ></i></Button>
                      </OverlayTrigger>
                      </Col>
                      </>):(<></>))}
                      
                    </>
                    
                  }
                   </div>
                  <hr></hr>
                </Row> */}

            <Row>
                    <Col className="lesson-header" md={9}>
                    <a target="_blank" className='class-links' href={item?.path}>{item?.interactiveName}</a>
                      {/* <span style={{fontSize:'18px'}} > Rate: {item?.rate}</span> */}
                    </Col>
                    {isContributor && 
                      <>
                      {(user?.teacher?.positionID === 7 ?(<>
                        <Col className="align-right-content" md={3}>
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 1, hide: 25 }}
                          overlay={renderTooltipEdit}>
                          <Button className="m-r-5 color-white tficolorbg-button" onClick={() => handleOpenEditModel(item?.interactiveName, item?.path, item?.rate, item?.id, item?.sequenceNo)} size="sm" ><i className="fa fa-edit"></i></Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 1, hide: 25 }}
                          overlay={renderTooltipDelete}>
                        <Button onClick={() => handleSweetAlert(item.id)} className="m-r-5 color-white tficolorbg-button" size="sm"><i className="fa fa-trash"></i></Button>
                      </OverlayTrigger>
                      </Col>
                      </>):(<></>))}
                      </>
                    }
                     <hr></hr>
                  </Row>
              </>
            )
          })} 
        <SweetAlert
          warning
          showCancel
          show={sweetError}
          confirmBtnText= "Yes"
          confirmBtnBsStyle="danger"
          title="Are you sure?"
          onConfirm={() => confirmSweetError(interActiveId)}
          onCancel={cancelSweetError}
          focusCancelBtn
        >
          You will not be able to recover this InterActive!
        </SweetAlert>     
        </Accordion.Body>
      </Accordion.Item>
          </>
        )
      })}
    </Accordion>
    <CreateInterActive getIndteractive={getIndteractive} moduleId={moduleId} openCreateInterModal={openCreateInterModal} setOpenCreateInteractive={setOpenCreateInteractive} />
    <EditInteractive 
      interactiveName={interactiveName} 
      path={path}
      rate={rate}
      interActiveId={interActiveId}
      openEditModal={openEditModal}
      setInteractiveName={setInteractiveName}
      setPath={setPath}
      setRate={setRate}
      setInterActiveId={setInterActiveId}
      setOpenEditModal={setOpenEditModal}
      getIndteractive={getIndteractive}
      moduleId={moduleId}
      setModuleId={setModuleId}
      sequenceNo={sequenceNo}
      setSequenceNo={setSequenceNo}
    />
    </CourseContent>
  )
}
export default InterActive