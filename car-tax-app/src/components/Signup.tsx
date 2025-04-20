import { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  useTheme,
  useMediaQuery,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  LinearProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth,db } from '../firebase';
import {  doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const provinces = [
  'กรุงเทพมหานคร', 'กระบี่', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร',
  'ขอนแก่น', 'จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ชัยนาท', 'ชัยภูมิ',
  'ชุมพร', 'เชียงราย', 'เชียงใหม่', 'ตรัง', 'ตราด', 'ตาก', 'นครนายก',
  'นครปฐม', 'นครพนม', 'นครราชสีมา', 'นครศรีธรรมราช', 'นครสวรรค์',
  'นนทบุรี', 'นราธิวาส', 'น่าน', 'บึงกาฬ', 'บุรีรัมย์', 'ปทุมธานี',
  'ประจวบคีรีขันธ์', 'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา',
  'พังงา', 'พัทลุง', 'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์',
  'แพร่', 'พะเยา', 'ภูเก็ต', 'มหาสารคาม', 'มุกดาหาร', 'แม่ฮ่องสอน',
  'ยะลา', 'ยโสธร', 'ร้อยเอ็ด', 'ระนอง', 'ระยอง', 'ราชบุรี',
  'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย', 'ศรีสะเกษ', 'สกลนคร',
  'สงขลา', 'สตูล', 'สมุทรปราการ', 'สมุทรสงคราม', 'สมุทรสาคร',
  'สระแก้ว', 'สระบุรี', 'สิงห์บุรี', 'สุโขทัย', 'สุพรรณบุรี',
  'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย', 'หนองบัวลำภู',
  'อ่างทอง', 'อำนาจเจริญ', 'อุดรธานี', 'อุตรดิตถ์',
  'อุทัยธานี', 'อุบลราชธานี'
];

const Signup = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    stationName: '',
    province: '',
    contact: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const name = e.target.name as string;
    const value = e.target.value as string;
    setForm({ ...form, [name]: value });
  };

  const validatePassword = (password: string) => {
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    return pattern.test(password);
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*()_+]/.test(password)) strength += 1;
    return (strength / 5) * 100;
  };

  const handleSignup = async () => {
    if (!validatePassword(form.password)) {
      setError('รหัสผ่านควรมีอย่างน้อย 8 ตัว มี A-Z, a-z, ตัวเลข และอักขระพิเศษ');
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
  
      // บันทึกข้อมูลเพิ่มเติมลง Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: form.firstName,
        lastName: form.lastName,
        stationName: form.stationName,
        province: form.province,
        contact: form.contact,
        email: form.email,
        createdAt: serverTimestamp(),
      });
  
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };
  

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(329.53deg, #3553A4 -1.75%, #629CDF 95.39%)',
        px: 2,
        overflow: 'hidden',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 3 : 4,
          width: '100%',
          maxWidth: 430,
          boxSizing: 'border-box',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          สมัครสมาชิก
        </Typography>

        {error && <Typography color="error">{error}</Typography>}

        <Grid container spacing={2}>
          {/* First Name + Last Name */}
          <Grid item xs={12} sm={6} sx={{ textAlign: 'left' }}>
            <TextField
              label="ชื่อ"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
            <TextField
              label="นามสกุล"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* Station + Province */}
          <Grid item xs={12} sm={6} >
            <TextField
              label="ชื่อสถานตรวจสภาพรถ"
              name="stationName"
              fullWidth
              value={form.stationName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ width: '15vh' }}>
              <InputLabel>จังหวัด</InputLabel>
              <Select
                name="province"
                value={form.province}
                onChange={handleChange}
                label="จังหวัด"
              >
                {provinces.map((province) => (
                  <MenuItem key={province} value={province}>
                    {province}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Contact */}
          <Grid item xs={12}>
            <TextField
              label="เบอร์โทร"
              name="contact"
              type="tel"
              fullWidth
              placeholder="08xxxxxxxx"
              value={form.contact}
              onChange={handleChange}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField
              label="อีเมล"
              name="email"
              type="email"
              fullWidth
              placeholder="example@email.com"
              value={form.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Password */}
          <Grid item xs={12}>
            <TextField
              label="รหัสผ่าน"
              name="password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={form.password}
              onChange={handleChange}
              helperText="รหัสผ่านต้องมี A-Z, a-z, ตัวเลข และอักขระพิเศษ อย่างน้อย 8 ตัว"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <LinearProgress
              variant="determinate"
              value={calculatePasswordStrength(form.password)}
              sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>

        <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleSignup}>
          สร้างบัญชี
        </Button>
        <Button
          variant="text"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => navigate('/login')}
        >
          เข้าสู่ระบบ
        </Button>
      </Paper>
    </Box>
  );
};

export default Signup;
