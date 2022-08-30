import React, { useState, useEffect, useContext } from 'react'
import { Table, Button, Tooltip, OverlayTrigger } from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import { useParams } from 'react-router'
import SweetAlert from 'react-bootstrap-sweetalert';
import StudentPortfolio from './StudentPortfolio';
import { UserContext } from '../../../../context/UserContext';
import { toast } from 'react-toastify';

function ClassEnrolled({enrolledStudent, getStudentEnrolled, getStudentWaiting, searchTerm}) {
  const [deleteNotify, setDeleteNotify] = useState(false)
  const [itemId, setItemId] = useState('')
  const [openPortfolioModal, setOpenPortfolioModal] = useState(false)
  const {id} = useParams()
  const [sortedData, setSortedData] = useState(enrolledStudent.students);
  const [studentinfo, setStudentInfo] = useState()
  const [classInfo, setClassinfo] = useState()
  const [studentClasses, setStudentClasses] = useState()
  const [studentInformation, setStudentInformation] = useState([]);
  const [alphabetical, setAlphabetical] = useState(true);
  const userContext = useContext(UserContext)
  const {themeColor} = userContext.data

  const cancelSweetAlert = () => {
    setDeleteNotify(false)
  }
  
  const openPortfolioToggle = (item, item1, item2) => {
    setStudentInfo(item)
    setClassinfo(item1)
    getStudentInformation(item2)
    setOpenPortfolioModal(true)
  }
  
  const handleDeleteNotify = (item) =>{
    setDeleteNotify(true)
    setItemId(item)
  }

  const getStudentInformation = async(item2) =>{
    let classId = id
    let response = await new ClassesAPI().getStudentInformation(item2, classId)
      if(response.ok){
        setStudentInformation(response.data)
      }else{
        toast.error('Something went wrong while fetching all Activeties')
      }
  }

  console.log('enrolledStudent:', enrolledStudent)
  console.log('studentActivities:', studentInformation)

  const removeStudentEnrolled = async(item) =>{
    let studentId = item
    let isAccepted = false
    let response = await new ClassesAPI().acceptStudent(id, isAccepted, [studentId]) 
    if(response.ok){
      // alert('Add Student')
      setDeleteNotify(false)
      getStudentEnrolled()
      getStudentWaiting()
      toast.success('Successfully removed student.')
    }else{
      toast.error("Something went wrong while fetching all Add Student")
    }
  }

  const renderTooltipDelete = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete
    </Tooltip>
  )
  const testClick = () => {
    alert('test')
  }
  
  useEffect(()=>{
    // if(alphabetical){
      arrageNoneAlphabetical();
      arrageAlphabetical();
    // }
    // else{
    // }
  }, [enrolledStudent])


  const arrageAlphabetical = () => {
      let data = enrolledStudent?.students;
      let temp = data?.sort(function(a, b){
        let nameA = a.fname.toLocaleLowerCase();
        let nameB = b.fname.toLocaleLowerCase();
        if (nameA < nameB) {
            return -1;
        }
      });
      console.log(temp, 'herererere')
      setSortedData(temp)
  }

  const arrageNoneAlphabetical = () => {
    let data = enrolledStudent?.students;
    let temp = data?.sort(function(a, b){
      let nameA = a.fname.toLocaleLowerCase();
      let nameB = b.fname.toLocaleLowerCase();
      if (nameA > nameB) {
          return -1;
      }
    });
    console.log(temp, 'herererere')
    setSortedData(temp)
}

  const handleClickIcon = () =>{
    setAlphabetical(!alphabetical);
    if(!alphabetical){
      arrageAlphabetical();
    }
    else{
      arrageNoneAlphabetical();
    }
  }
  return (
    <div>
      <SweetAlert
        warning
        showCancel
        show={deleteNotify}
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        title="Are you sure?"
        onConfirm={() => removeStudentEnrolled(itemId)}
        onCancel={cancelSweetAlert}
        focusCancelBtn
        >
      </SweetAlert>
      <Table >
        <thead>
          <tr> 
            <th><div className='class-enrolled-header'> Student{' '} <i onClick={() => handleClickIcon()} className={`${!alphabetical ? 'fas fa-sort-alpha-down' : 'fas fa-sort-alpha-up'} td-file-page`}></i></div></th>
            <th><div className='class-enrolled-header'> Email Address</div></th>
          </tr>       
        </thead>
        <tbody>
        {sortedData?.filter((item) => {
          if(searchTerm == ''){
            return item
          }else if(item.lname.toLowerCase().includes(searchTerm.toLowerCase())){
            return item
          }
        }).map(item => {
          return (         
            <tr>
              <td >
                <div className='class-waiting-list' style={{fontSize:'24px', color:'#707070', marginLeft:'25px'}} >
                  <i class="fas fa-user-circle fas-1x" style={{color: themeColor,fontSize:'36px'}}></i>&nbsp;
                    <Button className='btn-student-portfolio' onClick={() => openPortfolioToggle(item, enrolledStudent?.classInformation, item.id)} variant="link">{item.lname} {item.fname}</Button>
                </div>
              </td>
              <td>
                {item?.emailAdd === null ? (<><p style={{color:'#707070'}}>No Email address</p></>):(<> <p style={{color:'#707070'}}>{item?.emailAdd}</p></>)}  
              </td>
              <td className='class-waiting-icon'>
                <div style={{marginRight:'35px'}}>
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 1, hide: 0 }}
                    overlay={renderTooltipDelete}>
                    <Button onClick={() => handleDeleteNotify(item.id)} className="m-r-5 color-white tficolorbg-button" size="sm"> <i class="fas fa-trash-alt"></i></Button>
                  </OverlayTrigger>
                </div>
              </td> 
            </tr>)
            })}
        </tbody>
      </Table>
      <StudentPortfolio setOpenPortfolioModal={setOpenPortfolioModal} classInfo={classInfo} studentInformation={studentInformation} openPortfolioModal={openPortfolioModal} openPortfolioToggle={openPortfolioToggle} />
    </div>
  )
}
export default ClassEnrolled
