const { ONESIGNAL_APP_ID, REST_API_KEY } = require('./config')
const axios = require('axios');

const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": `Basic ${REST_API_KEY}`
};
let url = 'https://onesignal.com/'

const sendNotifications = (params) =>{
    params.app_id = ONESIGNAL_APP_ID 
    return axios({
        method: 'post',
        url: url+"api/v1/notifications",
        headers,
        data: params
    })
}

module.exports = {
    sendNotifications
}