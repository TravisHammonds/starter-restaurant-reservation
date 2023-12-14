import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

function TableForm({initialFormData, onSubmit, submitButtonText}){
    const history = useHistory();
    const [formData, setFormData]=useState(initialFormData);
    
    function handleInput(event){
        if(event.target.name === "capacity"){
            setFormData({
                ...formData,
                [event.target.name]: Number(event.target.value)
            })
        }else{
            setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
        }
    }

    function handleSubmit(event){
        event.preventDefault();   
        onSubmit(formData)           
    }

    return (
        <div className="w-100">
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                <label htmlFor="table_name">
                    Table Name
                </label>
                <input 
                    type="text" 
                    className="form-control" 
                    id="table_name" 
                    name="table_name" 
                    onChange={handleInput}
                    value={formData.table_name}
                    placeholder="e.g. bar #3"
                    required />
                </div>
                <div className="form-group">
                <label htmlFor="capacity">
                    Capacity
                </label>
                <input 
                    type="number" 
                    className="form-control"
                    id="capacity" 
                    name="capacity" 
                    min="1"
                    onChange={handleInput}
                    value={formData.capacity}
                    // placeholder="one"
                    required  />
                </div>
                <button type="submit" className="btn btn-primary mr-3">{submitButtonText}</button>
                <button type="button" className="btn btn-secondary mr-3" onClick={()=>history.goBack()}>Cancel</button>
            </form>
        </div>
    )
}

export default TableForm;
