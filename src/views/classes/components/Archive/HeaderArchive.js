import React, { useState } from "react";
import { CardGroup, Card, Dropdown, InputGroup, FormControl, Button, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { BrowserRouter as Router, useHistory } from 'react-router-dom'
import ClassesAPI from "../../../../api/ClassesAPI";
import { toast } from "react-toastify";

export default function HeaderArchive({archiveItem, getArchive, onSearch, searchTerm}) {
const [openDropdown, setOpenDropdown] = useState(false)
const history = useHistory();

const handleHistoryArchive = () => {
  history.push('/archive')
}

const handleHistoryList = () => {
  history.push('/classes')
}

const retrieveArchive = async(item) =>{
  let response = await new ClassesAPI().retrieveArchive(item)
    if(response.ok){
      toast.success('Done!')
      getArchive()
    }else{
      toast.error(response.data.errorMessage)
    }
}

const renderTooltipRestore = (props) => (
  <Tooltip id="button-tooltip" {...props}>
    Restore
  </Tooltip>
)

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <span 
          href=""
          ref={ref}
          onClick={(e) => {
            e.preventDefault();
            onClick(e);
          }}
        >{children}</span>
      ));
return (
<div>
  <div>
      <Row style={{paddingTop:'15px'}}>
      <Col className='title-header' >
      <p className='title-header' >Archive Classes </p> 
      </Col>
      <Col style={{textAlign:'right'}}>
        <Button className='btn-Enrolled' onClick={() => handleHistoryList()} size='lg' variant="outline-warning"><b>Active</b></Button>
        <Button  className='btn-Enrolled' onClick={() => handleHistoryArchive()}  size='lg' variant="outline-warning"><b>Archive</b></Button>
      </Col>
    </Row>

			  <div className="row m-b-20">
				  <div className="col-md-12">
					  <InputGroup size="lg">
						  <FormControl onChange={(e) => onSearch(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search here for archived classes" type="search"/>
					  <InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
					  </InputGroup>
					</div>
			  </div>
      </div>
      <CardGroup className='card-group2'>
      {archiveItem.filter((item) => {
        if(searchTerm == ''){
          return item
        }else if(item.className.toLowerCase().includes(searchTerm.toLowerCase())){
          return item
        }
      }).map(item =>{
        return(
          <div>
          <Card className='class-card' >
          <Card.Header className='class-header-card' style={{ backgroundImage: `url(${item.classCover})` }} >
            <Row>
              <Col sm={10}>
              </Col>
              <Col sm={2} style={{textAlign:'right'}}>
                <Dropdown isOpen={openDropdown} toggle={()=> setOpenDropdown(!openDropdown)}>
                  <Dropdown.Toggle data-toggle="dropdown" as={CustomToggle} >
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 1, hide: 0 }}
                    overlay={renderTooltipRestore}>
                    <i className="fa fa-ellipsis-v fa-1x cursor-pointer-edit-class-card"></i>
                  </OverlayTrigger>
                  </Dropdown.Toggle>
                  <Dropdown.Menu >
                    <Dropdown.Item onClick={() => retrieveArchive(item.id)} >
                      Restore 
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col sm={10}>
                {/* <b>{item.gradeName}   {item.className} </b> */}
              </Col>
              <Col sm={8}>
               {item.courseName}
              </Col>
              <Col ms={22} style={{fontSize:'15px', textAlign:'right',}}>
                {/* <i className="fas fa-user"></i> 30 */}
             </Col>
           </Row>
          </Card.Header>
          <Card.Body>
          <Card.Title>
            </Card.Title>
            <Card.Subtitle>
            {item.courseName} 
              <Col className='font-color' sm={10}>
                {item.classCode}
              </Col>
              <Col sm={10}>
                <b>
                  {item.className} <br /> 
                 <p className='font-color'> {item.gradeName} </p> 
                </b> 
              </Col>
            </Card.Subtitle>
            <Card.Text className='font-color'>
            <Row>
            <Col sm={8}>
               Student
              </Col>
              <Col ms={22} style={{fontSize:'15px', textAlign:'right',}}>
                <i className="fas fa-user"></i> {item?.classEnrolledCount}
                <br />
             </Col>
            </Row>
            </Card.Text>
          </Card.Body>
      </Card>
      </div>
        )
      })}
     </CardGroup>
</div>
  )
}
