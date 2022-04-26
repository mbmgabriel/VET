import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import ReactTable from "react-table-v6";
import "react-table-v6/react-table.css";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import GradeTermAPI from "../../../api/GradeTermAPI";
import FullScreenLoader from "../../../components/loaders/FullScreenLoader";
import SweetAlert from "react-bootstrap-sweetalert";

export default function SchoolTermTable() {
  const [loading, setLoading] = useState(true);
  const [terms, setTerms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [resetNotify, setResetNotify] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    handleGetAllTerms();
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

  const submitForm = async (data) => {
    setLoading(true);
    if (selectedTerm != null) {
      const response = await new GradeTermAPI().updateTerm(selectedTerm.id, data);
      if(response.ok) {
        toast.success("Term updated successful")
        handleGetAllTerms()
        reset()
        setShowForm(false)
        setSelectedTerm(null)
      }else{
        toast.error("Something went wrong while updating the term");
      }
    } else {
      const response = await new GradeTermAPI().createTerm(data);
      if (response.ok) {
        toast.success("Term created successful");
        handleGetAllTerms();
        reset();
        setShowForm(false);
      } else {
        toast.error("Something went wrong while creating the term");
      }
    }
    setLoading(false);
  };

  const deleteTerm = async (id) => {
    setLoading(true);
    setResetNotify(false);
    const response = await new GradeTermAPI().deleteTerm(id);
    if (response.ok) {
      toast.success("Term deleted successful");
      handleGetAllTerms();
    } else {
      toast.error("Something went wrong while deleting terms");
    }
    setSelectedTerm(null);
    setLoading(false);
  };

  const handleCloseModal = () => {
    setShowForm(false);
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
                Header: "Term",
                id: "term",
                accessor: (d) => d.description,
              },

              {
                Header: "Actions",
                id: "edit",
                accessor: (d) => d.id,
                Cell: (row) => (
                  <div className=''>
                    <button
                      onClick={() => {
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
        title='Are you sure?'
        onCancel={() => setResetNotify(false)}
      >
        Are you sure you want to delete this term?
      </SweetAlert>
      <Modal show={showForm} onHide={() => handleCloseModal()}>
        <form onSubmit={handleSubmit(submitForm)}>
          <Modal.Header className='font-10' closeButton>
            <span className='font-20'>
              {selectedTerm != null
                ? `Update ${selectedTerm.description}`
                : "Create term"}
            </span>
          </Modal.Header>
          <Modal.Body>
            <div className='col-md-12 m-b-15'>
              <label className='control-label mb-2'>Term name</label>
              <input
                {...register("description", {
                  required: "Term name is required",
                })}
                type='text'
                size='30'
                className='form-control'
                placeholder='Enter text here'
              />
              <p className='text-danger'>{errors.description?.message}</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type='submit' className='btn btn-primary'>
              Save
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
