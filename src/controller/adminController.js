const { sql,poolPromise } = require('../services/dbService');
const bcrypt = require('bcryptjs');
const constants = require('../utils/constant');
const util = require('../utils/util');

class MainController {
  async createAdmin(req, res){
    try {
        if(req.body != null) {
          const admin = req.body;
          const email = await util.check('admin','email', admin.email);
          
          if (email.length !== 0) {
            throw new Error (`The given email id is already registered: ${admin.email}`);
          }

          //Hasing User Password
          const password = await bcrypt.hash(admin.password, 8);
          
          const pool = await poolPromise;
          const result = await pool.request()
          .input('name',sql.VarChar , admin.name)
          .input('email',sql.VarChar , admin.email)
          .input('password',sql.VarChar , password)
          .query(constants.ADMIN_INSERT);
          res.send(admin.name + " Details Successfully Added");
        } else {
          res.send('Please fill all the details!')
        }        
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
  }

  async adminLogin(req, res){
    try {
        if(req.body != null) {
          const admin = req.body;
          const emailsList = await util.check('admin','email', admin.email);

          if (emailsList.length == 0 || emailsList.length > 1) {
            console.log('Invalid Email ID or Password!');
            return res.status(400).send('Invalid Email ID or Password!');
          }

          const adminDetails = emailsList[0];
          const password = await bcrypt.compare(admin.password, adminDetails.password);
          if(!password){
            console.log('Invalid Email ID or Password!');
            return res.status(400).send('Invalid Email ID or Password!');
          }

          //Create token and store into admin table
          const token = await util.generateAuthToken(adminDetails.email);
          //updateToken(adminDetails.email, token);
          util.updateToken('admin', adminDetails.email, token);
          
          res.status(200).send({
            "message": `Welcome ${adminDetails.name} `,
            "token": token
          });

        } else {
          res.send('Please fill all the details!');
        }        
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
  }

  async adminLogout(req, res){
    try {
        if(req.body != null) {
          const admin = req.body;
          const query = `UPDATE admin SET tokens = 'NULL' WHERE email = '${admin.email}';`;

          const pool = await poolPromise;
          const result = await pool.request().query(query);
          res.send("You have successfully logged out!");
        } else {
          res.send('Please fill all the details!')
        }        
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
  }
}

const adminController = new MainController();
module.exports = adminController;
