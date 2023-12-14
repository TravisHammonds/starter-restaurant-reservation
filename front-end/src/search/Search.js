import React, {useState} from 'react'
import { searchReservations } from '../utils/api';
import ReservationDisplay from '../reservations/ReservationDisplay';


function Search() {

    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([])

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
      };

    function handleSubmit(event){
        event.preventDefault();
        searchReservations(searchInput)
        .then((data)=> setSearchResults(data))
    }
    
  return (<div>
            <div className = "d-flex">
                <form onSubmit={handleSubmit}>
                    <input
                        type="search" 
                        name="mobile_number"
                        // pattern="^-?[0-9]\d*\.?\d*$"
                        placeholder="Enter a customer's phone number"
                        onChange={handleChange}
                        value={searchInput} />
                    <button type="submit" className="btn btn-primary mr-3">Search</button>
                </form>
                
        </div>
        <div className = "row row-cols-1 row-cols-md-3">
            {searchResults.length ?
        searchResults.map((reservation) => {return <ReservationDisplay selectedReservation = {reservation} key = {reservation.reservation_id}/>}) : <h5>No reservations found</h5>}
        </div>
   </div>
  )
}

export default Search