import React, { useState, useEffect, useContext } from 'react'
import { Table, Button, Tooltip, OverlayTrigger } from 'react-bootstrap'
import ClassesAPI from '../../../../api/ClassesAPI'
import { useParams} from 'react-router'
import SweetAlert from 'react-bootstrap-sweetalert';
import {UserContext } from '../../../../context/UserContext'


function ClassWaiting({waitingStudent, getStudentEnrolled, getStudentWaiting, searchTerm}) {
  const [addNotify, setAddNotify] = useState(false)
  const [deleteNotify, setDeleteNotify] = useState(false)
  const [sortedData, setSortedData] = useState(waitingStudent.students);
  const [itemId, setItemId] = useState('')
  const {id} = useParams();
  const [alphabetical, setAlphabetical] = useState(true);
  const userContext = useContext(UserContext)
  const {user} = userContext.data

  const cancelSweetAlert = () => {
    setDeleteNotify(false)
  }

  const handleDeleteNotify = (item) =>{
    setDeleteNotify(true)
    setItemId(item)
  }

  const closeAddNotify = () =>{
    setAddNotify(false)
  }

  const addStudent = async(e, item) =>{
    console.log('this studentId', item)
    let studentId = item
    let isAccepted = true
    let response = await new ClassesAPI().acceptStudent(id, isAccepted, [studentId]) 
    if(response.ok){
      // alert('Add Student')
      setAddNotify(true)
      getStudentEnrolled()
      getStudentWaiting()
    }else{
      alert("Something went wrong while fetching all Add Student")
    }
  }

  const removeStudent = async (item) =>{
    let response = await new ClassesAPI().removeStudentWaitingList(id, [item])
    if(response.ok){
      // alert('Remove Student from ClassList')
      setDeleteNotify(false)
      getStudentEnrolled()
      getStudentWaiting()
    }else{
      alert("Something went wrong while fetching Remove Student from Pending List")
    }
  }

  const renderTooltipDelete = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete
    </Tooltip>
  )

  const renderTooltipAdd = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Add
    </Tooltip>
  )

  useEffect(()=>{
    // if(alphabetical){
      arrageNoneAlphabetical();
      arrageAlphabetical();
    // }
    // else{
    // }
  }, [waitingStudent]);

  const arrageAlphabetical = () => {
    let data = waitingStudent?.students;
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
  let data = waitingStudent?.students;
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
      <Table>
        <thead>
          <tr> 
          <th><div className='class-waiting-header'> Student{' '} <i onClick={() => handleClickIcon()} className={`${!alphabetical ? 'fas fa-sort-alpha-down' : 'fas fa-sort-alpha-up'} td-file-page`}></i></div></th>  
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
              <td>
                <div className='class-waiting-list' style={{fontSize:'24px', color:'#707070', marginLeft:'25px'}} >
                  <i class="fas fa-user-circle fas-1x" style={{color:'#EE9337',fontSize:'36px',}}></i>&nbsp;
                 <span className='btn-student-portfolio' > {item.fname} {item.lname} </span>
                </div>
              </td>
              <td className='class-waiting-icon'>
                <div style={{marginRight:'35px'}} className={user.isSchollAdmin ? 'd-none' : ''}> 
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 1, hide: 0 }}
                    overlay={renderTooltipAdd}>
                      <Button onClick={(e) => addStudent(e, item.id)} className="m-r-5 color-white tficolorbg-button" size="sm"> <i class="fas fa-user-plus"></i> </Button>
                  </OverlayTrigger>
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
        <SweetAlert 
          success
          show={addNotify} 
          title="Done!" 
          onConfirm={closeAddNotify}>
        </SweetAlert>
        <SweetAlert
          warning
          showCancel
          show={deleteNotify}
          confirmBtnText="Yes, delete it!"
          confirmBtnBsStyle="danger"
          title="Are you sure?"
          onConfirm={() => removeStudent(itemId)}
          onCancel={cancelSweetAlert}
          focusCancelBtn
        >
            You will not be able to recover this imaginary file!
          </SweetAlert>
    </div>
  )
}

export default ClassWaiting
