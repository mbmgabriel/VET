import React, {useEffect, useState, useContext} from 'react'
import ClassSideNavigation from './components/ClassSideNavigation';
import ClassBreadcrumbs from './components/ClassBreedCrumbs';

import { Accordion, Container, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import GradeTermAPI from '../../api/GradeTermAPI';
import SweetAlert from "react-bootstrap-sweetalert";
import FullScreenLoader from '../../components/loaders/FullScreenLoader';
import { Link, useParams } from 'react-router-dom';
import ClassesAPI from '../../api/ClassesAPI';
import {UserContext} from '../../context/UserContext'
function ClassMeeting() {
  const {id} = useParams();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const userContext = useContext(UserContext)
  const {user} = userContext.data
  const [loading, setLoading] = useState(true);
  const subsType = user.subsType;
  
  const getClassInformation = async() => {
    setLoading(true);
    let response = await new ClassesAPI().getClassInformation(id)
    if(response.ok){
      setValue('meeting_link', response.data?.meeting_Link);
      setValue('meeting_id', response.data?.meeting_Id);
      setValue('meeting_password', response.data?.password);
    }else{
      toast.error(response.data?.message || "Something went wrong while fetching class information");
    }
    setLoading(false)
  }

  useEffect(() => {
    // if(subsType != 'LMS'){
    //   window.location.href = "/classes"
    // }
    getClassInformation()
  }, []);

  const onSubmit = async(data) => {
    const body = {
      "meeting_Id": data.meeting_id,
      "meeting_Link": data.meeting_link,
      "password": data.meeting_password,
    }
    setLoading(true)
    let response = await new ClassesAPI().updateMeeting(id, body)
    if(response.ok){
      toast.success("Meeting updated successfully");
    }else{
      toast.error(response.data?.message || "Something went wrong while updating meeting");
    }
    setLoading(false)
  }

  return (
    <ClassSideNavigation>
      <ClassBreadcrumbs title='' clicked={() => console.log('')} />
      <Container className="bg-white py-3 rounded">
        <h1 class="exam-title mb-3">Class Meeting</h1>
        {loading && <FullScreenLoader />}
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className='control-label mb-2'>Meeting Link</label>
          <input
            {...register("meeting_link", {
              required: "Meeting link is required",
              pattern: {
                value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                message: "Invalid meeting link",
              },
            })}
            type='text'
            size='30'
            className='form-control'
          />
          <p className='text-danger'>{errors.meeting_link?.message}</p>
          <label className='control-label mb-2'>Meeting ID</label>
          <input
            {...register("meeting_id", {
              required: "Meeting ID is required",
              pattern: {
                //
                value: /^([0-9]{11})$/,
                message: "Invalid meeting ID",
              },
            })}
            type='text'
            size='30'
            className='form-control'
          />
          <p className='text-danger'>{errors.meeting_id?.message}</p>
          <label className='control-label mb-2'>Meeting Password</label>
          <input
            {...register("meeting_password", {
              required: "Meeting password is required",
            })}
            type='text'
            size='30'
            className='form-control'
          />
          <p className='text-danger'>{errors.meeting_password?.message}</p>
          <button type='submit' className='btn btn-primary'>
            Save
          </button>
        </form>
      </Container>
    </ClassSideNavigation>
  )
}

export default ClassMeeting

