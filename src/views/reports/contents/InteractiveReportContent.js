import React, {useState, useEffect, useContext} from 'react'
import {Accordion, Row, Col, Table, Button, Badge} from 'react-bootstrap'
import ClassesAPI from '../../../api/ClassesAPI'

function InteractiveReportContent({setShowInteractiveHeader, showInteractiveHeader, classesModules, setClassesModules, selectedClassId, viewInteractiveReport, interactiveReport, setinteractiveReport, showReportHeader, setShowReportHeader}) {
  
  const [loading, setLoading] = useState(false)
  let sessionClass = sessionStorage.getItem("classId")
  const [sorted, setSorted] = useState([])
  const [alphabetical, setAlphabetical] = useState(true);

  useEffect(() => {
  }, [])

  const handleClickIcon = () =>{
    setAlphabetical(!alphabetical);
    if(!alphabetical){
      arrageAlphabetical(interactiveReport);
    }
    else{
      arrageNoneAlphabetical(interactiveReport);
    }
  }

  useEffect(()=>{
    arrageNoneAlphabetical(interactiveReport);
    arrageAlphabetical(interactiveReport);
}, [interactiveReport])

const arrageNoneAlphabetical = (data) => {
  let temp = data?.sort(function(a, b){
    let nameA = a.student.lname.toLocaleLowerCase();
    let nameB = b.student.lname.toLocaleLowerCase();
    if (nameA > nameB) {
        return -1;
    }
  });
  console.log(temp, '111111')
  setSorted(temp)
}

const arrageAlphabetical = (data) => {
  let temp = data?.sort(function(a, b){
    console.log(a, 'herererereherererereherererere TRUE')
    let nameA = a.student.lname.toLocaleLowerCase();
    let nameB = b.student.lname.toLocaleLowerCase();
    if (nameA < nameB) {
        return -1;
    }
  });
  console.log(temp, '2222')
  setSorted(temp)
}
  
  return(
    <>
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
        <th><div className='class-enrolled-header'> Student Name{' '} <i onClick={() => handleClickIcon()} className={`${!alphabetical ? 'fas fa-sort-alpha-down' : 'fas fa-sort-alpha-up'} td-file-page`}></i></div></th>
          {/* <th>Easy Score</th> */}
          <th>Score</th>
          {/* <th>Challenging Score</th> */}
          {/* <th>Completion</th> */}
          {/* <th>Completion Time</th> */}
        </tr>
      </thead>
      <tbody>
      {sorted.map(item =>{
        return (
        item.interactiveResults.map(st =>{
          return (
            <tr>
              <td ><i class="fas fa-user-circle td-icon-report-person"></i>{item.student.fname}</td>
              {/* {st.easyScore === 'Not Submitted' ?(<><td><Badge bg="danger">{st.easyScore}</Badge></td></>):(<><td>{st.easyScore}</td></>)} */}
              {st.averageScore !== null || st.easyScore !== null || st.hardScore !== null?(<><td><Badge bg="success">Easy Score: &nbsp; {st.easyScore == null ?(<>0</>):(<>{st.easyScore}</>)}</Badge>&nbsp;<Badge bg="success">Normal Score: &nbsp;{st.averageScore == null ?(<>0</>):(<>{st.averageScore}</>)}</Badge>&nbsp;<Badge bg="success">Challenging Score: &nbsp;{st.hardScore == null ?(<>0</>):(<>{st.hardScore}</>)}</Badge></td></>):(<></>)}
              {st.noDifficultyScore !== null ?(<><td><Badge bg="success">{st.noDifficultyScore}</Badge></td></>):(<></>)}
              {st.noDifficultyScore !== null || st.averageScore !== null || st.easyScore !== null || st.hardScore !== null ?(<></>):(<><td><Badge bg="danger">Not Submitted</Badge></td></>)}
              {/* {st.noDifficultyScore !== null && st.averageScore === null && st.easyScore === null && st.hardScore === null ?(<></>):(<></>)} */}
              {/* {st.hardScore === 'Not Submitted' ?(<><td><Badge bg="danger">{st.hardScore}</Badge></td></>):(<><td>{st.hardScore}</td></>)} */}
              {/* {st.noDifficultyScore === 'Not Completed' || st.noDifficultyScore === 'Not Submitted'  ?(<><td><Badge bg="danger">{st.noDifficultyScore}</Badge></td></>):(<><td><Badge bg="success">{st.noDifficultyScore}</Badge></td></>)} */}
            </tr>
          )
        })
        )
      })}
      </tbody>
    </Table>
    </>
  )
}
export default InteractiveReportContent