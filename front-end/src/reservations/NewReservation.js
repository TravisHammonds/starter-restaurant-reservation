import React, { useState } from "react";
import ReservationForm from "./ReservationForm";
import { createReservation } from "../utils/api";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { formatAsDate } from "../utils/date-time";

function NewReservation(){
    const history = useHistory();
    const [errors, setErrors]= useState(null)
    
    function submitHandler(data){
        const abortController = new AbortController();
        setErrors(null);
        createReservation(data, abortController.signal)
        .then((data)=> history.push(`/dashboard?date=${formatAsDate(data.reservation_date)}`))
        .catch((error)=>setErrors(error))

    return () => abortController.abort();
    }

    return(
    <div>
        <ErrorAlert error={errors} />
        {/* calls the form with blank fields and then uses the createReservation API call on submit */}
        <ReservationForm 
            onSubmit={submitHandler}
            submitButtonText="Submit"
             initialFormData={ {
            first_name: '',
            last_name: '',
            mobile_number: '',
            people: 1,
            reservation_date: '',
            reservation_time: '',
            status: "booked"
            } }/>
    </div>
    )}

export default NewReservation;