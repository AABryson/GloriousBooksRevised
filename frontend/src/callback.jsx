// //handles redirect from oauth server
// import React, { useEffect, useContext } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import ContextObject from './ContextObject';

// const Callback = () => {
//   const {loggedIn, setLoggedIn} = useContext(ContextObject)
//   //built in method that finds the location object which has property .search to access query string content
//   const location = useLocation();
//   useEffect(() => {
//     // Extract authorization code from query string; location.search holds the query string
//     const params = new URLSearchParams(location.search);
//     //extracts value of code param from query string
//     const code = params.get('code');

//     // Send code to backend for tokens
//     if (code) {
//       axios.post('http://localhost:3001/auth/google', { code })
//         .then(response => {
//           // Handle tokens, save them, etc.
//           console.log('Tokens:', response.data);
//         })
//         .catch(error => {
//           console.error('Error exchanging code for tokens:', error);
//         });
//     }
//     setLoggedIn('true')
//   }, [location]);

  
  

//   return <div>Loading...</div>;
// };

// export default Callback;
