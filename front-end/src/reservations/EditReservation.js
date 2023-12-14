import React from "react";
//TODO: needs call to api to handle changes
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import ReservationForm from "./ReservationForm";
import { readReservation, updateReservation} from "../utils/api";
import { formatAsDate, formatAsTime } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";

function EditReservation(){
// pulls reservation ID from params and uses it for the reservation being edited
    const history = useHistory();
    const {reservationId} = useParams();
    const [reservation, setReservation] = useState({cards:[]})
    const [error, setError] = useState(null);
    
    function fetchReservation() {
        setError(null);
        const abortController = new AbortController();
        readReservation(reservationId, abortController.signal)
        .then(data => setReservation(data))
        .catch(setError);
        return ()=> abortController.abort();
      }

      useEffect(fetchReservation, [reservationId])

      function submitHandler(data){
        setError(null);
        const abortController = new AbortController();
        updateReservation(data)
        .then((data)=>history.push(`/dashboard?date=${data.reservation_date}`))
        .catch(setError);
        return ()=> abortController.abort();
    }

    return (
    <div> 
        <ErrorAlert error={error} />       
        {/* first checks that the reservation is loaded then sends the update call
        and the correct submit text with the formData filled out with the reservation info */}
        {reservation.reservation_id &&
        <ReservationForm 
            onSubmit={submitHandler}
            submitButtonText="Submit"
            initialFormData={{...reservation,
            reservation_time: formatAsTime(reservation.reservation_time),
            reservation_date: formatAsDate(reservation.reservation_date)}}/>
        }
    </div>
    )
}

export default EditReservation;