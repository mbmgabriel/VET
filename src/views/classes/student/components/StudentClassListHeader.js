import React from 'react'
import { Button, InputGroup, FormControl,} from 'react-bootstrap';
import StudentJoinClass from '../StudentJoinClass';

function StudentClassListHeader({joinClassesToggle, joinClassestModal, getPendingClasses, onSearch, getClassesStudent}) {

	const handleRefreshClassCard = () => {
		getClassesStudent()
		getPendingClasses()
	}

  return (
    <div>
      
			<div className="row m-b-20" >
				<div style={{display:'inline-flex'}}>
				<div className="col-md-10 pages-header">
					<h1>Classes <Button onClick={() => joinClassesToggle()} className='btn-create-class' Button variant="link" > <i className="fa fa-plus"></i>  Join Class  </Button>
					<Button onClick={() => handleRefreshClassCard()}  className='ml-3'>
            <i className="fa fa-sync"></i>
        	</Button>
					</h1>
				</div>
				</div>
			</div>
			<div className="row m-b-20">
				<div className="col-md-12">
					<InputGroup size="lg">
						<FormControl onChange={(e) => onSearch(e.target.value)} aria-label="Large" aria-describedby="inputGroup-sizing-sm" placeholder="Search here for available classes" type="search"/>
					<InputGroup.Text id="basic-addon2" className="search-button"><i className="fas fa-search fa-1x"></i></InputGroup.Text>
					</InputGroup>
					</div>
				</div>
			<StudentJoinClass joinClassesToggle={joinClassesToggle} joinClassestModal={joinClassestModal} getPendingClasses={getPendingClasses} />
    </div>
  )
}

export default StudentClassListHeader
