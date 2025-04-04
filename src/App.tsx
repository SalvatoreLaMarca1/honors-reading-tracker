import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateAccount from './pages/CreateAccount';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import MyBooks from './pages/MyBooks';
import Read from './pages/Read';
import NavBar from './components/NavBar';
import About from './pages/About'

function App() {
  return (
    <BrowserRouter basename="/honors-reading-tracker">
      <NavBarWrapper />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-books" element={<MyBooks />} />
        <Route path="/read" element={<Read />} />
        <Route path="/about" element={<About/>}/>
      </Routes>
    </BrowserRouter>
  );
}

const NavBarWrapper = () => {
  const location = useLocation();

  // Check if the current route is the landing page, login page, or create account page
  const isLandingPage = location.pathname === '/';
  const isLogin = location.pathname === '/login';
  const isCreateAccount = location.pathname === '/create-account';
  const isAbout = location.pathname === '/about'

  // Render NavBar only if not on Landing, Login, or Create Account pages
  return (
    <>
      {!(isLandingPage || isLogin || isCreateAccount || isAbout) && <NavBar />} {/* Hide NavBar on specific pages */}
    </>
  );
};

export default App;
