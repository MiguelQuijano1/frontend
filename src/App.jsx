import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import ExpenseList from './pages/Expenses/ExpenseList';
import ExpenseDetail from './pages/Expenses/ExpenseDetail';
import ReviewInbox from './pages/Review/ReviewInbox';
import DuplicatesReview from './pages/Duplicates/DuplicatesReview';
import ProviderList from './pages/Providers/ProviderList';
import ProviderDetail from './pages/Providers/ProviderDetail';
import ProjectList from './pages/Projects/ProjectList';
import ProjectDetail from './pages/Projects/ProjectDetail';
import CategoryList from './pages/Categories/CategoryList';
import UserList from './pages/Users/UserList';
import Settings from './pages/Settings/Settings';
import Login from './pages/Auth/Login';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="gastos" element={<ExpenseList />} />
            <Route path="gastos/:id" element={<ExpenseDetail />} />
            <Route path="revision" element={<ReviewInbox />} />
            <Route path="duplicados" element={<DuplicatesReview />} />
            <Route path="proveedores" element={<ProviderList />} />
            <Route path="proveedores/:id" element={<ProviderDetail />} />
            <Route path="proyectos" element={<ProjectList />} />
            <Route path="proyectos/:id" element={<ProjectDetail />} />
            <Route path="categorias" element={<CategoryList />} />
            <Route path="usuarios" element={<UserList />} />
            <Route path="configuracion" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;