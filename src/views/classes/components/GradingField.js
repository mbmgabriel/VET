import React from "react";

export default function GradingField({
  index,
  field,
  setCustomFieldLabel,
  setCustomFieldValue,
  deleteItemByIndex,
  disableDelete
}) {
  return (
    <div className='grading-field' key={index}>
      <div className='grading-field-label'>
        <input
          type='text'
          placeholder='Input label'
          value={field.label}
          onChange={(e) => setCustomFieldLabel(index, e.target.value)}
        />
      </div>
      <div className='grading-field-value'>
        <input
          type='number'
          placeholder='0%'
          value={field.value}
          onChange={(e) => setCustomFieldValue(index, e.target.value)}
        />
      </div>
      <div className={disableDelete ? 'd-none' : ''}>
        <button className="btn btn-danger" onClick={() => deleteItemByIndex(index)}>
        <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
}
