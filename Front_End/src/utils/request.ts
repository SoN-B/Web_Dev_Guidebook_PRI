import { request } from './axios';

const requestLogin = (email: String, password: String) => {
    return request.post('/login', {
        'email': email,
        'password': password,
})}

const requestRegister = (username: String, email: String, password: String) => {
    return request.post('/register', {
        'username': username,
        'email': email,
        'password': password,
})}

export {
    requestLogin,
    requestRegister,
}