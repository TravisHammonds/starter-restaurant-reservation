const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
// const tableUpdateValidator = require("../errors/tableUpdateValidator");
const tablesService = require("./tables.service");
const reservationsService= require("../reservations/reservations.service");

async function list(req, res) {    
    const isOpen = req.query.is_open;
    if(isOpen){
        const data = await tablesService.filteredList();
        res.json({ data});
    }else{
    const data = await tablesService.list();
    res.json({ data });
        }
}

async function create(req, res) { 
    const data = await tablesService.create(req.body.data);
    res.status(201).json({ data });
  }

  function read(req, res) {
    const { table: data } = res.locals;
    res.json({ data });
  
  }

  function update(req, res) {
    console.log("Starting update function. Info is: ", res.locals.table, res.locals.reservation);
    if(res.locals.reservation.status === "seated"){
      return res.status(400).send({error: `reservation already has status of ${res.locals.reservation.status}`}) 
    }
    const updatedTable = {
      ...res.locals.table,
      reservation_id: res.locals.reservation.reservation_id,
    };
    console.log("made to update back end. local reservation is: ", res.locals.reservation, "updated table is: ", updatedTable)
    reservationsService.update({...res.locals.reservation, status : "seated"})
      .then((data)=> {console.log("update reservation Data is: ", data);
        return tablesService.update(updatedTable)})
      .then((data)=>{console.log("update Table Data is: ", data);
        return res.status(200).json({ data })});
  }
  
   function removeReservation(req, res) {
    if(!res.locals.table.reservation_id){
      return res.status(400).send({error: `${res.locals.table.table_id} is not occupied`})
    }
    const updatedTable = {
      ...res.locals.table,
      reservation_id: null,
    };
    console.log("made to removal back end. Data is: ", req.body.data)
    reservationsService.update({reservation_id: res.locals.table.reservation_id, status : "finished"})
     .then((data)=>tablesService.update(updatedTable))
     .then((data)=>res.status(200).json({ data }));   
  }
  
  async function reservationExists(req, res, next) {
    console.log("reservationExists data is: ", req.body.data)
    if(!req.body.data.reservation_id){
      next({ status: 400, message: `No reservation_id in req.body.data` })
    }
    const reservation = await reservationsService.read(req.body.data.reservation_id);
    if (!reservation){
      next({ status: 404, message: `reservation ${req.body.data.reservation_id} cannot be found.` });
    }
    res.locals.reservation = reservation;
    console.log("reservationExists is successful");
      return next();
    
  }

async function tableExists(req, res, next) {
    const table = await tablesService.read(req.params.tableId);
    if (!table) {
      next({ status: 404, message: `Table ${req.params.tableId} cannot be found.` });
    }
    res.locals.table = table;
    console.log("tableExists is successful: ", table)
      return next();
    
  }
  
  const VALID_PROPERTIES = [
    "table_id",
    "table_name",
    "capacity",
    "reservation_id"
  ];
  
  function hasOnlyValidProperties(req, res, next) {
    if(!req.body.data)
    {res.status(400).send({error: "data is missing!"})}
    const {data} = req.body;
  
    const invalidFields = Object.keys(data).filter(
      (field) => !VALID_PROPERTIES.includes(field)
    );
  
    if (invalidFields.length) {
      return next({
        status: 400,
        message: `Invalid field(s): ${invalidFields.join(", ")}`,
      });
    }
    next();
  }
  
  const hasRequiredProperties = hasProperties(
    "table_name",  
    "capacity");

    function capacityNumberCheck(req, res, next){
      typeof req.body.data.capacity == 'number' ? next() : next({status: 400, message: 'capacity field must be a number'})
    }

    function nameLengthCheck(req, res, next){
      if(req.body.data.table_name.length <2){
        return next({status: 400, message: 'table_name must be at least 2 characters'})
      }
      next();
    }

    function dataExists(req, res, next){
      if(!req.body.data)
    {return next({status: 400, message: 'data is missing from req.body'})}
    next();
    }

    function tableUpdateValidator(req, res, next) {
          console.log("req body looks like: ", req.body);
          const reservation = res.locals.reservation
          console.log("Controller line 30, reservation set to: ", reservation);
          if(reservation && reservation.people > res.locals.table.capacity){
              return next({status:400, message: "capacity not large enough"});
          }
          if(res.locals.table.reservation_id !== null){
              return next({status:400, message: "table is occupied"});
          }
          next();
          
    }

    

    module.exports = {
        list: asyncErrorBoundary(list),
        create: [hasOnlyValidProperties, 
          hasRequiredProperties, 
          nameLengthCheck,
          capacityNumberCheck,
          create],
        read: [asyncErrorBoundary(tableExists), read],
        update: [dataExists,
           asyncErrorBoundary(tableExists), 
           asyncErrorBoundary(reservationExists), 
           hasOnlyValidProperties, 
           tableUpdateValidator, 
           update],
        delete: [
          asyncErrorBoundary(tableExists),
          removeReservation]
      };