const validator = require('validator');


function validatorFor(property) {

    return function (req, res, next){
    if(property == "reservation_date"){
        const reservationDate = new Date(`${req.body.data[property]}T${req.body.data.reservation_time}`);
        console.log("reservation date is: ", reservationDate, "new Date looks like: ", new Date())
        if (reservationDate < new Date()) {
            return res.status(400).send({ error: 'reservation_date should be in the future' })
          }
        const givenDay = new Date(req.body.data[property]).getUTCDay();
        console.log("givenDay in validator: ", givenDay);
        if(givenDay===2){
            return res.status(400).send({ error: 'Business is closed on Tuesdays' })
            }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        dateRegex.test(req.body.data[property]) ? next() : res.status(400).send({ error: 'reservation_date should be in correct format' })
    }

    if(property == "reservation_time"){
        const reservationTime = req.body.data[property]
        if(validator.isTime(reservationTime)){
            const timeArray = reservationTime.split(":");
            console.log("timeArray is: ", timeArray);
            const timeNumber = Number(timeArray.join(''));
            console.log("timeNumber is: ", timeNumber);
            if(timeNumber > 1030 && timeNumber < 2130){
                next()}
            else{
               return res.status(400).send({ error: 'reservation_time should be between 10:30am and 9:30pm' })  
            }
        }else{
       return res.status(400).send({ error: 'reservation_time should be in correct format' })} 
    }

    if(property == "people"){
        typeof req.body.data[property] == 'number' ? next() : next({status: 400, message: 'people field must be a number'})
    }

    if(property == "status"){
        req.body.data[property] === "booked" ? next() : next({status: 400, message: `${req.body.data[property]} is not a valid POST status`})
    }
}
}

module.exports = validatorFor;