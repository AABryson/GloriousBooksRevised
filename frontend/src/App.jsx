//Checked
import React, {useState} from 'react'
import {Routes, Route} from 'react-router-dom'
import ContextObject from './ContextObject'
import NavBar from './NavBar'
import HomePage1 from './HomePage1'
import SearchBookshelves from './library'
import UserBooks from './UserBooks'
// import Callback from './callback'
import GoogleLoginButton from './GoogleLoginButton.jsx' 
// import Signup from './credentials/Signup'
// import Login from './credentials/Login'
import Search from './Search.jsx'

function App() {

  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [user, setUser] = useState('')
  const [authToken, setAuthToken] = useState('')
  const [shelves, setShelves] = useState([])
  const [books, setBooks] = useState([])
  const [loggedIn, setLoggedIn] = useState('');
  
  
  return (
    <div className='container-fluid p-0'>

      <ContextObject.Provider value={{author, setAuthor, title, setTitle, subject, setSubject, user, setUser, authToken, setAuthToken, shelves, setShelves, books, setBooks, loggedIn, setLoggedIn}}>
        <NavBar />
        <Routes>
          <Route path='/' element={<HomePage1 />} />
          <Route path='/search/:type' element={<Search />} />
          <Route path='/library' element={<SearchBookshelves />} />
          <Route path='/books/:id' element={<UserBooks />} />
          {/* <Route path='/signup' element={<Signup />}  />
          <Route path='/login' element={<Login />} /> */}
          {/* <Route path='/callback' element={<Callback />} /> */}
          <Route path='/googlelogin' element={<GoogleLoginButton />} />
        </Routes>
      </ContextObject.Provider>

    </div>
  )
}

export default App
