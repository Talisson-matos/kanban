import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { createRoot } from 'react-dom/client'
import {Login} from './pages/Login/Login';
import {Register} from './pages/Register/Register';
import Kanban from './pages/Kanban/Kanban';
import {Historico} from './pages/Historico/Historico';
import './globals.css'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/kanban' element={<Kanban />} />
        <Route path='/historico' element={<Historico />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
