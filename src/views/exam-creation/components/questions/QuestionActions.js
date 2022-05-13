import React, {useState, useEffect} from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import CoursesAPI from "../../../../api/CoursesAPI";

export default function QuestionActions({onEdit = () => alert("Ongoing development"), onDelete = () => alert("Ongoing development")}) {
  const [courseInfo, setCourseInfo] = useState("")

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
    if(courseid != null){
      getCourseInformation();
    }
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
    {courseInfo?.isTechfactors? (<></>):(<>
      <div className='exam-actions '>
      <OverlayTrigger
        placement="right"
        delay={{ show: 1, hide: 0 }}
        overlay={renderTooltipEdit}>
        <a href='#delete-part' onClick={onEdit}>
          <i class='fas fa-edit' title=""></i>
        </a>
      </OverlayTrigger>
      <OverlayTrigger
        placement="right"
        delay={{ show: 1, hide: 0 }}
        overlay={renderTooltipDelete}>
        <a href='#delete-part' onClick={onDelete}>
          <i class='fas fa-trash-alt' title=""></i>
        </a>
      </OverlayTrigger>
    </div>
    </>)}
    </>
  );
}
