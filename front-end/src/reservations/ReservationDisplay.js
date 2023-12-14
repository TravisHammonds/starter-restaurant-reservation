import React from 'react'
import {  updateReservationStatus } from '../utils/api';
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom';
import { formatAsTime } from '../utils/date-time';



function ReservationDisplay({selectedReservation, setStatus, statusArray}){
    const history = useHistory();
    const reservationDeleteHandler = ()=>{if(window.confirm("Do you want to cancel this reservation?\n This cannot be undone.")){
        updateReservationStatus(selectedReservation.reservation_id, "cancelled")
        .then((res)=> history.push('/') )
    }}

    
    return(
        <div className="col">
            <div className="card w-30">
                <div className="card-header">
                    <h5 className="float-left">{`${selectedReservation.first_name} ${selectedReservation.last_name}`}</h5>
                    <h5 className="float-right" data-reservation-id-status={selectedReservation.reservation_id}>{selectedReservation.status}</h5>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Party of {selectedReservation.people}</h5>
                    <p className="card-text">{selectedReservation.reservation_date}</p>
                    <p className="card-text">{formatAsTime(selectedReservation.reservation_time)}</p>
                    <button type="button" className="btn btn-danger float-right ml-2" data-reservation-id-cancel={selectedReservation.reservation_id} onClick = {reservationDeleteHandler}>Cancel</button>
                    <Link to={`/reservations/${selectedReservation.reservation_id}/edit`} className= "btn btn-secondary float-right">Edit</Link>
                    {selectedReservation.status === "booked" ? <Link to={`/reservations/${selectedReservation.reservation_id}/seat`} className= "btn btn-primary float-left">Seat</Link> : <></>}
                    
                </div>
            </div>
        </div>
        )
}

export default ReservationDisplay;