const express = require("express");
const router = express.Router();
const handgunCtrl = require("../controllers/handgun.controller");

router.get(`/get-list/:includeNotAvailable?/:includeDeleted?`, handgunCtrl.getList);
router.get(`/get-list-by-employee/:id/:equipmenttypeid`, handgunCtrl.getListByEmployeeAndEquipementType);
router.get(`/get-list-by-employee/:id`, handgunCtrl.getListByEmployee);
router.get(`/:id`, handgunCtrl.getGun);

router.post(`/filter`, handgunCtrl.fetchGuns);
router.post(`/`, handgunCtrl.addGun);
router.post(`/serial_number_unique`, handgunCtrl.serialNumberUnique);

router.put(`/:id`, handgunCtrl.updateGun);
router.put(`/delete/:id`, handgunCtrl.softDeleteGun);
router.put(`/revert/:id`, handgunCtrl.revertDeleteGun);
//revert_equipmenttype
router.put(`/revert_equipmenttype/:id`, handgunCtrl.revertEquipmentType);
router.post(`/addEquipment`, handgunCtrl.addEquipment);
router.post(`/updateEquipment`, handgunCtrl.updateEquipment);
//get euipmentDetail
router.get(`/getEquipment/:id`, handgunCtrl.getEquipmentDetail);
router.put(`/eqpdelete/:id`, handgunCtrl.eqpdelete);
//getAllEquipmentDetail
router.get(`/equipment/equipmentTypes`, handgunCtrl.getAllEquipmentDetail);
//getAllEquipmentDetailAll get all with inactive
router.get(`/equipment/equipmentTypesAll`, handgunCtrl.getAllEquipmentDetailAll);
module.exports = router;
