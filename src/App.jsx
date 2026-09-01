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
import Settings from './pages/Settings/Settings';
import UserList from './pages/Settings/UserList';
import EmpresaList from './pages/Settings/EmpresaList';
import Login from './pages/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import SuperAdminRoute from './components/Auth/SuperAdminRoute';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
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

                {/* Sección Configuración: sub-nav propia (ver SettingsSidebar).
                    Nuevos apartados de configuración se agregan como una
                    ruta hija más aquí, sin tocar el resto. */}
                <Route path="configuracion" element={<Settings />} />
                <Route path="configuracion/usuarios" element={<UserList />} />
                <Route element={<SuperAdminRoute />}>
                  <Route path="configuracion/empresas" element={<EmpresaList />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;