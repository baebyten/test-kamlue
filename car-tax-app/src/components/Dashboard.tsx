import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, AppBar, Toolbar, Button, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// ดึงข้อมูลจาก Firebase
const fetchUserData = async (email: string) => {
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);
  let inspectionStationName = '';
  querySnapshot.forEach((doc) => {
    inspectionStationName = doc.data().stationName; // ตรวจสอบว่า "stationName" มีอยู่ในแต่ละ document
  });
  console.log("Inspection Station Name: ", inspectionStationName);
  return inspectionStationName;
};


// ดึงข้อมูลใบเสร็จ
const fetchReceiptData = async (uid: string) => {
  const q = query(collection(db, "receipts"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  let compulsoryInsurance = 0;
  let optionalInsurance = 0;
  const inspections = { r1: 0, r2: 0, r3: 0, r12: 0 };

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    compulsoryInsurance += parseFloat(data.compulsoryInsurance || 0);
    optionalInsurance += parseFloat(data.other || 0);

    const type = (data.vehicleType || '').replace(/\s|\./g, '').toLowerCase();
    if (type === 'รย1') inspections.r1 += 1;
    else if (type === 'รย2') inspections.r2 += 1;
    else if (type === 'รย3') inspections.r3 += 1;
    else if (type === 'รย12') inspections.r12 += 1;
  });

  return { compulsoryInsurance, optionalInsurance, inspections };
};




const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ inspectionStationName: '', email: '' });
  const [compulsoryInsuranceData, setCompulsoryInsuranceData] = useState([
    { name: 'ประกันภัยภาคบังคับ', value: 0 },
    { name: 'ประกันภาคสมัครใจ', value: 0 },
  ]);
  const [inspectionData, setInspectionData] = useState([
    { name: 'รย.1', value: 0 },
    { name: 'รย.2', value: 0 },
    { name: 'รย.3', value: 0 },
    { name: 'รย.12', value: 0 },
  ]);
  const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล

  useEffect(() => {
    const getData = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // ดึงข้อมูลสถานตรวจสภาพและข้อมูลใบเสร็จ
          const userData = await fetchUserData(user.email || '');
          const receiptData = await fetchReceiptData(user.uid);
  
          console.log("🚘 User Data:", userData);
          console.log("📊 Receipt Data:", receiptData);
  
          if (userData && receiptData) {
            setUser({ inspectionStationName: userData, email: user.email || '' });
  
            if (receiptData.compulsoryInsurance && receiptData.inspections) {
              setCompulsoryInsuranceData([
                { name: 'ประกันภัยภาคบังคับ', value: receiptData.compulsoryInsurance },
                { name: 'ประกันภาคสมัครใจ', value: receiptData.optionalInsurance },
              ]);
  
              setInspectionData([
                { name: 'รย.1', value: receiptData.inspections.r1 },
                { name: 'รย.2', value: receiptData.inspections.r2 },
                { name: 'รย.3', value: receiptData.inspections.r3 },
                { name: 'รย.12', value: receiptData.inspections.r12 },
              ]);
            } else {
              console.log("Data not valid");
            }
          } else {
            console.log("User or receipt data is missing");
          }
  
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    };
  
    getData();
  }, []);

  // ฟังก์ชันที่ใช้ในการแสดงคำทักทายตามเวลา
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "สวัสดีตอนเช้า";
    if (currentHour < 18) return "สวัสดีตอนบ่าย";
    return "สวัสดีตอนเย็น";
  };

  return (
    <div>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ background: '#2e3b55', width: '100%' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ระบบจัดการภาษีรถ
          </Typography>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>หน้าหลัก</Button>
          <Button color="inherit" onClick={() => navigate('/receipt')}>ใบเสร็จ</Button>
          <Button color="inherit" onClick={() => navigate('/summary')}>สรุปยอด</Button>
          <Button color="inherit" onClick={() => navigate('/profile')}>โปรไฟล์</Button>
          <Button color="inherit" onClick={() => navigate('/login')}>ออกจากระบบ</Button>
        </Toolbar>
      </AppBar>

      {/* พื้นหลังและฟอร์ม */}
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
        <Container maxWidth="lg" sx={{ pt: 8, pb: 4 }}>
          {/* คำทักทาย */}
          <Typography variant="h4" gutterBottom>
            {loading ? <CircularProgress /> : `${getGreeting()}, ${user.inspectionStationName}`}
          </Typography>

          {/* กราฟข้อมูลพรบ และประกันภาคสมัครใจ */}
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 4 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                ข้อมูลประกันภัยภาคบังคับและประกันภาคสมัครใจ
              </Typography>
              <PieChart width={300} height={300}>
                <Pie
                  data={compulsoryInsuranceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  <Cell fill="#8bc34a" />
                  <Cell fill="#ffc107" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Box>

            {/* กราฟการตรวจสภาพรถยนต์และจักรยานยนต์ */}
            <Box>
              <Typography variant="h6" gutterBottom>
                การตรวจสภาพรถยนต์และจักรยานยนต์
              </Typography>
              <PieChart width={300} height={300}>
                <Pie
                  data={inspectionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  <Cell fill="#4caf50" />
                  <Cell fill="#ff5722" />
                  <Cell fill="#3f51b5" />
                  <Cell fill="#00bcd4" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default Dashboard;
