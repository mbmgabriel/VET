import React, {useState, useEffect, useContext} from 'react'
import {Accordion, Row, Col, Table, Button, Badge} from 'react-bootstrap'
import ClassesAPI from '../../../api/ClassesAPI'
import {writeFileXLSX, utils} from "xlsx";
import {UserContext} from "../../../context/UserContext"
function InteractiveReportContent({interactiveName, showInteractiveHeader, classesModules, setClassesModules, selectedClassId, viewInteractiveReport, interactiveReport, setinteractiveReport, showReportHeader, setShowReportHeader}) {
  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [loading, setLoading] = useState(false)
  const [dataDownload, setDataDownload] = useState({});

  const handleGetItems = () => {
    let tempData =[]
    interactiveReport.map((st, index) => {
      let temp= {};
      let name = `${ st.student.lname} ${ st.student.fname}`
      let score = st.interactiveResults[0].grade
      let status = score == null ? 'Not Submitted' : score
      temp[`Student Name`] = name;
      temp.Grade = status;
      
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
  setSorted(temp)
}

const arrageAlphabetical = (data) => {
  let temp = data?.sort(function(a, b){
    let nameA = a.student.lname.toLocaleLowerCase();
    let nameB = b.student.lname.toLocaleLowerCase();
    if (nameA < nameB) {
        return -1;
    }
  });
  setSorted(temp)
}
  
  return(
    <>
      {user.isTeacher && <Col className='d-flex justify-content-end'>
        <Button onClick={() => downloadxls()} className='btn-showResult m-b-20'  size='lg' variant="outline-warning"><b> Export </b></Button>
      </Col>}
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
        <th><div className='class-enrolled-header'> Student Name{' '} <i onClick={() => handleClickIcon()} className={`${!alphabetical ? 'fas fa-sort-alpha-down' : 'fas fa-sort-alpha-up'} td-file-page`}></i></div></th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
      {sorted.map(item =>{
        let filterDisplay = user?.isStudent ? item.student.id == user?.student.id : true
        return (
          filterDisplay &&
        item.interactiveResults.map(st =>{
          return (
            <tr>
              <td ><i class="fas fa-user-circle td-icon-report-person"></i>{item.student.fname}</td>
              {st.averageScore !== null || st.easyScore !== null || st.hardScore !== null?(<><td><Badge bg="success">Easy Score: &nbsp; {st.easyScore == null ?(<>0</>):(<>{st.easyScore}</>)}</Badge>&nbsp;<Badge bg="success">Normal Score: &nbsp;{st.averageScore == null ?(<>0</>):(<>{st.averageScore}</>)}</Badge>&nbsp;<Badge bg="success">Challenging Score: &nbsp;{st.hardScore == null ?(<>0</>):(<>{st.hardScore}</>)}</Badge></td></>):(<></>)}
              {st.noDifficultyScore !== null ?(<><td><Badge bg="success">{st.noDifficultyScore}</Badge></td></>):(<></>)}
              {st.noDifficultyScore !== null || st.averageScore !== null || st.easyScore !== null || st.hardScore !== null ?(<></>):(<><td><Badge bg="danger">Not Submitted</Badge></td></>)}
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