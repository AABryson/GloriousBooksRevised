
import React, { useState, useContext } from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import ContextObject from './ContextObject'
import './Search.css';

function Search() {
    //several states from App.jsx
    //the token that is stored after oauth2 process
    const { author, setAuthor, title, setTitle, subject, setSubject, authToken, loggedIn } = useContext(ContextObject)
    const [input, setInput] = useState('')
    const [addingBook, setAddingBook] = useState(false)

    const { type } = useParams()
    console.log('param from path', type)
    {/*NEW **/}
    // let base_url = process.env.BASE_URL;
    // let api_key = process.env.API_KEY;
    let BASE_URL = 'https://www.googleapis.com/books/v1/volumes?q='
    //The key that google uses to identify the application
    const apiKey = 'AIzaSyBJo7SCNGuT27ZbgzdgO0R9t-UT4nrERsA';
    
    function showMainTitle (type) {
        if(type === 'Author' && !author) {
            return <h3 className='pt-4' id='searchText'>Search by {type}</h3>
        } else if (type === 'Title' && !title) {
            return <h3 className='pt-4' id='searchText'>Search by {type}</h3>
        } else if (type === 'Subject' && !subject) {
            return <h3 className='pt-4' id='searchText'>Search by {type}</h3>
        }
    }

    let querytype;
    let setState;

    async function handleSubmit(evt) {
        evt.preventDefault()
        if(type === 'Author') {
            querytype = 'inauthor'
            setState = setAuthor
        } else if (type === 'Title') {
            querytype = 'intitle'
            setState = setTitle
        } else if (type === 'Subject') {
            querytype = 'subject'
            setState = setSubject
        }
        const query = `${querytype}:${input}`;
        //only 40 books can be returned
        {/*NEW **/}
        // let response = await axios.get(`${base_url}${query}&maxResults=40&key=${api_key}`)
        let response = await axios.get(`${BASE_URL}${query}&maxResults=40&key=${apiKey}`)

        //sets author/title/subject state with array of objects containing individual book information
        console.log('return from handleSubmit', response.data.items)

        setState(response.data.items)
        
        setInput('')  
    }
    //each time a user types text into the search bar, it is set to the input state
    
    function handleChange(evt) {
        //target is element that triggered event; value is the current value of the element
        let value = evt.target.value
        setInput(value)
    }
    //function for adding books to the user's bookshelves
    async function handleAddTo(id, authToken, num) {
        //check if addingBook is populated;
        if (addingBook) return; 
        //set state to show adding a book
        setAddingBook(true); 
        //include id of the bookshelf to be added to and id of book
        //axios.post(url, data, config)
        try {
            const response = await axios.post(
                `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${num}/addVolume?volumeId=${id}`,
                //the request body
                {},
                {
                //request headers
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                }
            );
        //built in js error object
        } catch(error) {
            console.error('Error adding book:', error);
        //code executed regardless of whether try or catch block executed
        } finally {
            setAddingBook(false); 
        }
    }
    //creates an individual card for each book returned; shows pertinent information
    //'items' is an array of objects
    function renderInfo(items) {
        //run callback function on each element and extract info for card
        return items.map((item, index) => (
            <div className='card text-start ms-5 me-5' style={{ backgroundColor: 'rgb(242, 242, 242, 0.7)', marginBottom: '12px', width:'92%' }} key={index}>
                <div className='card-body col-12'>
                    <h4 className='card-title' id='cardTitle'>{item.volumeInfo.title}</h4>
                    <h5 className='card-title' id='cardTitle'>{item.volumeInfo.subtitle}</h5>
                    <h5 className='card-subtitle mb-2' id='cardSubTitle'>{item.volumeInfo.authors}</h5>

                    <div className='row'>
                        <div className='col-xs-12 col-sm-9 mx-3' style={{borderLeft: 'solid black 2px'}}>
                            <p className='card-text' >{item.volumeInfo.description}</p>
                        </div>
                        <div className='col-xs-12 col-sm-2 text-center'>
                            {item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail ? (
                                <img src={item.volumeInfo.imageLinks.thumbnail} alt="Thumbnail" />
                            ) : (
                                null
                            )}
                        </div>
                    </div>
                    {/* if the book has an average rating, it is displayed **/}
                    <div className='row pt-2' style={{height:'30px'}}>
                        <div className='col-4'>
                            {item.volumeInfo.averageRating ? (
                                <div>
                                    <p style={{color:'#858585'}}>Average rating: {item.volumeInfo.averageRating}</p>
                                </div>
                            ) : (
                                null
                            )}
                        </div>
                    </div>
                </div>

                <div className='card-footer border-top border-danger'>
                    <div className='row'>
                        <div className='col-4'>
                            {/*if the book is available to buy from google books, button appears with link to goole books site **/}
                            {item.saleInfo.buyLink ? (
                                <>
                                <h5 style={{ fontSize: '14px' }}>Purchase from</h5>
                                    <div className='row'>
                                        <div className='col-3'>
                                            <a href={item.saleInfo.buyLink} className='card-link btn' id='cardLinkBtn'>Google</a>
                                        </div>
                                    </div>
                                </>
                                ) : (
                                null)}
                        </div>
                        
                        <div className='col-2 d-flex'>
                            {/* this links to the google books preview page; the user can look at a book sample **/}
                            {item.volumeInfo.previewLink ? (
                                <a href={item.volumeInfo.previewLink} className='btn btn-secondary align-self-center' role='button'>Preview</a>
                            ) : null}
                        </div>
                            {/* user can add book to one of their bookshelves **/}    
                            {/*new**/}
                        {loggedIn ? (            
                        <div className='col-2 d-flex'>
                            <button className='btn btn-secondary dropdown-toggle align-self-center' type='button' data-bs-toggle='dropdown'>Add to</button>
                            <ul className='dropdown-menu'>
                                {/* Add the correct href attribute here */}
                            
                                <li className='dropdown-item' onClick={() =>  handleAddTo(item.id, authToken, 0)}>Favorites</li>
                                <li className='dropdown-item' onClick={() =>  handleAddTo(item.id, authToken, 2)}>To Read</li>
                                <li className='dropdown-item' onClick={() =>  handleAddTo(item.id, authToken, 4)}>Have Read</li>
                                <li className='dropdown-item' onClick={() =>  handleAddTo(item.id, authToken, 5)}>Reviewed</li>
                            </ul>
                        </div>
                        ) : null}
                    </div>
                </div>
            </div>
        ));
    }

    function renderInfoCond (type) {
        if(type==='Author' && author) {
            return renderInfo(author)
        } else if (type==='Title' && title) {
            return renderInfo(title)
        } else if(type==='Subject' && subject) {
            return renderInfo(subject) 
        }
    }

    return (
    <>
    <div className='container-fluid p-0' id='backGroundColor'>
        <div className='topRow' data-testid='mainTitle'>
            {/*'Search by ...'**/}
            {showMainTitle(type)}
        </div>

        <div className='row pb-4' data-testid='formRow'>
            {/*when users submit their inquiry, the title for the searchbar disappears **/}
            <form onSubmit={handleSubmit}>
                <div className='searchForm'>
                    <label htmlFor='type' id='labeltype'>{type}</label>
                    {/*onChange is triggered whenever there is a change to the input element which updates input state which then updates the value of the value attribute **/}
                    <input type='text' id='inputType' data-testid='inputType' value={input} onChange={handleChange} name='type'/>
                    <div className='buttonContainer'>
                        <button id='searchButton' type='submit' data-testid='searchButton'>Search</button>
                    </div>
                </div>
            </form>
        </div>
                
                {/* {renderImages(type)} */}
            
        {type === 'Author' && !author &&  (
            
            <div id='pictures'>
                <img id='indPict' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWSaKrGsvQ7exiJhahoyONqVI1Y6GEW6WCj1squkpSoH-qoBXie-btW17-vakIgh3NKj8&usqp=CAU'></img>
                <img id='indPict' src='https://m.media-amazon.com/images/M/MV5BM2QwYmRjOWUtNzE5NS00NzRkLTgwMWQtMjBkNWRlM2JlYjIxXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_FMjpg_UX1000_.jpg'></img>
                <img id='indPict' src='https://cdn.theculturetrip.com/images/56-3957087-14428299027277f29189604040ada3fe2c36a1e71c.jpg?s=10x789110/vector/jane-austen.jpg?s=612x612&w=0&k=20&c=XQDc7UYWeoFWFo3vPIKSATwHE_lo1zhohbG4v_t-Vak='></img>

                <img id='indPict' src='https://hips.hearstapps.com/hmg-prod/images/john-milton-9409395-1-402.jpg'></img>
                <img id='indPict' src='https://static1.squarespace.com/static/50adfa2ae4b0cc1d786569eb/t/5ea9ef4c2b98ab7e5eb98692/1588195158117/?format=1500w'></img>
                <img id='indPict' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBdfr5YqvEpQM8F-mSfKMFhNbb5yFcK6inrdostS7curt6vhq5ufYQXBQSZD3hNjWAjbw&usqp=CAU'></img>

            </div>)
        } 
        {type === 'Title' && !title && (
            <div id='pictures'>
                <img id='indPict' src='https://cdn.kobo.com/book-images/991a4795-830b-43b3-8482-33af4d2482ff/1200/1200/False/metamorphoses-36.jpg' style={{objectPosition:'50% 20%'}}></img>
                <img id='indPict' src='https://m.media-amazon.com/images/I/71AsH3txYwL._AC_UF1000,1000_QL80_.jpg' style={{objectPosition:'50% 20%'}}></img>
                <img id='indPict' src='https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1344922523i/1953.jpg'></img>
                <img id='indPict' src='https://www.wtsbooks.com/cdn/shop/products/9780199537822_391x.jpg?v=1598630829'></img>
                <img id='indPict' src='https://m.media-amazon.com/images/I/71dBIm2xbiL._AC_UF1000,1000_QL80_.jpg'></img>
                <img id='indPict' src='https://m.media-amazon.com/images/I/71yV4eBo2fL._AC_UF1000,1000_QL80_.jpg'></img>

            </div>)
        }
        {type === 'Subject' && !subject && (

            <div id='pictures'>
                <img id='indPict' src='https://thehardtimes.net/wp-content/uploads/2018/12/cave.jpg' style={{filter:'grayscale(.6) contrast(1.4'}}></img>
                <img id='indPict' src='https://i.redd.it/kpym9perlqry.jpg' style={{filter:'grayscale(.7) contrast(1.3'}}></img>
                <img id='indPict' src='https://cdn.mos.cms.futurecdn.net/7t8Mzxv5q8as5LVy2AWdZV-320-80.jpg' style={{filter:'grayscale(.6) contrast(1.2'}}></img>
                <img id='indPict' src='https://images.saymedia-content.com/.image/t_share/MTc0NDMyOTA5NjM2MTUwOTE4/top-ten-beautiful-physics-equations.png' style={{filter:'grayscale(.7) contrast(1.3'}}></img>
                <img id='indPict' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIiO3Ug-A2GVLTyNCUUxVgnZLFAKGnBEf7og&s' style={{filter:'grayscale(.6) contrast(1.2'}}></img>
                <img id='indPict' src='https://cdn.britannica.com/43/190743-050-C507E9DC/Oath-of-the-Tennis-Court-June-20-1789-Jacques-Louis-David-Musee-Carnavalet-Paris.jpg' style={{filter:'grayscale(.4) contrast(1.3'}}></img>

            </div>)
        }
                    
        <div className='row'>
            {/*once data has been added to the author state, call render info and show information about the books **/}

            {renderInfoCond(type)}

        </div>
    </div>
    </>
    )
}



export default Search
