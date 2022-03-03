const sql = require('mssql/msnodesqlv8');

const config = {
  database: 'OYO',
  server: 'localhost',
  driver: 'msnodesqlv8',
  user:'david',
  password:'ddr3ddr4',
  port:1433,
  options: {
    trustedConnection: true
  }
} 

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
  sql, poolPromise
}

