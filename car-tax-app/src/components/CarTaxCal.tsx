import { useState } from 'react';
import {
  Container, Typography, TextField, MenuItem,
  Button, Paper, Stack, Divider
} from '@mui/material';

type CarType = 'car' | 'motorcycle' | 'truck';

const CarTaxCalculator = () => {
  const [carType, setCarType] = useState<CarType>('car');
  const [engineCC, setEngineCC] = useState<number | ''>('');
  const [carAge, setCarAge] = useState<number | ''>('');
  const [taxCost, setTaxCost] = useState<string | null>(null);
  const [prbCost, setPrbCost] = useState<number | null>(null);

  const getPrbCost = (type: CarType): number => {
    switch (type) {
      case 'car': return 645.21;
      case 'motorcycle': return 324.55;
      case 'truck': return 967.28;
      default: return 0;
    }
  };

  const handleCalculate = () => {
    if (engineCC === '' || carAge === '') return;

    let tax = 0;
    const cc = engineCC;
    const age = carAge;

    if (carType === 'car') {
      if (cc <= 600) tax = cc * 0.5;
      else if (cc <= 1800) tax = 600 * 0.5 + (cc - 600) * 1.5;
      else tax = 600 * 0.5 + 1200 * 1.5 + (cc - 1800) * 4;
    }

    if (age >= 6) {
      const discount = Math.min((age - 5) * 10, 50);
      tax -= (tax * discount) / 100;
    }

    setTaxCost(tax.toFixed(2));
    setPrbCost(getPrbCost(carType));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          โปรแกรมคำนวณ พ.ร.บ. และภาษีรถยนต์
        </Typography>

        <Stack spacing={3} mt={2}>
          <TextField
            select
            label="ประเภทรถ"
            value={carType}
            onChange={(e) => setCarType(e.target.value as CarType)}
            fullWidth
          >
            <MenuItem value="car">รถเก๋ง</MenuItem>
            <MenuItem value="motorcycle">มอเตอร์ไซค์</MenuItem>
            <MenuItem value="truck">รถกระบะ / บรรทุก</MenuItem>
          </TextField>

          <TextField
            label="ขนาดเครื่องยนต์ (CC)"
            type="number"
            value={engineCC}
            onChange={(e) => setEngineCC(Number(e.target.value))}
            fullWidth
          />

          <TextField
            label="อายุรถ (ปี)"
            type="number"
            value={carAge}
            onChange={(e) => setCarAge(Number(e.target.value))}
            fullWidth
          />

          <Button variant="contained" onClick={handleCalculate}>
            คำนวณยอดชำระ
          </Button>

          {taxCost && prbCost !== null && (
            <>
              <Divider />
              <Typography>💸 ภาษีรถยนต์: <strong>{taxCost} บาท</strong></Typography>
              <Typography>🛡️ เบี้ย พ.ร.บ.: <strong>{prbCost.toFixed(2)} บาท</strong></Typography>
              <Typography variant="h6" color="green">
                ✅ ยอดรวม: {(parseFloat(taxCost) + prbCost).toFixed(2)} บาท
              </Typography>
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  );
};

export default CarTaxCalculator;
