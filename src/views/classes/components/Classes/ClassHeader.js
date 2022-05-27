import React, {useState, useContext} from 'react'
import { Button, InputGroup, FormControl, Row, Col} from 'react-bootstrap';
import CreateClassModal from './CreateClassModal'
import { BrowserRouter as Router, useHistory } from 'react-router-dom'
import { UserContext } from '../../../../context/UserContext'

function ClassHeader({getClasses, onSearch}) {
  const [modal, setModal] = useState(false);
  const userContext = useContext(UserContext)
  const {user} = userContext.data

	const history = useHistory();
  const toggle = () =>{
    setModal(!modal)
  }

	const handleHistoryArchive = () => {
		history.push('/archive')
	}

	const handleHistoryList = () => {
		history.push('/classes')
	}

	return (
		<div>
			<Row style={{paddingTop:'15px'}}>
        <Col className='title-header' >
        <p className='title-header' >Classes <Button className={user.isTeacher ? 'btn-create-class' : 'd-none'} variant="link" onClick={() => setModal(true) }> <i className="fa fa-plus"></i>  Create Class  </Button></p> 
        </Col>
        <Col style={{textAlign:'right'}} className={user.isSchoolAdmin ? 'd-none' : ''}>
          <Button className='btn-Enrolled' onClick={() => handleHistoryList()} size='lg' variant="outline-warning"><b>Active</b></Button>
          <Button  className='btn-Enrolled' onClick={() => handleHistoryArchive()}  size='lg' variant="outline-warning"><b>Archive</b></Button>
        </Col>
      </Row>
			<div className="row m-b-20">
				<div className="col-md-12">
					<InputGroup size="lg">
						<FormControl onChange={(e) => onSearch(e.target.value)} className='search-box' aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search here for available classes" type="search"/>
					<InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
					</InputGroup>
				</div>
			</div>
			<CreateClassModal toggle={toggle} modal={modal} getClasses={getClasses}  />
		</div>
	)
}
export default ClassHeader

