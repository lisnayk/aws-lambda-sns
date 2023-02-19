const md5 = require('md5');
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD
};
const mysql = require('serverless-mysql')({config: dbConfig});
module.exports.handler = async (event) => {
    const date = new Date();
    const result = await mysql.query(
        "INSERT INTO `fire_alarms` \
        (`imei`, `iccid`, `created_by`, `created_at`, `updated_at`) \
        VALUES (?, ?, ?, ?, ?);",
        [
            event.imei ?? 'imai-' + md5(date.getMilliseconds()),
            event.iccid ?? 'iccid-' + md5(date.getMilliseconds()),
            event.created_by ?? 1,
            date.toLocaleDateString(),
            date.toLocaleDateString(),
        ]);
    await mysql.end()
    return result
};