const express = require('express');
const router = express.Router();
const checkRole = require("../middlewares/checkRole");
const { requireAuth } = require('../middlewares/requireAuth');
const { loginAdmin, signupAdmin } = require('../controllers/adminController');
const { fetchAllUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');


// Admin routes
router.post('/login', loginAdmin);
router.post('/signup', signupAdmin);

// Student routes
router.post("/create", createUser);
router.patch("/update/:id", requireAuth, checkRole(["admin"]), updateUser);
router.delete("/delete/:id", requireAuth, checkRole(["admin"]), deleteUser);
router.get("/fetch", requireAuth, checkRole(["admin"]), fetchAllUsers);
module.exports = router;