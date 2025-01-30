
import './App.css'
import CreateAccount from './pages/CreateAccount'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Timer from './pages/Timer'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/honors-reading-tracker" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/create-account" element={<CreateAccount/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/timer" element={<Timer/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App