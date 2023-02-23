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
    const data = JSON.parse(event.Records[0].Sns.Message);
    let result = "Nothing to insert";
    if (await isDeviceExist(data.device.id)) {
        result = await insertEvent(data);
    }
    await mysql.end()
    return result;
};

/**
 * isDeviceExist
 * @param deviceId
 * @return {Promise<*>}
 */
async function isDeviceExist(deviceId) {
    const result = await mysql.query("SELECT id, device_id FROM `easyset_devices` WHERE `device_id` =  ?;", [deviceId]);
    return result.length;
}

/**
 * insertEvent
 * @param event
 * @return {Promise<unknown>}
 */
function insertEvent(event) {
    return mysql.query(
        "INSERT INTO `easyset_device_logs`\
            (`device_id`,`event_type`,`time`,`output`,`extra_info`)\
        VALUES (?,?,?,?,?);",
        [
            event.device.id,
            event.payload.event_name ?? null,
            event.payload.time ?? null,
            event.payload.output ?? null,
            event.payload.extra_info ?? null,
        ]
    );
}