/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

/** List maniputation */
export const createTop5List = (payload) => api.post(`/top5list/`, payload)
.then(response => {
   return response
})
.catch(error => {
   return error.response;
});
export const getAllTop5Lists = () => api.get(`/top5lists/`)
export const getTop5ListPairs = (payload) => api.post(`/top5listpairs/`, payload)
export const updateTop5ListById = (id, payload) => api.put(`/top5list/${id}`, payload)
export const deleteTop5ListById = (id) => api.delete(`/top5list/${id}`)
export const getTop5ListById = (id) => api.get(`/top5list/${id}`)
.then(response => {
   return response
})
.catch(error => {
   return error.response;
});
export const publishList = (payload) => api.put(`/top5listpublish`, payload)
export const getTop5ListExist = (payload) => api.post('/top5listexist', payload)
.then(response => {
   return response
})
.catch(error => {
   return error.response;
});


/** Authentication */
export const getLoggedIn = () => api.get(`/loggedIn/`)
.then(response => {
    return response
 })
 .catch(error => {
    return error.response;
 });
export const registerUser = (payload) => api.post(`/register/`, payload)
.then(response => {
    return response
 })
 .catch(error => {
    return error.response
 });
export const loginUser = (payload) => api.post(`/login/`, payload)
.then(response => {
    return response
 })
 .catch(error => {
    return error.response
 });
export const logoutUser = () => api.get(`/logout/`)
.then(response => {
    return response
 })
 .catch(error => {
    return error.response
 });

const apis = {
   createTop5List,
   getAllTop5Lists,
   getTop5ListPairs,
   updateTop5ListById,
   deleteTop5ListById,
   getTop5ListById,
   getTop5ListExist,
   publishList,
   getLoggedIn,
   registerUser,
   loginUser,
   logoutUser
}

export default apis
