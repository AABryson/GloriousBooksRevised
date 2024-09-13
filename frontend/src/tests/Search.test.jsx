import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Search from '../Search';
import ContextObject from '../ContextObject';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const mockContextValues = {
    author: [{
        volumeInfo: {
            authors: ['austen'], 
            title: 'Emma',
            subtitle: 'subtitle',
            description: 'description'
        },
        saleInfo: {
            buyLink: 'buylink'
        }
    }]
};
// const returnedData = {
//     item : {
//         volumeInfo: {
//             authors : 'austen',
//             title : 'Emma',
//         }
//     }
// }

// const renderWithParam = (ui, {route = '/Search' } = {}) => {
//     return render(
//         <MemoryRouter initialEntries={[route]}>
//             <ContextObject.Provider value={mockContextValues}>
    
//                 <Routes>
//                     <Route path="/search/:type" element={ui} />
//                 </Routes>

//             </ContextObject.Provider>
//         </MemoryRouter>
//     )
// }



test('check button class', () => {

    render(
        <MemoryRouter>
            <ContextObject.Provider value={mockContextValues}>
                <Search />
            </ContextObject.Provider>
        </MemoryRouter>
    );

    const button = screen.getByTestId('searchButton');
    expect(button).toHaveTextContent('Search')
});


test('check if there is an input element', () => {
    const type = 'Author'
    render(
        <MemoryRouter>
            <ContextObject.Provider value={mockContextValues}>
                <Search />
            </ContextObject.Provider>
        </MemoryRouter>
    );
    const formRow = screen.getByTestId('formRow');
    const inputElement = screen.getByTestId('inputType');
    expect(formRow).toContainElement(inputElement);
})

test('check use of onChange on input element', () => {
    render(
        <MemoryRouter>
            <ContextObject.Provider value={mockContextValues}>
                <Search />
            </ContextObject.Provider>
        </MemoryRouter>
    );
    const inputElement = screen.getByTestId('inputType');
    fireEvent.change(inputElement, { target: { value: 'test' } });
    expect(inputElement.value).toBe('test');

}
)

// test('check main title text', async () => {
//     renderWithParam(<Search />, { route: '/search/Author' });
    
//     let mainTitle = await screen.findByTestId('mainTitle');
//     expect(mainTitle).toHaveTextContent('Search by Author');
// });
