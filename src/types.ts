export interface LogPoint {
  timestamp: number;
  vdc: number;
  vq: number;
  vd: number;
  id: number;
  iq: number;
  rpm: number;
  torque: number;
  isAnomaly: boolean;
  anomalyType?: string;
}

export interface Anomaly {
  id: string;
  timestamp: number;
  parameter: string;
  value: number;
  threshold: number;
  type: 'RULE' | 'AI';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface MBDComparison {
  timestamp: number;
  actual: number;
  simulated: number;
  error: number;
}
