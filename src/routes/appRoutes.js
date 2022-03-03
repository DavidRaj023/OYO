const express = require('express');
const router = new express.Router();
const controller = require('../controller/appController')

let routes = (app) => {
    try {
        //Admin: SignUp, signIn, signOut, Create Owner
        //Owner: SignUp (EmailVerification), signIn, signOut, update, delete
        //Hotel: Create, update, delete
        //Rooms: Create, update, delete
        //User: Create, update, delete

        //Admin SignUp
        router.post('/api/v1/oyo/admin/signup', controller.createAdmin);
        //Admin SignIn
        router.post('/api/v1/oyo/admin/login', controller.adminLogin);
        //Admin Logout
        //router.post('/api/v1/oyo/admin/logout', controller.adminLogout);

        //Admin: Create owner:
        router.post('/api/v1/oyo/admin/owner', controller.createOwner);
        // router.post('api/v1/oyo/owner/login', controller.ownerLogin);
        // router.post('api/v1/oyo/owner/logout', controller.ownerLogout);
        // router.post('api/v1/oyo/hotel', controller.createHotel);
        // router.post('api/v1/oyo/hotel', controller.createHotel);
        app.use(router);    
    } catch (error) {
        console.log(error);
    }
};

module.exports = routes;