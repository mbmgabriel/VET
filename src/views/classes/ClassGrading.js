import React, {useEffect, useState} from 'react'
import ClassSideNavigation from './components/ClassSideNavigation';
import ClassBreadcrumbs from './components/ClassBreedCrumbs';

import { Accordion, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import GradeTermAPI from '../../api/GradeTermAPI';
import SweetAlert from "react-bootstrap-sweetalert";
import FullScreenLoader from '../../components/loaders/FullScreenLoader';
import { Link, useParams } from 'react-router-dom';

function ClassGrading() {
  const {id} = useParams();

  const [loading, setLoading] = useState(true);
  const [terms, setTerms] = useState([]);
  const subsType = localStorage.getItem('subsType');
  
  useEffect(() => {
    handleGetAllTerms();
    if(subsType != 'LMS'){
      window.location.href = "/classes"
    }
  }, []);

  const handleGetAllTerms = async () => {
    setLoading(true);
    const response = await new GradeTermAPI().getTerms();
    if (response.ok) {
      setTerms(response.data);
    } else {
      toast.error("Something went wrong while fetching terms");
    }
    setLoading(false);
  };

  return (
    <ClassSideNavigation>
      <ClassBreadcrumbs title='' clicked={() => console.log('')} />
      <h1 class="exam-title">Terms</h1>
      <ul class="list-group">
        {terms.map((term) => (
        <li class="list-group-item"><Link to={ `/classes/${id}/class_grading/${term.id}`}>{term.description}</Link></li>
        ))}
      </ul>

    </ClassSideNavigation>
  )
}

export default ClassGrading

