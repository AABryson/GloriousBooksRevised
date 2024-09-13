//initiate oauth process
import React, {useContext} from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import ContextObject from './ContextObject'


const GoogleLoginButton = () => {
  const {authToken, setAuthToken} = useContext(ContextObject);
  const{setLoggedIn} = useContext(ContextObject)
  //useGoogleLogin - prewritten function from @react-oauth/google
  //contains get request to google's oauth server; needs evvent to trigger
  //when user completes login process, useGoogleLogin hook automatically triggers function assigned to onSuccess;
  //accepts two argum: onSuccess and onError
  const googleLogin = useGoogleLogin({
    //specifies oauth flow to use; exchange authorization code for access token
    flow: 'auth-code',
    //permissions that are being requested
    scope: 'https://www.googleapis.com/auth/books',
    //onSuccess - key specifies cback function invoked when receive authorization code
    //auth code is in codeReponse object
    //custom made function; if login is successful, the hook calls onSuccess
    //automatically passes codeResponse; cb function b/c it is passed as argument to useGoogleLogin to be executed at a later time
    onSuccess: async (codeResponse) => {
      try {
        // Exchange the authorization code for token with backend
        const response = await axios.post('http://localhost:3001/auth/google', {
          //object sent as part of post request
          code: codeResponse.code,
        });
        console.log('request to auth/googe with code; returned info', response)
        // Handle the tokens received from backend and store in authToken state
        setAuthToken(response.data.access_token);
        setLoggedIn('true')
      } catch (error) {
        console.error('Error exchanging code for tokens:', error);
      }
    },
    //if error, passes errorResponse object
    onError: errorResponse => console.error('Login Error:', errorResponse),
  });
  

  return (
    <button onClick={() => googleLogin()}>
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;