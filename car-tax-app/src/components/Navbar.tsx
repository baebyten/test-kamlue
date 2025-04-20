// Navbar.tsx
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: เพิ่ม logic logout ถ้าต้องการ
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ background: '#2e3b55', width: '100%' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ระบบจัดการภาษีรถ
        </Typography>
        <Button color="inherit" onClick={() => navigate('/dashboard')}>
          หน้าหลัก
        </Button>
        <Button color="inherit" onClick={() => navigate('/receipt')}>
          ใบเสร็จ
        </Button>
        <Button color="inherit" onClick={() => navigate('/summary')}>
          สรุปยอด
        </Button>
        <Button color="inherit" onClick={() => navigate('/profile')}>
          โปรไฟล์
        </Button>
        <Button color="inherit" onClick={handleLogout}>
          ออกจากระบบ
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
