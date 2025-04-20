import { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center" // จัดตำแหน่งแนวนอนให้อยู่กลาง
      alignItems="center" // จัดตำแหน่งแนวตั้งให้อยู่กลาง
      sx={{
        display: "flex",
        justifyContent: "center",  // จัดตำแหน่งเนื้อหากึ่งกลาง
        alignItems: "center",      // จัดตำแหน่งเนื้อหากึ่งกลางในแนวตั้ง
        position: 'absolute',      // ทำให้แน่ใจว่าเต็มหน้าจอ
        top: 0,
        left: 0,
        width: "100%",             // ความกว้างเต็มหน้าจอ
        height: "100vh",           // ความสูงเต็มหน้าจอ
        background: 'linear-gradient(329.53deg, #3553A4 -1.75%, #629CDF 95.39%)',
        px: 2,                     // เพิ่ม padding ซ้ายและขวา
        overflow: 'hidden',        // ไม่ให้เนื้อหาเกินขอบ
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 3 : 4,
          width: '100%', // ใช้ความกว้าง 100% แต่มีการกำหนด maxWidth
          maxWidth: 400, // กำหนดขนาดสูงสุด
          boxSizing: 'border-box', // ทำให้ขนาดพอดีกับการกำหนด padding
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
          เข้าสู่ระบบ
        </Typography>

        {error && <Typography color="error">{error}</Typography>}

        <TextField
          label="อีเมล"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="รหัสผ่าน"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          เข้าสู่ระบบ
        </Button>

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Link href="/signup" underline="hover">
            สมัครสมาชิก
          </Link>
          <Link href="/reset-password" underline="hover">
            ลืมรหัสผ่าน?
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default Signin;
