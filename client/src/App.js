import './App.css'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import Home from './pages/Home'
import ChangePassword from './pages/ChangePassword'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import { BrowserRouter as Router, Route, Routes, BrowserRouter  } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/forgot_password" element={<ChangePassword/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/chat" element={<Chat/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App