const { sql,poolPromise } = require('../services/dbService');
const jwt = require('jsonwebtoken');
const config = require('../config/authConfig');
const res = require('express/lib/response');
const otpGenerator = require('otp-generator');

exports.check = async(table, filed, value) =>{
    try {
        const query = `SELECT * FROM [dbo].[${table}] WHERE ${filed} = '${value}';`
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (error) {
        throw new Error(error);
    }
}
exports.verifyToken = async(token) =>{
    try {
        let tokendata = jwt.verify(token, config.authSecret);
        const pool = await poolPromise;
        const result = await pool.request().query(`SELECT * FROM [dbo].[admin] WHERE email = '${tokendata._id}';`);   
    } catch (error) {
        console.log(error.message);
        return new Error(error.message);
        //throw new JsonWebTokenError(error.message);
        //res.status(400).send('Invalid token !');
    }
}

exports.generateAuthToken = async(id) => {
    return token =jwt.sign({ _id: id}, config.authSecret, {expiresIn: '7 days'});
}

exports.numberFormatter = (value) => {
    return new Intl.NumberFormat().format(value);
}

exports.updateToken = async(table, email, token) => {
    try {
      const query = `UPDATE ${table} SET tokens = '${token}' WHERE email = '${email}';`;
      const pool = await poolPromise;
      const result = await pool.request().query(query);
      if (result.rowsAffected[0] != 1){
        throw new Error('Unable to update a tokens')
      }
    } catch (error) {
      throw new Error(error)
    }
  }

    // options - optional
    // digits - Default: true true value includes digits in OTP
    // lowerCaseAlphabets - Default: true true value includes lowercase alphabets in OTP
    // upperCaseAlphabets - Default: true true value includes uppercase alphabets in OTP
    // specialChars - Default: true true value includes special Characters in OTP
  exports.otpGenerator = () =>{
      try {
        return otpGenerator.generate(6, {specialChars: false });
      } catch (error) {
          throw new Error(error);
      }
  }

  //module.exports = verifyToken;