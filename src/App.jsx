import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import ExpenseList from './pages/Expenses/ExpenseList';
import ExpenseDetail from './pages/Expenses/ExpenseDetail';
import { ThemeProvider } from './context/ThemeContext';

const Settings = () => <div className="card"><h1>Configuración</h1><p>Ajustes pronto...</p></div>;

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="gastos" element={<ExpenseList />} />
            <Route path="gastos/:id" element={<ExpenseDetail />} />
            <Route path="configuracion" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

