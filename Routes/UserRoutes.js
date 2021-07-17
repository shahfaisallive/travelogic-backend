const express = require ('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/auth')

const UserController = require('../Controllers/UserControllers')

router.post('/', UserController.createUser)
router.put('/password/:id', UserController.updatePassword)
router.put('/upload', UserController.uploadUserPhoto,UserController.uploadProfilePic)
router.put('/:id', UserController.updateUserById)
router.get('/:id', UserController.getUserById)
router.get('/reported/users', UserController.getReportedUsersAdmin)
router.get('/admin/users', UserController.getAllUsersAdmin)
router.delete('/:id', UserController.deleteUserById)
router.post('/login', UserController.logIn)
router.post('/login/google', UserController.logInWithGoogle)
router.get('/email/:token', UserController.emailConfirmation)

module.exports = router;
