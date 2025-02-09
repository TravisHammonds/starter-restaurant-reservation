import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservation from "../reservations/NewReservation";
import EditReservation from "../reservations/EditReservation";
import NewTable from "../tables/NewTable";
import TableSelection from "../tables/TableSelection";
import Search from "../search/Search";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/new">
        <NewReservation/>
      </Route>
      <Route path = "/reservations/:reservationId/seat">
        <TableSelection />
      </Route>
      <Route path = "/reservations/:reservationId/edit">
        <EditReservation />
      </Route>
      <Route path = "/tables/new">
        <NewTable />
      </Route>
      <Route path = "/search">
        <Search />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;