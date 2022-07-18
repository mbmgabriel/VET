import React, { useState, useContext } from 'react'
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import CreateAssignment from './CreateAssignment'
import { UserContext } from '../../../../context/UserContext'

function AssignmentHeader({ module, getAssignmentList, refmoduleId, onSearch, onRefresh }) {
	const [modal, setModal] = useState(false)
	const userContext = useContext(UserContext)
	const { user } = userContext.data

	const toggle = () => {
		setModal(!modal)
	}

	return (
		<div>
			<div className="row m-b-20" style={{ paddingTop: '10px' }}>
				<div className="col-md-10 pages-header fd-row mr-3"><p className='title-header m-0'>Assignment </p>
					<div>
						<Button onClick={onRefresh} className='ml-3'>
							<i className="fa fa-sync"></i>
						</Button>
					</div>
					{
						user.isTeacher &&
						<p className='title-header m-0-dashboard'>
							<Button className='btn-create-task' Button variant="link" onClick={() => setModal(true)}><i className="fa fa-plus" /> Create Assignment</Button>
						</p>
					}
				</div>
			</div>
			<div className="row m-b-20">
				<div className="col-md-12">
					<InputGroup size="lg">
						<FormControl onChange={(e) => onSearch(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search assignment here" type="search" />
						<InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
					</InputGroup>
				</div>
			</div>
			<CreateAssignment toggle={toggle} modal={modal} module={module} getAssignmentList={getAssignmentList} refmoduleId={refmoduleId} />
		</div>
	)
}
export default AssignmentHeader
