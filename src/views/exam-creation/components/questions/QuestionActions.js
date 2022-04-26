import React, {useState, useEffect, useContext} from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import CoursesAPI from "../../../../api/CoursesAPI";
import { UserContext } from '../../../../context/UserContext';

export default function QuestionActions({onEdit = () => alert("Ongoing development"), onDelete = () => alert("Ongoing development")}) {
  const [courseInfo, setCourseInfo] = useState("")
  const userContext = useContext(UserContext);
  const {user} = userContext.data;
  const courseid = sessionStorage.getItem('courseid')

  const getCourseInformation = async() => {
    // setLoading(true)
    let response = await new CoursesAPI().getCourseInformation(courseid)
    // setLoading(false)
    if(response.ok){
      setCourseInfo(response.data)
    }else{
      alert("Something went wrong while fetching course information")
    }
  }

  useEffect(() => {
    getCourseInformation();
  }, [])

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
    <>
    {courseInfo?.isTechfactors && user?.teacher.positionID != 7 ? (<></>):(<>
      <div className='exam-actions '>
      <OverlayTrigger
        placement="right"
        delay={{ show: 1500, hide: 0 }}
        overlay={renderTooltipEdit}>
        <a href='#delete-part' onClick={onEdit}>
          <i class='fas fa-edit'></i>
        </a>
      </OverlayTrigger>
      <OverlayTrigger
        placement="right"
        delay={{ show: 1500, hide: 0 }}
        overlay={renderTooltipDelete}>
        <a href='#delete-part' onClick={onDelete}>
          <i class='fas fa-trash-alt'></i>
        </a>
      </OverlayTrigger>
    </div>
    </>)}
    </>
  );
}
