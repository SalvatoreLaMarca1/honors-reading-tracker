

import CreateAccount from './pages/CreateAccount'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import MyBooks from './pages/MyBooks'
import Read from './pages/Read'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/honors-reading-tracker" element={<Login/>} />
        <Route path="/honors-reading-tracker/login" element={<Login/>} />
        <Route path="/honors-reading-tracker/create-account" element={<CreateAccount/>} />
        <Route path="/honors-reading-tracker/dashboard" element={<Dashboard/>} />
        <Route path="/honors-reading-tracker/my-books" element={<MyBooks/>} />
        <Route path="/honors-reading-tracker/read" element={<Read/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App