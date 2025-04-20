import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Grid,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    CssBaseline,
    Container,
  } from '@mui/material';
  import { useNavigate } from 'react-router-dom';
  import { useState } from 'react';
  import { addDoc, collection } from 'firebase/firestore';
  import { auth, db } from '../firebase';
  
  const Receipt = () => {
    const navigate = useNavigate();
  
    const [form, setForm] = useState({
      fullName: '',
      licensePlate: '',
      vehicleType: '',
      tax: 0,
      compulsoryInsurance: 0,
      other: 0,
    });
  
    const [submitting, setSubmitting] = useState(false);
  
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
    ) => {
      const name = e.target.name as string;
      const value = e.target.value;
      setForm({ ...form, [name]: value });
    };
  
    const getInspectionFee = () => {
      if (form.vehicleType === 'new') return 0;
      if (['รย.1', 'รย.2', 'รย.3'].includes(form.vehicleType)) return 200;
      if (form.vehicleType === 'รย.12') return 60;
      return 0;
    };
  
    const total =
      getInspectionFee() +
      Number(form.tax) +
      Number(form.compulsoryInsurance) +
      Number(form.other);
  
    const handleSubmit = async () => {
      if (submitting) return;
  
      if (!form.fullName || !form.licensePlate || !form.vehicleType) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
      }
  
      // ตรวจสอบว่าเป็นตัวเลขหรือไม่
      if (isNaN(form.tax) || isNaN(form.compulsoryInsurance) || isNaN(form.other)) {
        alert('กรุณากรอกค่าภาษี, ค่าพรบ และค่าอื่นๆ เป็นตัวเลข');
        return;
      }
  
      // ยืนยันก่อนการปริ้น
      const isConfirmed = window.confirm('คุณต้องการพิมพ์ใบเสร็จนี้หรือไม่?');
      if (!isConfirmed) return;
  
      setSubmitting(true);
      try {
        const inspectionFee = getInspectionFee();
        const tax = Number(form.tax);
        const compulsoryInsurance = Number(form.compulsoryInsurance);
        const other = Number(form.other);
  
        const totalAmount = inspectionFee + tax + compulsoryInsurance + other;
  
        // บันทึกข้อมูลใหม่ใน Firestore
        await addDoc(collection(db, 'receipts'), {
          uid: auth.currentUser?.uid,
          fullName: form.fullName,
          licensePlate: form.licensePlate,
          vehicleType: form.vehicleType,
          tax,
          compulsoryInsurance,
          other,
          inspectionFee,
          total: totalAmount,
          timestamp: new Date(),
        });
  
        // Reset form ก่อน แล้วค่อย print ด้วย delay เล็กน้อย
        setForm({
          fullName: '',
          licensePlate: '',
          vehicleType: '',
          tax: 0,
          compulsoryInsurance: 0,
          other: 0,
        });
  
        setTimeout(() => {
          printReceipt(form);
        }, 300); // ให้เวลาบันทึกข้อมูลก่อนที่จะทำการพิมพ์
      } catch (error: any) {
        console.error('Error adding receipt: ', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (error.message || error));
      } finally {
        setSubmitting(false);
      }
    };
  
    const printReceipt = (formData: any) => {
      // สร้าง HTML สำหรับข้อมูลใบเสร็จที่จะพิมพ์
      const receiptContent = `
        <html>
          <head>
            <title>ใบเสร็จ</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
              }
              .receipt {
                border: 1px solid #000;
                padding: 20px;
                max-width: 400px;
                margin: 0 auto;
                text-align: left;
              }
              .receipt h1 {
                text-align: center;
              }
              .receipt p {
                margin: 5px 0;
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <h1>ใบเสร็จ</h1>
              <p><strong>ชื่อ-นามสกุล:</strong> ${formData.fullName}</p>
              <p><strong>ป้ายทะเบียน:</strong> ${formData.licensePlate}</p>
              <p><strong>ประเภท:</strong> ${formData.vehicleType}</p>
              <p><strong>ค่าตรวจสภาพ:</strong> ${getInspectionFee()}</p>
              <p><strong>ค่าภาษี:</strong> ${formData.tax}</p>
              <p><strong>พรบ:</strong> ${formData.compulsoryInsurance}</p>
              <p><strong>ค่าอื่นๆ:</strong> ${formData.other}</p>
              <p><strong>รวมทั้งหมด:</strong> ${total.toLocaleString()} บาท</p>
            </div>
          </body>
        </html>
      `;
  
      // เปิดหน้าต่างใหม่เพื่อพิมพ์
      const printWindow = window.open('', '', 'width=600,height=600');
      printWindow?.document.write(receiptContent);
      printWindow?.document.close();
      printWindow?.print();
    };
  
    const handleLogout = () => {
      navigate('/login');
    };
  
    return (
      <>
        <CssBaseline />
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
  
        <Box
          sx={{
            background: 'linear-gradient(329.53deg, #3553A4 -1.75%, #629CDF 95.39%)',
            minHeight: '100vh',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pt: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Container maxWidth="md">
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: 3,
                p: 4,
                boxShadow: 4,
              }}
            >
              <Typography variant="h5" gutterBottom>
                ฟอร์มกรอกข้อมูลใบเสร็จ
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ชื่อ-นามสกุล"
                    name="fullName"
                    fullWidth
                    value={form.fullName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ป้ายทะเบียน"
                    name="licensePlate"
                    fullWidth
                    value={form.licensePlate}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{width:'30vh'}}>
                  <FormControl fullWidth >
                    <InputLabel>ประเภทรถ</InputLabel>
                    <Select
                      name="vehicleType"
                      value={form.vehicleType}
                      onChange={handleChange}
                    >
                      <MenuItem value="รย.1">รย.1</MenuItem>
                      <MenuItem value="รย.2">รย.2</MenuItem>
                      <MenuItem value="รย.3">รย.3</MenuItem>
                      <MenuItem value="รย.12">รย.12</MenuItem>
                      <MenuItem value="new">รถใหม่</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ค่าภาษี"
                    name="tax"
                    type="number"
                    fullWidth
                    value={form.tax}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ค่าพรบ"
                    name="compulsoryInsurance"
                    type="number"
                    fullWidth
                    value={form.compulsoryInsurance}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ค่าอื่นๆ"
                    name="other"
                    type="number"
                    fullWidth
                    value={form.other}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" mt={2}>
                    รวมทั้งหมด: {total.toLocaleString()} บาท
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'right', mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    ยืนยันและพิมพ์ใบเสร็จ
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </>
    );
  };
  
  export default Receipt;
  