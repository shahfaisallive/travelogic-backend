const AdminControllers = require('../Controllers/AdminControllers')
const express = require('express');
const { protectAdmin } = require('../middleware/auth')

const router = express.Router();


// Create super Admin
router.post('/superadmin', AdminControllers.createSuperAdmin)

// Create Admin
router.post('/', AdminControllers.createAdmin)

// Login Admin
router.post('/login', AdminControllers.adminLogin)

// Get all admins
router.get('/', AdminControllers.getAllAdmins)

// Delete an Admins
router.delete('/:id', AdminControllers.deleteAdmin)

// Logout admin
router.get('/logout', AdminControllers.logoutAdmin)

// Check if admin is logged in
router.get('/isloggedin', AdminControllers.isLoggedIn)


module.exports = router;
