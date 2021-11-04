import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER",
    LOGIN_ERROR: "LOGIN_ERROR",
    LOGOUT: "LOGOUT"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        modal: false,
        message: null
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    modal: false,
                    message: null
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    modal: false,
                    message: null
                })
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    modal: false,
                    message: null
                })
            }
            case AuthActionType.LOGIN_ERROR: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    modal: true,
                    message: payload.errorMessage
                })
            }
            case AuthActionType.LOGOUT: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    modal: false,
                    message: null
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        
        if(response){
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.SET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user
                    }
                });
            }
            else{
                authReducer({
                    type: AuthActionType.LOGIN_ERROR,
                    payload: response.data
                });
            }
        }
    }

    auth.registerUser = async function(userData, store) {
        const response = await api.registerUser(userData);
        if(response){
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
            else{
                authReducer({
                    type: AuthActionType.LOGIN_ERROR,
                    payload: response.data
                });
            }
        }
    }

    auth.loginUser = async function(userData, store) {
        const response = await api.loginUser(userData);
        if(response){
            if(response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
            else{
                authReducer({
                    type: AuthActionType.LOGIN_ERROR,
                    payload: response.data
                });
            }
        }
    }

    auth.logoutUser = async function(userData, store) {
        const response = await api.logoutUser(userData, store);
        console.log(response);
        if(response.status === 200){
            authReducer({
                type: AuthActionType.LOGOUT,
                payload: null
            });
        }
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };