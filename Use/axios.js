import axios from 'axios'
import qs from 'qs'

// axios 配置
axios.defaults.timeout = 5000;
                                                // application/json;charset=UTF-8
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = '';

//POST传参序列化
axios.interceptors.request.use(config => {
    if (config.method === 'post') {
        config.data = qs.stringify(config.data);
    }
    return config;
}, error => {
    //do something
    return Promise.reject(error);
});

//返回状态判断
axios.interceptors.response.use(res => {
    // if (!res.data.success) {
    //     return Promise.reject(res);
    // }
    return res;
}, error => {
    //do something
    return Promise.reject(error);
});

function fetch(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export { axios, fetch }