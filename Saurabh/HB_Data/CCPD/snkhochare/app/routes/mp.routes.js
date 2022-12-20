const mp = require('../controllers/mp.controller.js');

module.exports = (app) => {

    // Retrieve all nissing persons
    app.get('/mp', mp.findAll);

    //Retrieve the missing person
    app.get('/mp/:id', mp.findOne);

    //Update the missing person is found
    app.post('/mpfound', mp.updateFound);

    //Update the missing person photo
    app.post('/uploadpath', mp.updateOnePhoto);

    //Delete the missing person
    //app.delete('/mp/:id', mp.deleteOne);

    //Create the missing person
    //app.post('/mp', mp.createOne);

}
