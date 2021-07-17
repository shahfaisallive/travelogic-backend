const asyncHandler = require('express-async-handler')
const Admin = require('../Models/Admin')
const HttpError = require('../Models/HttpError');
const jwt = require('jsonwebtoken');


// Create Admin
const createSuperAdmin = asyncHandler(async (req, res, next) => {
    const { name, username, password } = req.body

    let token;

    let admin = await Admin.findOne({ isSuperAdmin: true })
    if (admin) {
        const error = new HttpError('Super Admin already registered. There can be only one superAdmin', 500);
        return next(error);
    } else {
        try {
            admin = Admin()
            admin.name = name
            admin.username = username
            admin.password = password
            admin.isSuperAdmin = true
            token = admin.getToken()
            await admin.save()
        }
        catch (err) {
            const error = new HttpError('Creating Admin Failed', 500);
            return next(error);
        }

        res.json({
            _id: admin._id,
            name: admin.name,
            username: admin.username,
            isSuperAdmin: admin.isSuperAdmin,
            token: token
        })
    }
})



// Admin Login
const adminLogin = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body

    const admin = await Admin.findOne({ username })

    const token = await admin.getToken()

    if (admin && (await admin.matchPassword(password))) {
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 3600000 })
        res.json({
            message: "Admin logged in"
        })
    } else {
        res.status(401)
        throw new Error('Invalid username or password')
    }
})


//   Create secondary Admins
const createAdmin = asyncHandler(async (req, res, next) => {
    const { name, username, password } = req.body

    let token;

    let admin = await Admin.findOne({ username: username })
    if (admin) {
        const error = new HttpError('An admin is already registered on this username, try another username', 500);
        return next(error);
        // } else if (!req.admin.isSuperAdmin) {
        //     const error = new HttpError('Only a super admin can create new admins', 500);
        // console.log(error)
        //     return next(error);
    } else {
        try {
            admin = Admin()
            admin.name = name
            admin.username = username
            admin.password = password
            token = admin.getToken()
            await admin.save()
        }
        catch (err) {
            const error = new HttpError('Creating Admin Failed', 500);
            return next(error);
        }

        res.json({
            _id: admin._id,
            name: admin.name,
            username: admin.username,
            isSuperAdmin: admin.isSuperAdmin,
            token: token
        })
    }
})


// Get all admins
const getAllAdmins = asyncHandler(async (req, res, next) => {
    let admins;
    try {
        admins = await Admin.find();
    } catch (err) {
        const error = new HttpError('Unknown error occured while getting admins, please try again.', 500);
        return next(error);
    }
    res.send(admins);
})


// Delete admin
const deleteAdmin = async (req, res, next) => {
    const adminId = req.params.id;
    let admin;
    try {
        admin = await Admin.findById(adminId);
    } catch (err) {
        const error = new HttpError('Unknown error occured while deleting Admin, please try again.', 500);
        return next(error);
    }

    try {
        await admin.remove();
    } catch (err) {
        const error = new HttpError('Unknown error occured while deleting admin, please try again.', 500);
        return next(error);
    }

    res.status(200).json({ message: 'Admin has been deleted' });
}


// Logout admin
const logoutAdmin = async (req, res) => {
    // const options = {
    //     expires: new Date(0),
    //     httpOnly: true,
    //     secure: false,
    //     sameSite: 'none'
    // };
    // res.cookie("token", "expiredtoken", options);
    res.cookie('token', "expiredtoken", { httpOnly: true, secure: true, sameSite: "none", maxAge: 1 })
    res.status(200).json({ status: "success logging out" });
};


//   Check if admin is logged in
const isLoggedIn = async (req, res) => {
    const token = req.cookies.token;
    // const error = new HttpError(token, 500);
    // return next(error);
    try {
        if (!token) return res.json(false);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.send({decoded,token})

    } catch (err) {
        res.send(false)
    }
}



module.exports.createSuperAdmin = createSuperAdmin
module.exports.createAdmin = createAdmin
module.exports.adminLogin = adminLogin
module.exports.deleteAdmin = deleteAdmin
module.exports.logoutAdmin = logoutAdmin
module.exports.isLoggedIn = isLoggedIn
module.exports.getAllAdmins = getAllAdmins
