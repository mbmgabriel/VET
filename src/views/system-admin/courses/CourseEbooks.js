import React, { useEffect, useState, useContext } from 'react'
import { Col, Row, Modal, Form, Button, InputGroup, FormControl} from 'react-bootstrap'
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'
import SchoolAPI from '../../../api/SchoolAPI';
import EbooksAPI from '../../../api/EbooksAPI';
import CoursesAPI from '../../../api/CoursesAPI';
import SubjectAreaAPI from '../../../api/SubjectAreaAPI';
import SweetAlert from 'react-bootstrap-sweetalert';
import { toast } from "react-toastify";
import moment from "moment"
import MainContainer from '../../../components/layouts/MainContainer';
import { UserContext } from '../../../context/UserContext';

export default function SystemAdminCourses() {
  const userContext = useContext(UserContext)
  const {user} = userContext.data;
  const subsType = user.subsType;
  const [teachers, setTeachers ] = useState([]);
  const [ deleteNotify, setDeleteNotify ] = useState(false);
  const [toDeleteId, setToDeleteId] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [courseName, setCourseName] = useState('')
	const [description, setDescription] = useState('')
	const [subjectAreaId, setSubjectArea] = useState('')
	const [sarea, setSarea] = useState([])
  const [selectedCourse, setSelectedCourse] = useState({});
  const [contributorModal, setContributorModal] = useState(false);
  const [teachersList, setTeachersList] = useState([]);
  const [contributorsList, setContributorsList] = useState([]);
  const [courseID, setCourseID] = useState('');
  const [courseInfo, setCourseInfo] = useState({});
  const [authorId, setAuthorId] = useState('');
  const [uploadModal, setUploadModal] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState({});
  const [userType, setUserType] = useState('')
  const [showList, setShowList] = useState(false);
  const [ebookLinks, setEbookLinks] =useState([]);
  const [ebookLinkId, setEbookLinkId] = useState('');
  const [showEditLinkModal, setShowEditLinkModal] = useState(false);
  const [linkDetails, setLinkDetails] = useState({});
  const [linkToEdit, setLinkToEdit] = useState('');

	useEffect(() => {
    viewSubjectArea()
    getCourses()
    getTeacherList()
  }, [])

  const handleDeleteTeacher = async() => {
    let response = await new EbooksAPI().deleteEbookLink(toDeleteId);
    if(response.ok){
      toast.success("Link deleted successfully")
      // getCourses();
      getEbooks(courseID)
    }else{
      toast.error("Something went wrong while deleting link.")
    }
    setDeleteNotify(false);
  }


  const getCourses = async() => {
    setLoading(true);
    let response = await new CoursesAPI().getCourses();
    if(response.ok){
      let temp = response.data;
      let filtered = temp.filter(i => i.status !== null && i.deleted !== true); //remove status == null and remove deleted course
      setTeachers(filtered)
    }else{
      toast.error("Something went wrong while fetching exam information")
    }
    setLoading(false);
  }

  const handleEditModal = () => {
    return(
      <Modal size="lg" className="modal-all" show={showEditModal} onHide={()=> setShowEditModal(!showEditModal)} >
				<Modal.Header className="modal-header" closeButton>
				Edit Course
				</Modal.Header>
					<Modal.Body className="modal-label b-0px">
						<Form onSubmit={saveEditCourse}>
							<Form.Group className="m-b-20">
								<Form.Label for="courseName">
									Course Name
								</Form.Label>
								<FormControl defaultValue={courseName} 
									className="custom-input" 
									size="lg" 
									type="text"
									onChange={(e) => setCourseName(e.target.value)}
								/>
							</Form.Group>
							<Form.Group className="m-b-20">
								<Form.Label for="description">
									Description
								</Form.Label>
								<FormControl defaultValue={description} 
									className="custom-input" 
									size="lg" 
									type="text"
									onChange={(e) => setDescription(e.target.value)}
								/>
							</Form.Group>
							<Form.Group className="m-b-20">
										<Form.Label for="subjectArea">
												Subject Area
										</Form.Label>
										<Form.Select size="lg" onChange={(e) => setSubjectArea(e.target.value)}>
											{
												sarea.map(item => {
													return(
														<option value={item.id} selected={selectedCourse?.subjectAreaId === item.id}>
															{item.subjectAreaName}
														</option>
													)
												})
											}
										</Form.Select>
								</Form.Group>
								<Form.Group className="m-b-20">
										<Form.Label for="status">
												Status
										</Form.Label>
										<Form.Select size="lg" onChange={(e) => setStatus(e.target.value)}>
											<option value={true} selected={selectedCourse?.status === true}>
												Active
											</option>
											<option value={false} selected={selectedCourse?.status === false}>
												Inactive
											</option>
										</Form.Select>
								</Form.Group>
							  <span style={{float:"right"}}>
								<Button className="tficolorbg-button" type="submit" >
									Update Course
								</Button>
							</span>
						</Form>
					</Modal.Body>
			</Modal>
    )
  }

  const handleClickEdit = (data) => {
    setSelectedCourse(data)
    setStatus(data.status);
    setCourseName(data.courseName);
    setDescription(data.description);
    setSubjectArea(data.subjectAreaId)
    setShowEditModal(true);
  }

  const viewSubjectArea = async() => {
    let response = await new SubjectAreaAPI().getSubjectArea()
    if(response.ok){
      setSarea(response.data)
    }else{
      toast.error("Something went wrong while fetching all subject area")
    }
  }

  const handleClickDelete = (id) => {
    setToDeleteId(id);
    setDeleteNotify(true)
  }

  const saveEditCourse = async(e) => {
    e.preventDefault();
		if(description == '' || courseName == '' || subjectAreaId == ''){
			toast.error('Please insert all the required fields', {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				});
		}else{
      let data = {
        courseName,
        description,
        status,
        subjectAreaId
      }
      let response = await new CoursesAPI().editCourse(selectedCourse.id, data);
			if(response.ok){
				getCourses();
				setShowEditModal(false);
        setSelectedCourse({});
        setStatus('');
        setCourseName('');
        setDescription('');
        setSubjectArea('')
			}else{
				toast.error(response.data.errorMessage, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					});
			}
		}
  }

  const handleUpdateStatus = async(data) => {
    let response = await new CoursesAPI().editCourse(data.id, {...data, status: !data.status});
    if(response.ok){
      getCourses();
      toast.success('Course status updated successfully.')
    }else{
      toast.error("Something went wrong while fetching exam information")
    }
  }

  const addContributor = async(item) => {
    let data = {
      "courseId": courseID,
      "userAccountId": item.userAccountID,
    }
    let response = await new CoursesAPI().addDistributor(courseID, data)
    if(response.ok){
      toast.success('Contributor added successfully');
      handleGetContributors(courseID);
    }else{
      toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
    }
  }

  const handleRemoveContributor = async(data) => {
    if(data.distributorInformation.userAccountId == authorId){
      toast.error("You can't remove the author of this course.")
    }else{
      let response = await new CoursesAPI().removeContributor(courseID, data.distributorInformation.id)
      if(response.ok){
        toast.success('Contributor removed successfully');
        handleGetContributors(courseID);
      }else{
        toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
      }
    }
  }

  const handleGetContributors = async(id) => {
    let response = await new CoursesAPI().getContributor(id)
    if(response.ok){
      setContributorsList([...response.data])
    }else{
      toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
    }
  }

  const getCourseInfo = async(id) => {
    let response = await new CoursesAPI().getCourseInformation(id)
    if(response.ok){
      setCourseInfo(response.data)
      setAuthorId(response.data.createdBy)
    }else{
      alert("Something went wrong while fetching course information")
    }
  }

  const getTeacherList = async() => {
    let response = await new SchoolAPI().getTeachers()
    if(response.ok){
      setTeachersList(response.data)
    }else{
      toast.error(response.data?.errorMessage.replace('distributor', 'contributor')); 
    }
  }

  const handleClickContributor = (id) => {
    setContributorModal(!contributorModal)
    handleGetContributors(id)
    setCourseID(id)
    getCourseInfo(id)
  }

  const handleDisplayContributorMOdal = () => {
    return(
      <Modal size="lg" className="modal-all" show={contributorModal} onHide={()=> setContributorModal(false)} >
				<Modal.Header className="modal-header" closeButton>
          Contributor
				</Modal.Header>
					<Modal.Body className="modal-label b-0px">
           <Row>
              <Col md={6}>
                <div className='contributors-container'>
                  <p className="font-20">Contributor/s</p>
                  {
                    contributorsList.map((contributor, key) => {
                      return (
                        <Row className="mb-3">
                          <Col md={8}>
                            <span>{contributor.userInformation.firstname} {contributor.userInformation.lastname} </span>
                          </Col>
                          <Col>
                            <span><i onClick={() => handleRemoveContributor(contributor)} className="fa fa-minus bg-danger color-white d-flex justify-content-center align-items-center br-3" style={{width: 23, height: 23}}/></span>
                          </Col>
                        </Row>
                      )
                    })
                  }
                </div>
              </Col>
              <Col md={6}>
                <div className='contributors-container'>
                <p className="font-20">Teacher/s</p>
                {
                  teachersList.map((teacher, key) => {
                    return (
                    <Row className="mb-3">
                      <Col md={8}>
                        <span className="w-75">{teacher.fname} {teacher.lname}</span>
                      </Col>
                      <Col>
                        <span><i onClick={() => addContributor(teacher)} className="fa fa-plus tficolorbg-button color-white d-flex justify-content-center align-items-center br-3" style={{width: 23, height: 23}}/></span>
                      </Col>
                    </Row>
                      )
                  })
                }
                </div>
              </Col>
           </Row>
					</Modal.Body>
			</Modal>
    )
  }

  const handleClickUpload = (id) => {
    setCourseID(id);
    setUploadModal(true)
  }

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const handleUploadFile = async (e) => {
    e.preventDefault();
    if(userType != ''){
      setUploadModal(false);
      setLoading(true);
      let response = await new EbooksAPI().uploadLinks(courseID, userType, filesToUpload)
      if (response.ok) {
        getCourses();
        setCourseID('');
        setUserType('');
        toast.success("Successfully uploaded Ebook links.")
      } else {
        toast.error("Something went wrong while uploading teacher list.")
      }
      setLoading(false);
    }else{
      toast.error('Please select user type.')
    }
  }

  const getEbooks = async (id) => {
    // e.preventDefault();
    setUploadModal(false);
    setLoading(true);
    let response = await new EbooksAPI().getEbooksPerCourse(id)
    if (response.ok) {
      setEbookLinks(response.data);
      // setLoading(false);
      // getStudentEnrolled();
      // handleGetAllTeachers()
    } else {
      toast.error("Something went wrong while getting ebooks links.")
    }
    setLoading(false);
  }

  const handleGetUploadedFile = (file) => {
   if(file){ 
      getBase64(file).then(
        data => {
          let toUpload = {
            "base64String": data,
            "fileName": file.name
          }
          setFilesToUpload(toUpload)
        }
      );
    }
  }

  const clickShowList = (item) => {
    setCourseID(item.id);
    getEbooks(item.id);
    setCourseInfo(item);
    setShowList(true)
  }

  const handleEditLink = (data) => {
    setLinkDetails(data);
    setEbookLinkId(data.userEbook.id);
    setShowEditLinkModal(true);
    setLinkToEdit(data.userEbook.ebookLink);
  }

  const handleUpdateLink = async(e) => {
    e.preventDefault();
    setShowEditLinkModal(false);
    let data = {
      ebookLink: linkToEdit
    }
    let response = await new EbooksAPI().updateEbookLink(ebookLinkId, data);
    if (response.ok) {
      getEbooks(courseID);
    } else {
      toast.error("Something went wrong while updating ebook link.")
    }
  }

  return (
    <MainContainer title="Dashboard" activeHeader={"courses"} loading={loading}>
      {showList ?
      <>
        <button onClick={() => setShowList(false)} className="float-right btn btn-success btn-sm m-r-5" >
         Back to Course List
        </button>
        <h3 className='m-b-20 m-t-20'>{courseInfo?.courseName}</h3>
        <ReactTable pageCount={100}
          list={ebookLinks}
          filterable
          defaultFilterMethod={(filter, row) => {
            let f = filter.value.toLowerCase();
            const id = filter.pivotId || filter.id
            return row[id] !== undefined ? String(row[id].toLowerCase()).startsWith(f) : true
          }}
          data={ebookLinks}
          columns={[{
            Header: '',
            columns:
            [
              {
                Header: 'First Name',
                id: 'fname',
                accessor: d => d.student ? d.student?.fname : d.teacher.fname,
                Cell: row => (
                  <div className="d-flex justify-content-center align-items-center">
                    {row.original.student ? row.original.student?.fname : row.original.teacher?.fname}
                  </div>
                )
              },
              {
                Header: 'Last Name',
                id: 'lname',
                accessor: d => d.student ? d.student?.lname : d.teacher.lname,
                Cell: row => (
                  <div className="d-flex justify-content-center align-items-center">
                    {row.original.student ? row.original.student?.lname : row.original.teacher?.lname}
                  </div>
                )
              },
              {
                Header: 'Link',
                id: 'link',
                accessor: d => d.userEbook.ebookLink,
                Cell: row => (
                  <div className="d-flex justify-content-center align-items-center">
                    {row.original.userEbook?.ebookLink}
                  </div>
                )
              },
              {
                Header: 'Actions',
                id: 'edit',
                accessor: d => d.id,
                Cell: row => (
                  <div className="d-flex justify-content-center align-items-center">
                    <button onClick={() => handleEditLink(row.original)} className="btn btn-info btn-sm m-r-5" >
                      <i class="fas fa-edit"/>
                    </button>
                    <button onClick={() => handleClickDelete(row.original.userEbook.id)} className="btn btn-danger btn-sm m-r-5" >
                      <i class="fas fa-trash" />
                    </button>
                  </div>
                )
              },
            ]
          }]}
        csv edited={teachers} defaultPageSize={10} className="-highlight" 
        />
      </>
      :
      <>
        <h3 className='m-b-20 m-t-20'>Course List</h3> 
        <ReactTable pageCount={100}
          list={teachers}
          filterable
          defaultFilterMethod={(filter, row) => {
            let f = filter.value.toLowerCase();
            const id = filter.pivotId || filter.id
            return row[id] !== undefined ? String(row[id].toLowerCase()).startsWith(f) : true
          }}
          data={teachers}
          columns={[{
            Header: '',
            columns:
            [
              {
                Header: 'Course Name',
                id: 'fname',
                accessor: d => d.courseName,
              },
              {
                Header: 'Author',
                id: 'lname',
                accessor: d => d.authorName,
              },
              {
                Header: 'Subject Area',
                id: 'subjectArea',
                accessor: d => d.subjectArea?.subjectAreaName,
                Cell: row => (
                  <div className="d-flex justify-content-center align-items-center">
                    {row.original.subjectArea?.subjectAreaName}
                  </div>
                )
              },
              {
                Header: 'Status',
                id: 'toggle',
                accessor: d => d.status ? 'Active' : 'Inactive',
                Cell: row => (
                  <div className="d-flex justify-content-center align-items-center">
                    <Form>
                      <Form.Check
                        disabled={loading}
                        checked={row.original.status ? true : false}
                        type="switch"
                        id="custom-switch"
                        label={row.original.status ? 'Active' : 'Inactive'}
                        onClick={() => handleUpdateStatus(row.original)}
                      />
                    </Form>
                  </div>
                )
              },
              {
                Header: 'Actions',
                id: 'edit',
                accessor: d => d.id,
                Cell: row => (
                  <div className="d-flex justify-content-center align-items-center">
                    <button onClick={() => handleClickEdit(row.original)} className="btn btn-info btn-sm m-r-5" >
                      <i class="fas fa-edit"/>
                    </button>
                    <button onClick={() => handleClickContributor(row.original.id)} className="btn tficolorbg-button btn-sm m-r-5" >
                      CONTRIBUTOR
                    </button>
                  </div>
                )
              },
              {
                Header: 'Upload',
                id: 'ebook',
                accessor: d => 'Upload Ebook Links',
                Cell: row => (
                  <div className="d-flex justify-content-center align-items-center">
                    <button onClick={() => handleClickUpload(row.original.id)} className="btn btn-success btn-sm m-r-5">
                      Upload Ebook Links
                    </button>
                  </div>
                )
              },
              {
                Header: 'Links',
                id: 'links',
                accessor: d => 'See Links',
                Cell: row => (
                  <div className="d-flex justify-content-center align-items-center">
                    <button onClick={() => clickShowList(row.original)} className="btn btn-warning btn-sm m-r-5">
                      See Links
                    </button>
                  </div>
                )
              },
            ]
          }]}
        csv edited={teachers} defaultPageSize={10} className="-highlight" 
        />
      </>}
      <Modal size="lg" show={uploadModal} onHide={() => setUploadModal(false)} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Upload Ebook links
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => handleUploadFile(e)} >
            <Form.Group className="mb-4">
            <Form.Label>User Type</Form.Label>
            <Form.Select required onChange={(e) => setUserType(e.target.value)}>
                <option value=''>Select user</option>
                <option value='teacher'>Teacher</option>
                <option value='student'>Student</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control required type="file" accept=".xls,.xlsx," onChange={(e) => handleGetUploadedFile(e.target.files[0])} />
            </Form.Group>
            <p>.xslx</p>
            <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit'>Upload</Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal size="lg" show={showEditLinkModal} onHide={() => setShowEditLinkModal(false)} aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header className='class-modal-header' closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" >
            Edit Ebook links
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => handleUpdateLink(e)} >
            <Form.Group className="mb-4">
              <Form.Control value={linkToEdit} required type="text" onChange={(e) => setLinkToEdit(e.target.value)}/>
            </Form.Group>
            <Form.Group className='right-btn'>
              <Button className='tficolorbg-button' type='submit'>Update Link</Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
        <SweetAlert 
          showCancel
          show={deleteNotify} 
          onConfirm={()=> handleDeleteTeacher()}
          confirmBtnText="Delete"
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="error"
          title="Are you sure?"
          onCancel={() => setDeleteNotify(false)}
        >
          You will not be able to recover this data!
        </SweetAlert>
        {handleEditModal()}
        {handleDisplayContributorMOdal()}
    </MainContainer>
  )
}
