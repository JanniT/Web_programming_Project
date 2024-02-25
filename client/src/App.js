import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import Home from './pages/Home'
import ChangePassword from './pages/ChangePassword'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import ProfilePage from './components/ProfilePage'
import DashboardAdmin from './pages/DashboardAdmin'
import Settings from './pages/Settings'

const App = () => {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/register" element={<Register/>}/>
        {/* <Route path="/forgot_password" element={<ChangePassword/>}/> */}
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/profile/:username" element={<ProfilePage/>}/>
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/admin/dashboard" element={<DashboardAdmin/>}/>
        <Route path="/settings" element={<Settings/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App