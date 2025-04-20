import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CircularProgress, Box } from '@mui/material';
import theme from './theme';

import Login from './components/Signin';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Receipt from './components/Recript';
//import SummaryPage from './components/SummaryPage';
//import EditProfilePage from './components/EditProfilePage';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* หน้าแรก */}
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

          {/* ไม่ต้องล็อกอิน */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ต้องล็อกอินเท่านั้น */}
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/receipt" element={user ? <Receipt /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
