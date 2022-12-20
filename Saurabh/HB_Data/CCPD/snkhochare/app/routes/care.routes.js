const care = require('../controllers/care.controller.js');

module.exports = (app) => {

    // Retrieve all employees
    app.get('/fleet', fleet.findAll);
   
    app.post('/fleet/update_car', fleet.updateCarDetail);

    app.post('/fleet/update_assignment', fleet.updateAssignmentDetail);
   
    //Retrieve the employee
    app.get('/fleet/:id', fleet.findOne);
    app.get('/fleet/getPhotos/:id', fleet.findVehiclePhotos);

    
}
