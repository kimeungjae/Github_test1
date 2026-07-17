import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateMockData(points: number = 1000): any[] {
  const data = [];
  let baseRpm = 1500;
  let baseTorque = 200;

  for (let i = 0; i < points; i++) {
    const t = i * 0.001; // 1ms steps
    const noise = (Math.random() - 0.5) * 2;
    
    // Simulate some control dynamics
    const rpm = baseRpm + Math.sin(t * 5) * 50 + noise;
    const torque = baseTorque + Math.cos(t * 5) * 10 + noise;
    
    // Simulated anomaly around point 450-480
    const isAnomaly = i > 450 && i < 480;
    const vdc = 600 + (isAnomaly ? Math.random() * 100 : Math.random() * 5);

    data.push({
      timestamp: t,
      vdc: Number(vdc.toFixed(2)),
      rpm: Number(rpm.toFixed(2)),
      torque: Number(torque.toFixed(2)),
      id: Number((Math.sin(t * 10) * 100 + noise).toFixed(2)),
      iq: Number((Math.cos(t * 10) * 100 + noise).toFixed(2)),
      isAnomaly,
      anomalyType: isAnomaly ? 'Vdc Surge' : null
    });
  }
  return data;
}

export function generateMBDData(points: number = 500): any[] {
  const data = [];
  for (let i = 0; i < points; i++) {
    const t = i * 0.1;
    const simulated = Math.sin(t) * 100 + 500;
    const actual = simulated + (Math.random() - 0.5) * 10 + (i > 300 ? 15 : 0); // Drift after 300
    data.push({
      timestamp: t,
      simulated: Number(simulated.toFixed(2)),
      actual: Number(actual.toFixed(2)),
      error: Number(Math.abs(simulated - actual).toFixed(2))
    });
  }
  return data;
}
