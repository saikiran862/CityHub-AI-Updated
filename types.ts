export enum SpotStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE'
}

export enum VehicleType {
  COMPACT = 'COMPACT',
  SUV = 'SUV',
  HANDICAP = 'HANDICAP',
  EV = 'EV'
}

export type ZoneCategory = 'MOVIE' | 'SHOPPING';

export interface ParkingSpot {
  id: string;
  section: string;
  category: ZoneCategory;
  timeLimit: number; // in hours
  status: SpotStatus;
  type: VehicleType;
  lastUpdated: Date;
}

export interface ParkingStats {
  totalSpots: number;
  availableSpots: number;
  occupiedSpots: number;
  occupancyRate: number;
  revenue: number;
  peakHours: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface User {
  username: string;
  role: 'user' | 'admin';
  email?: string;
  phoneNumber?: string; // Added phone number
  vehicleNumber?: string;
  vehicleModel?: string;
}

export interface Movie {
  id: string;
  title: string;
  language: string;
  poster: string;
  rating: number;
  showtimes: string[];
}

export interface Booking {
  id: string;
  itemTitle: string; 
  type: 'PARKING' | 'MOVIE';
  date: Date;
  timeLimit?: number; // Added: Limit in hours
  amount: number;
  penalty: number; // Added: Penalty amount
  isOverdue: boolean; // Added: Overdue status
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  qrCodeData: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning';
  message: string;
}