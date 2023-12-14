import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationDisplay from "../reservations/ReservationDisplay";
import { next, previous, today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import TableDisplay from "../tables/TableDisplay";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [currentDate, setCurrentDate] = useState(date);
  date = currentDate;

  const history = useHistory();


  const query = useQuery();
 const queryDate = query.get("date")
 console.log("queryDate is: ", queryDate)
 
 useEffect(()=>{
  if(queryDate){
    setCurrentDate(queryDate)
  }
 }, [queryDate])

  useEffect(loadDashboard, [date, currentDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({date}, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
      console.log("currentDate variable: ", currentDate)
      
    return () => abortController.abort();
  }


  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div className = "row row-cols-1 row-cols-md-3">
      <button onClick={()=>history.push(`/dashboard?date=${previous(currentDate)}`)} className="btn btn-secondary">Previous Day</button>
      <button onClick={()=>history.push(`/dashboard?date=${today()}`)} className="btn btn-primary">Today</button>
      <button onClick={()=>history.push(`/dashboard?date=${next(currentDate)}`)} className="btn btn-secondary">Next Day</button>
      {reservations.map((reservation) => {return <ReservationDisplay selectedReservation = {reservation} key = {reservation.reservation_id}/>})}
      </div>
      
      <br/>
      <ErrorAlert error={tablesError} />
      <div className = "row row-cols-1 row-cols-md-3">
        {tables.map((table) => {return <TableDisplay selectedTable={table} loadDashboard = {loadDashboard} key = {table.table_id}/>})}
      </div>
    </main>
  );
}

export default Dashboard;