import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Routes>
              <Route path='/*' element={<App />} />
          </Routes>
        </LocalizationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);