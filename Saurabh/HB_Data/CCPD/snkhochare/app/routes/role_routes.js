const roleCntrl = require('../controllers/role.controller')

module.exports = (app) => {
app.get('/fetchModules', roleCntrl.getModules)
app.get('/fetchTitleModules/:title?/:empId?', roleCntrl.fetchTitleModules)
app.post('/addTitleModule', roleCntrl.addTitleModules)
}