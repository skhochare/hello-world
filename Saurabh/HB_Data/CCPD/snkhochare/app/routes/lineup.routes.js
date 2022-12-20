const lineup = require('../controllers/lineup.controller.js');

module.exports = (app) => {

    // Retrieve all lineup 
    app.get('/lineup', lineup.findAll);

    //Retrieve the lineup except IT
    app.get('/lineup/one/:startDate', lineup.findOne);

    //Retrieve the lineup only IT
    app.get('/lineup/oneIT/:startDate', lineup.findOneIT);

     //Retrieve the lineup specific officer data
    app.get('/lineup/one/:startDate/:off', lineup.findOneOff);

    //Retrieve the lineup group detail except IT
    app.get('/lineup/group/:startDate', lineup.findGroup);

    //Retrieve the lineup group detail only IT
    app.get('/lineup/groupIT/:startDate', lineup.findGroupIT);

    //Retrieve OFF
    app.get('/lineup/off', lineup.findOFF);

    //Retrieve Tag
    app.get('/lineup/tag', lineup.findTag);

    //Retrieve Unit
    app.get('/lineup/unit', lineup.findUnit);

    //Retrieve Equipment
    app.get('/lineup/equipment', lineup.findEquipment);

    //Retrieve Leave
    app.get('/lineup/leave', lineup.findLeave);

    //Retrieve Platoon
    app.get('/lineup/platoon', lineup.findPlatoon);

    //Retrieve Priority
    app.get('/lineup/priority', lineup.findPriority);

    //Retrieve AOR
    app.get('/lineup/aor', lineup.findAOR);

    //Create the new record
    app.post('/lineup/newRecord', lineup.createOne);

    //Delete record
    //app.delete('/lineup/deleteRecord/:id', lineup.deleteOne);
    app.put('/lineup/deleteRecord/:id/:updatedBy', lineup.deleteOne);


    //Copy the records
    app.post('/lineup/copyRecords', lineup.copyAll);

    //Test
    // app.get('/lineup/test', lineup.test);

}