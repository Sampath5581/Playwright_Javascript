// This is an expandable file.

const projectConfig = {

  APP_NAME: 'PULSE', // Enter the name of the application you are performing tests.

  APP_ENV: 'REC', // Enter the environment you are testing.

  APP_ID: 354, // Enter the application ID (Integer)- Can be access from https://devopsportal.cbre.com/

  // Please enter the Application ID as an integer (Remove quotes - Eg: 1234 or 123)

  APM_ID : 660788, // Enter the APMID of the application you are testing.

  // Please enter the APM ID as an integer (Remove quotes - Eg: 1234 or 123)

  SEND_EMAIL: true, // Takes in boolean value - true to send / false to not send email.

  SEND_METRICS: true, // Takes in boolean value true to send / false to not send post metrics to DevOps Portal

  MAIL_LIST: 'sampath.golyala@cbre.com', // Enter the list of email ids you want to send the Playwright Report to. Separate multiple email ids using a comma (inside the quotes).

 

  //--------------------APPLICATION URLs--------------------

  DEV_URL: 'https://pulse-test.cbre.com',

  UAT_URL: 'https://uat.devx.cbre.com',

  INTERNAL_URL:'https://internal.devx.cbre.com',

  PROD_URL: 'https://devx.cbre.com',

   

 

  //--------------------DATABASE--------------------

  DB_CONNECTION: 'postgres_pulse_rec',

  DB_DRIVER: 'postgres',

  DB_HOST: 'pulse-db-nonprod.cbre.com',

  DB_PORT: '5432', // Please enter the port number as an integer (Remove quotes - Eg: 1234)

  DB_NAME: 'pulse_app_db_rec',

  DB_USERNAME: 'pul_rec_auto_db_usr',

  DB_PASSWORD: 'Paud#US!01$#@Vd!',

  DB_SCHEMA: 'dbo',

  // DB_PASSWORD: 'Hello',

 

  //--------------------DB-QUERIES--------------------

  QUERY1: `SELECT * FROM DB.DBName`, //Example

  QUERY2: `select * from DBName where ColumnName like '%ABC%'`, //Example

  COLUMN_NAME: 'ColumnName', //Example

 

  //--------------------Other--------------------

  key1: 'Value1',

  key2: 'Value2' //You can add any Key-value pairs and configure them as needed.

}

module.exports = { projectConfig };