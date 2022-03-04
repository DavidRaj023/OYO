const { sql,poolPromise } = require('../services/dbService');
const bcrypt = require('bcryptjs');
const sendgrid = require('../utils/emailService');
const constants = require('../utils/constant');
const util = require('../utils/util');

class MainController {
  async createOwner(req, res){
    try {
        const tokenFromAPI = req.headers.authtoken;
        const pool = await poolPromise;
        const tokens = await pool.request().query(`SELECT tokens from admin WHERE email = '${req.user._id}'`);
        const tokenFromDB = tokens.recordset[0].tokens;

        if(tokenFromAPI != tokenFromDB) throw new Error('Access Denied');

      if(req.body != null) {
        const owner = req.body;
        const email = await util.check('owner','email', owner.email);     
        if (email.length !== 0) {
          throw new Error (`The given email id is already registered: ${owner.email}`);
        }

        const userName = await util.check('owner','userName', owner.userName);     
        if (userName.length !== 0) {
          throw new Error (`Given username is taken, Please try different username.`);
        }

        const password = await bcrypt.hash(owner.password, 8);
        const pool = await poolPromise;
        const result = await pool.request()
        .input('name',sql.VarChar , owner.name)
        .input('email',sql.VarChar , owner.email)
        .input('phoneNumber',sql.Int , owner.phoneNumber)
        .input('userName',sql.VarChar , owner.userName)
        .input('password',sql.VarChar , password)
        .input('hotels',sql.VarChar , owner.hotels)
        .query(constants.OWNER_INSERT);
        res.send(owner.name + " Details Successfully Added");
      } else {
        res.send('Please fill all the details!');
      }        
    } catch (error) {
        console.log(error.message);
        res.status(400).send(error.message);
    }
  }

  async ownerLogin(req, res){
    if(req.body != null){
      const pool = await poolPromise;
      if(!req.body.otp){
        const result = await pool.request().query(`SELECT * FROM OWNER WHERE userName = '${req.body.userName}'`);
        const user = result.recordset[0];
        
        //Generate OTP
        const otp = util.otpGenerator();
        //To Send mail
        sendgrid(user, otp);
        
        await pool.request().query(`UPDATE owner SET otp = '${otp}' WHERE userName = '${req.body.userName}'`);

        return res.status(200).send('Enter 6 digit secret code sent via your registered email');
      }
      
      const result = await pool.request().query(`SELECT * FROM OWNER WHERE userName = '${req.body.userName}'`);
      const owner = result.recordset[0]
      if(owner.otp != req.body.otp) return res.status(400).send("Wrong secret code");
      
      //Create token and store into admin table
      const token = await util.generateAuthToken(owner.email);
      //updateToken(adminDetails.email, token);
      util.updateToken('owner', owner.email, token);
      
      res.status(200).send({
        "message": "Successfully logged in",
        "token": token
      });
    } else {
      res.send('Please fill the details!');
    }    
  }

  async ownerLogout(req, res){
    try {
        if(req.body != null) {
          const owner = req.body;
          const query = `UPDATE owner SET tokens = 'NULL' WHERE userName = '${owner.userName}';`;

          const pool = await poolPromise;
          const result = await pool.request().query(query);
          res.send("You have successfully logged out!");
        } else {
          res.status(400);
        }        
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
  }
}

const ownerController = new MainController();
module.exports = ownerController;
