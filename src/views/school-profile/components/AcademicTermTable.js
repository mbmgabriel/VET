import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import ReactTable from "react-table-v6";
import "react-table-v6/react-table.css";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import AcademicTermAPI from "../../../api/AcademicTermAPI";
import FullScreenLoader from "../../../components/loaders/FullScreenLoader";
import SweetAlert from "react-bootstrap-sweetalert";

export default function SchoolTermTable() {
  const [loading, setLoading] = useState(true);
  const [terms, setTerms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [resetNotify, setResetNotify] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [updateID, setUpdateID] = useState(null);
  const [currentNotify, setCurrentNotify] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getAcademicTerm();
  }, []);

  const getAcademicTerm = async () =>{
    let response = await new AcademicTermAPI().fetchAcademicTerm();
    setLoading(true);
    if(response.ok){
      console.log(response, '--=-=-=-=-=');
      setTerms(response?.data)
    }else{
      toast.error("Something went wrong while fetching all Academic Term")
    }
    setLoading(false);
  }

  

  const submitForm = async (data) => {
    if (selectedTerm != null) {
      const response = await new AcademicTermAPI().updateAcademicTerm(selectedTerm.id, {...data, isCurrentTerm: selectedTerm.isCurrentTerm});
      if(response.ok) {
        toast.success("Successfully Updated Term")
        getAcademicTerm();
        reset()
        setShowForm(false)
        setSelectedTerm(null)
      }else{
        toast.error("Something went wrong while updating the term");
      }
    } else {
      const response = await new AcademicTermAPI().addAcademicTerm({...data, isCurrentTerm: false,});
      if (response.ok) {
        toast.success("Successfully Created Term");
        getAcademicTerm();
        reset();
        setShowForm(false);
      } else {
        toast.error(response.data.errorMessage);
      }
    }
  };

  const deleteTerm = async (id) => {
    setLoading(true);
    setResetNotify(false);
    const response = await new AcademicTermAPI().deleteAcademicTerm(id);
    if (response.ok) {
      toast.success("Successfully Deleted Term");
      getAcademicTerm();
    } else {
      toast.error("Something went wrong while deleting terms");
    }
    setSelectedTerm(null);
    setLoading(false);
  };

  const handleSetCurrentAcademic = async () => {
    const response = await new AcademicTermAPI().setCurrentAcademicTerm(updateID);
    if (response.ok) {
      toast.success("Successfully updated term");
      getAcademicTerm();
      setCurrentNotify(false);
    } else {
      toast.error("Something went wrong while updating current term");
    }
  }

  const handleClickUpdateCurrent = (id) => {
    // alert('sample');
    console.log(id)
    setUpdateID(id);
    setCurrentNotify(true);
  }

  const handleCloseModal = () => {
    setShowForm(false);
    setSelectedTerm(null);
  };

  return (
    <>
      {loading && <FullScreenLoader />}
      <ReactTable
        pageCount={100}
        list={terms}
        filterable
        data={terms}
        columns={[
          {
            Header: "",
            columns: [
              {
                Header: "Current Term",
                id: "term",
                accessor: (d) => d.academicTermName,
                Cell: (row) => (
                  <input type="checkbox" onClick={() => row.original.isCurrentTerm ? '' : handleClickUpdateCurrent(row.original.id)} checked={row.original.isCurrentTerm} name="academicTermName" />
                )
              },

              {
                Header: "Academic Term",
                id: "term",
                accessor: (d) => d.academicTermName,
              },

              {
                Header: "Actions",
                id: "edit",
                accessor: (d) => d.id,
                Cell: (row) => (
                  <div style={{textAlign:'center'}} className=''>
                    <button
                      onClick={() => {
                        setValue('academicTermName', row.original.academicTermName)
                        setValue('description', row.original.description)
                        setSelectedTerm(row.original);
                        setShowForm(true);
                      }}
                      className='btn btn-info btn-sm m-r-5'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTerm(row.original);
                        setResetNotify(true);
                      }}
                      className='btn btn-danger btn-sm m-r-5'
                    >
                      Delete
                    </button>
                  </div>
                ),
              },
            ],
          },
        ]}
        csv
        edited={terms}
        defaultPageSize={10}
        className='-highlight'
      />
      <button
        class='btn btn-primary px-5 mt-3'
        onClick={() => setShowForm(true)}
      >
        Create new term
      </button>
      <SweetAlert
        showCancel
        show={resetNotify}
        onConfirm={() => deleteTerm(selectedTerm.id)}
        confirmBtnText='Confirm'
        confirmBtnBsStyle='danger'
        cancelBtnBsStyle='secondary'
        title='Are you sure to delete this term?'
        onCancel={() => setResetNotify(false)}
      >
      </SweetAlert>
      <SweetAlert
        showCancel
        show={currentNotify}
        onConfirm={() => handleSetCurrentAcademic()}
        confirmBtnText='Confirm'
        confirmBtnBsStyle='danger'
        cancelBtnBsStyle='secondary'
        title='Are you sure to set this to current term?'
        onCancel={() => setCurrentNotify(false)}
      >
      </SweetAlert>
      <Modal size='lg' show={showForm} onHide={() => handleCloseModal()}>
        <form onSubmit={handleSubmit(submitForm)}>
          <Modal.Header className='font-10' closeButton>
            <span className='font-20'>
              {selectedTerm != null
                ? `Update ${selectedTerm.description}`
                : "Create term"}
            </span>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className='col-md-4 m-b-15'>
                <label className='control-label mb-2'>Term name</label>
                  <input
                  {...register("academicTermName", {
                    required: "Term name is required",
                  })}
                  type='text'
                  size='30'
                  className='form-control'
                  placeholder='Enter text here'
                />
                <p className='text-danger'>{errors.academicTermName?.message}</p>
              </div>
              <div className='col-md-4 m-b-15'>
                <label className='control-label mb-2'>Description</label>
                  <input
                  {...register("description", {
                    required: "Term description is required",
                  })}
                  type='text'
                  size='30'
                  className='form-control'
                  placeholder='Enter text here'
                />
                <p className='text-danger'>{errors.description?.message}</p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {selectedTerm != null ? 
                <button type='submit' className='btn btn-primary'>
                Update Term
              </button>  
              :
              <button type='submit' className='btn btn-primary'>
              Save Term
            </button>
            }
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
