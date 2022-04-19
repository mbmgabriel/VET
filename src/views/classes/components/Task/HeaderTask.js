import React, {useState, useContext} from 'react'
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import CreateTask from './CreateTask';
import { UserContext } from '../../../../context/UserContext';
import {useParams} from 'react-router';

function HeaderTask({module, getTaskModule, refModuleId, onSearch}) {
const [modal, setModal] = useState(false)
const userContext = useContext(UserContext)
const {user} = userContext.data
const {id} = useParams();
const toggle = () =>{
    setModal(!modal)
  }
	return (
		<div>
			<div className="row m-b-20" style={{paddingTop:'15px'}}>
				<div className="col-md-10 pages-header"><p className='title-header'>Task </p>
          { 
            user.isTeacher && <p className='title-header'>	<Button className='btn-create-task' Button variant="link" onClick={() => setModal(true)}> <i className="fa fa-plus"></i>  Create Task  </Button></p>
          }
				</div>
			</div>
			<div className="row m-b-20">
				<div className="col-md-12">
					<InputGroup size="lg">
						<FormControl onChange={(e) => onSearch(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search task here" type="search"/>
					<InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
					</InputGroup>
				</div>
			</div>
				<CreateTask setModal={setModal} refModuleId={refModuleId} module={module} classId={id} toggle={toggle} modal={modal} getTaskModule={getTaskModule} />
		</div>
	)
}
export default HeaderTask

