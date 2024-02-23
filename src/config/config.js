

const config = {
  port: process.env.PORT || 3000,
  dbUser:  process.env.MYSQLUSER,
  dbPassword:  process.env.MYSQLPASSWORD,
  dbHost:  process.env.MYSQLHOST,
  dbName:  process.env.MYSQLDATABASE,
  dbPort:  process.env.MYSQLPORT,
}

export { config }; //se quito el default
