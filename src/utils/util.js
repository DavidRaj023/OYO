const { sql,poolPromise } = require('../services/dbService');
const jwt = require('jsonwebtoken');
const config = require('../config/authConfig');
const res = require('express/lib/response');

exports.check = async(filed, value) => {
    try {
        const query = `SELECT * FROM [dbo].[admin] WHERE ${filed} = '${value}';`
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (error) {
        throw new Error(error);
    }
}

exports.generateAuthToken = async(id) => {
    return token =jwt.sign({ _id: id}, config.authSecret, {expiresIn: '7 days'});
}

exports.verifyToken = async(token) => {
    try {
        console.log(token);
        const tokendata = jwt.verify(token, config.authSecret);
        console.log('After Tokendata');
        const pool = await poolPromise;
        const result = await pool.request().query(`SELECT * FROM [dbo].[admin] WHERE email = '${tokendata._id}';`);   
    } catch (error) {
        console.log('Inside Catch');
        throw Error(error);
    }
    
}
exports.numberFormatter = (value) => {
    return new Intl.NumberFormat().format(value);
}

exports.updateToken = async(email, token) => {
    try {
      const query = `UPDATE admin SET tokens = '${token}' WHERE email = '${email}';`;
      //console.log(query);
      const pool = await poolPromise;
      const result = await pool.request().query(query);
      //console.log(result.rowsAffected[0]);
      if (result.rowsAffected[0] != 1){
        throw new Error('Unable to update a tokens')
      }
    } catch (error) {
      throw new Error(error)
    }
  }