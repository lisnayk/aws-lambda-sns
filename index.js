require('dotenv').config()
const mysql = require('mysql2');
const md5 = require('md5');
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD
}
const connection = mysql.createConnection(dbConfig);

module.exports.handler = (event, context, callback) => {
    // allows for using callbacks as finish/error-handlers
    context.callbackWaitsForEmptyEventLoop = false;

    const date = new Date();
    const result = connection.execute(
        "INSERT INTO `fire_alarms` \
        (`imei`, `iccid`, `created_by`, `created_at`, `updated_at`) \
        VALUES (?, ?, ?, ?, ?);",
        [
            event.imei ?? 'imai-' + md5(date.getMilliseconds()),
            event.iccid ?? 'iccid-' + md5(date.getMilliseconds()),
            event.created_by ?? 1,
            date.toLocaleDateString(),
            date.toLocaleDateString(),
        ], function (err, results) {
            if (err) {
                throw err
            }
            callback(null, results);
        });
};