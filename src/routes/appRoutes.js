const express = require('express');
const router = new express.Router();
const adminController = require('../controller/adminController')
const ownerController = require('../controller/ownerController')
const authenticateToken = require('../middleware/authTocken');

let routes = (app) => {
    try {
        //Admin: SignUp, signIn, signOut, Create Owner
        //Owner: SignUp, signIn (EmailVerification), signOut, Create, update, delete
        //Hotel: Create, update, delete
        //Rooms: Create, update, delete
        //User: Create, update, delete

        //Admin SignUp
        router.post('/api/v1/oyo/admin/signup', adminController.createAdmin);
        //Admin SignIn
        router.post('/api/v1/oyo/admin/login', adminController.adminLogin);
        //Admin Logout
        router.post('/api/v1/oyo/admin/logout', adminController.adminLogout);
        //Admin: Create owner:
        router.post('/api/v1/oyo/admin/owner', authenticateToken, ownerController.createOwner);
        //Owner Login
        router.post('/api/v1/oyo/owner/login', ownerController.ownerLogin);
        //Logout
        router.post('/api/v1/oyo/owner/logout', ownerController.ownerLogout);
        // router.post('api/v1/oyo/hotel', controller.createHotel);
        // router.post('api/v1/oyo/hotel', controller.createHotel);
        app.use(router);    
    } catch (error) {
        console.log(error);
    }
};

module.exports = routes;