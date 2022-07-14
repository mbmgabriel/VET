import React, {useState, useEffect, useContext} from 'react'
import {Accordion, Row, Col, Table, Button, Badge} from 'react-bootstrap'
import ClassesAPI from '../../../api/ClassesAPI'
import {writeFileXLSX, utils} from "xlsx";

function InteractiveReportContent({interactiveName, showInteractiveHeader, classesModules, setClassesModules, selectedClassId, viewInteractiveReport, interactiveReport, setinteractiveReport, showReportHeader, setShowReportHeader}) {
  
  const [loading, setLoading] = useState(false)
  const [dataDownload, setDataDownload] = useState({});

  const handleGetItems = () => {
    let tempData =[]
    interactiveReport.map((st, index) => {
      let temp= {};
      let name = `${ st.student.lname} ${ st.student.fname}`
      let score = st.interactiveResults[0].grade
      let status = score == null ? 'Not Submitted' : score
      temp.student = name;
      temp.grade = status;
      
      tempData.push(temp);
    })
    setDataDownload(tempData);
  }

  const downloadxls = () => {
    const ws =utils.json_to_sheet(dataDownload);
    const wb =utils.book_new();
    utils.book_append_sheet(wb, ws, "SheetJS");
    writeFileXLSX(wb, `${interactiveName}_interactive_report.xlsx`);
  };


  useEffect(() => {
    handleGetItems()
  }, [interactiveReport])

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
      <Col className='d-flex justify-content-end'>
        <Button onClick={() => downloadxls()} className='btn-showResult m-b-20'  size='lg' variant="outline-warning"><b> Export </b></Button>
      </Col>
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