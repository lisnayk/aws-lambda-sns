/**
 * parseDeviceStatus
 * @param str
 * @return {{network_id: number, network_type: string, signal: number}}
 */
module.exports.parseDeviceStatus = (str) => {
    const regex = /^.*:(\s\d+\s).*:(\d+).*:(\w+).*$/gm;
    let response = {
        signal: 0,
        network_id: 0,
        network_type: "unknown"
    };
    let m;
    while ((m = regex.exec(str)) !== null) {
        response.signal = m[1].trim();
        response.network_id = m[2].trim();
        response.network_type = m[3].trim();
    }
    return response;
}