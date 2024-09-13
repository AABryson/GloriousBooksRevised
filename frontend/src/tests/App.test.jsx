import { render, screen, fireEvent } from '@testing-library/react'
import HomePage1 from '../HomePage1'
import App from '../App'
import Search from '../Search'
import ContextObject from '../ContextObject'
import {MemoryRouter} from 'react-router-dom'
import { expect } from 'vitest'


test('should render search page component'), () => {
    // const {container} = render(<App/>)
    // expect(container).toBeInTheDocument()

    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path='/' element={<HomePage1/>}/>
                <Route path='/search' element={<Search/>}/>
            </Routes>
        </MemoryRouter>
    )
    
    const image = screen.getByTestId('imageTitle');
    fireEvent.click(image)
    expect(screen.getByText('Search by Author')).toBeInTheDocument()
}