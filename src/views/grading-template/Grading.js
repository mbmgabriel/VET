import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { UserContext } from "../../context/UserContext";
import MainContainer from "../../components/layouts/MainContainer";
import { Col, Row } from "react-bootstrap";
import { Doughnut, Line } from "react-chartjs-2";
import { toast } from "react-toastify";

export default function Grading() {
  const userContext = useContext(UserContext);
  const [exam, setExam] = useState()
  const [assignment, setAssignment] = useState()
  const [tasks, setTasks] = useState()
  const [customFields, setCustomFields] = useState([])

  const { user } = userContext.data;

  const total = parseFloat(exam || "0") + parseFloat(assignment || "0") + parseFloat(tasks || "0") + parseFloat(customFields.reduce((acc, cur) => acc + parseFloat(cur.value || "0"), 0) || "0")

  const setCustomFieldLabel = (index, label) => {
      const newCustomFields = [...customFields]
      newCustomFields[index].label = label
      setCustomFields(newCustomFields)
  }
  
  const setCustomFieldValue = (index, value) => {
    if(value.length < 3) {
      const newCustomFields = [...customFields]
      newCustomFields[index].value = value
      setCustomFields(newCustomFields)
    }
  }

  if (user.isSchoolAdmin) {
    return (
      <MainContainer title='Grading System' activeHeader={"grading"}>
        <div className='rounded-white-container mt-4'>
          <h2 className='primary-color '>Grading Component Template</h2>
          <Row className='mt-4'>
          <Col className='' sm={6} lg={4}>
              <div className='grading-field'>
                <div className='grading-field-label'>Exam</div>
                <div className='grading-field-value'>
                  <input type='number' placeholder="0%" value={exam} onChange={e => e.target.value.length < 3 && setExam(e.target.value)} />
                </div>
              </div>
              <div className='grading-field'>
                <div className='grading-field-label'>Assignment</div>
                <div className='grading-field-value'>
                  <input type='number' placeholder="0%" value={assignment} onChange={e => e.target.value.length < 3 && setAssignment(e.target.value)} />
                </div>
              </div>
              <div className='grading-field'>
                <div className='grading-field-label'>Tasks</div>
                <div className='grading-field-value '>
                  <input type='number' placeholder="0%" value={tasks} onChange={e => e.target.value.length < 3 && setTasks(e.target.value)} />
                </div>
              </div>

              {customFields.map((field, index) => {
                
                return (
                  <div className='grading-field' key={index}>
                    <div className='grading-field-label'>
                    <input type='text' placeholder="Input label" value={field.label} onChange={(e) => setCustomFieldLabel(index, e.target.value)}  />

                    </div>
                    <div className='grading-field-value'>
                      <input type='number' placeholder="0%" value={field.value} onChange={(e) => setCustomFieldValue(index, e.target.value)} />
                    </div>
                  </div>
                )
              })}
              <div className='grading-field'>
                <div className='grading-field-button' onClick={() => setCustomFields(prev => [...prev, {label: '', value: ''}])}>+ Add</div>
                <div className='grading-field-value bg-white' style={{flex: 1}}/>
              </div>
            </Col>
            <Col className='' sm={6} lg={4}>
              <div className='grading-field'>
                <div className='grading-field-label'>Total</div>
                <div className='grading-field-value'>
                  <input type='text' value={`${total}%`} readOnly />
                </div>
              </div>
              
            </Col>
          </Row>
          <div style={{textAlign: 'right'}}>
            <button className="btn btn-primary btn-lg grading-next-btn" onClick={() => {
              if(total != 100){
                toast.error("Total must be 100%")
              }else{
                toast.success("Under development")
              }
            }}>Save</button>
          </div>
        </div>
      </MainContainer>
    );
  }

  return <Redirect to='/404' />;
}
