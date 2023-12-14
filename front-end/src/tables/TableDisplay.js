import React from 'react'
import { removeReservation, updateReservationStatus } from '../utils/api';

function TableDisplay({selectedTable, loadDashboard}){

    const finishHandler = ()=>{if(window.confirm("Is this table ready to seat new guests? \n This cannot be undone.")){
        updateReservationStatus(selectedTable.reservation_id, "finished");
        removeReservation(selectedTable.table_id)
        .then(loadDashboard)
        }
    }

    return(
        <div className="col">
            <div className="card w-30">
                <div className="card-header">
                    {`${selectedTable.table_name}`}
                </div>
                <div className="card-body">
                    <h5 className="card-title">{selectedTable.capacity}</h5>
                    <h5 className="card-text" data-table-id-status={selectedTable.table_id}>{selectedTable.reservation_id ? "Occupied" : "Free"}</h5>
                    {selectedTable.reservation_id ? <button data-table-id-finish={selectedTable.table_id} onClick={finishHandler}>Finish</button> : <></>}
                </div>
            </div>
        </div>
    )
}


export default TableDisplay;