import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Car, UserCircle, Bell, Film, LogOut, History as HistoryIcon, Clock, AlertTriangle } from 'lucide-react';
import ParkingMap from './components/ParkingMap';
import DriverChat from './components/DriverChat';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import MovieBooking from './components/MovieBooking';
import Logo from './components/Logo';
import Payment from './components/Payment';
import History from './components/History';
import UserProfile from './components/UserProfile';
import NotificationSystem from './components/NotificationSystem';
import { ParkingSpot, SpotStatus, VehicleType, ParkingStats, User, Booking, Notification } from './types';

// Mock Data Generators
const generateSpots = (): ParkingSpot[] => {
  const spots: ParkingSpot[] = [];

  // 1. 20 Slots for Movie Goers (3 Hours Limit)
  for (let i = 1; i <= 20; i++) {
    spots.push({
      id: i.toString().padStart(3, '0'),
      section: 'M', // Movie Section
      category: 'MOVIE',
      timeLimit: 3,
      status: SpotStatus.AVAILABLE,
      type: i % 10 === 0 ? VehicleType.HANDICAP : VehicleType.COMPACT,
      lastUpdated: new Date()
    });
  }

  // 2. 40 Slots for Shoppers/Visitors (1 Hour Limit)
  for (let i = 1; i <= 40; i++) {
    spots.push({
      id: (i + 20).toString().padStart(3, '0'),
      section: 'S', // Shopping Section
      category: 'SHOPPING',
      timeLimit: 1,
      status: SpotStatus.AVAILABLE,
      type: i % 8 === 0 ? VehicleType.EV : Math.random() > 0.7 ? VehicleType.SUV : VehicleType.COMPACT,
      lastUpdated: new Date()
    });
  }

  return spots;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'DRIVER' | 'MANAGER' | 'MOVIES' | 'HISTORY' | 'PROFILE'>('DRIVER');
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [bookingSpot, setBookingSpot] = useState<ParkingSpot | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Simulation State
  const [currentTimeOffset, setCurrentTimeOffset] = useState(0); // For simulation
  
  // Dynamic Stats
  const [stats, setStats] = useState<ParkingStats>({
    totalSpots: 0,
    availableSpots: 0,
    occupiedSpots: 0,
    occupancyRate: 0,
    revenue: 0,
    peakHours: '17:00 - 21:00'
  });

  const addNotification = (type: 'success' | 'info' | 'warning', message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Initialize Spots
  useEffect(() => {
    const initialSpots = generateSpots();
    setSpots(initialSpots);
    addNotification('info', 'Welcome to CityHub AI! System Online.');
  }, []);

  // AUTOMATIC PENALTY SYSTEM
  useEffect(() => {
    const checkOverdueBookings = () => {
      const now = new Date(Date.now() + currentTimeOffset);

      setBookings(prevBookings => {
        return prevBookings.map(booking => {
          // Only check active parking bookings
          if (booking.type === 'PARKING' && booking.status === 'ACTIVE' && !booking.isOverdue && booking.timeLimit) {
            
            const bookingTime = new Date(booking.date).getTime();
            const timeLimitMs = booking.timeLimit * 60 * 60 * 1000; // Convert hours to ms
            
            // Check if current time exceeds booking time + limit
            if (now.getTime() > bookingTime + timeLimitMs) {
              const penaltyAmount = 100; // Flat penalty fee
              
              // Trigger Notification (Simulating SMS)
              addNotification(
                'warning', 
                `SMS to ${user?.phoneNumber || 'User'}: Time Limit Exceeded for ${booking.itemTitle}. Penalty of ₹${penaltyAmount} applied.`
              );

              return {
                ...booking,
                isOverdue: true,
                penalty: penaltyAmount,
                amount: booking.amount + penaltyAmount
              };
            }
          }
          return booking;
        });
      });
    };

    // Run check every 5 seconds
    const interval = setInterval(checkOverdueBookings, 5000);
    return () => clearInterval(interval);
  }, [currentTimeOffset, user]);

  // Update Status Periodic Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSpots(current => {
        const newSpots = [...current];
        const indexToChange = Math.floor(Math.random() * newSpots.length);
        const spot = newSpots[indexToChange];
        
        if ((bookingSpot && spot.id === bookingSpot.id) || spot.status === SpotStatus.RESERVED) return newSpots;

        if (Math.random() > 0.7) {
          spot.status = spot.status === SpotStatus.AVAILABLE ? SpotStatus.OCCUPIED : SpotStatus.AVAILABLE;
          spot.lastUpdated = new Date();
        }
        return newSpots;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [bookingSpot]);

  // Calculate Statistics
  useEffect(() => {
    const total = spots.length;
    const available = spots.filter(s => s.status === SpotStatus.AVAILABLE).length;
    const occupied = total - available;
    
    setStats({
      totalSpots: total,
      availableSpots: available,
      occupiedSpots: occupied,
      occupancyRate: total > 0 ? occupied / total : 0,
      revenue: occupied * 5.50 + 1240, 
      peakHours: '17:00 - 21:00'
    });
  }, [spots]);

  // Admin Actions
  const handleAddSlot = (section: string, count: number) => {
    const newSpots: ParkingSpot[] = Array.from({ length: count }, (_, i) => ({
      id: (spots.length + i + 1).toString().padStart(3, '0'),
      section: section,
      category: 'SHOPPING',
      timeLimit: 1,
      status: SpotStatus.AVAILABLE,
      type: VehicleType.COMPACT,
      lastUpdated: new Date()
    }));
    setSpots(prev => [...prev, ...newSpots]);
    addNotification('success', `Added ${count} new slots to Section ${section}`);
  };

  const handleDeleteSlot = (id: string) => {
    setSpots(prev => prev.filter(s => s.id !== id));
    addNotification('warning', `Slot ${id} removed from system.`);
  };

  const handleSpotClick = (spot: ParkingSpot) => {
    if (spot.status === SpotStatus.AVAILABLE) {
      setBookingSpot(spot);
    }
  };

  const getDynamicRate = (type: VehicleType): { rate: number, isPeak: boolean } => {
    const hour = new Date().getHours();
    const isPeak = hour >= 17 && hour <= 21; 
    let baseRate = (type === VehicleType.SUV || type === VehicleType.HANDICAP) ? 100 : 50;
    
    if (isPeak) {
      baseRate += 20; 
    }
    return { rate: baseRate, isPeak };
  };

  const handleBookingSuccess = () => {
    if (bookingSpot) {
      const { rate } = getDynamicRate(bookingSpot.type);
      
      const newBooking: Booking = {
        id: `PKG-${Date.now()}`,
        itemTitle: `Spot ${bookingSpot.section}-${bookingSpot.id} (${bookingSpot.category})`,
        type: 'PARKING',
        date: new Date(Date.now() + currentTimeOffset), // Use simulated time if active
        timeLimit: bookingSpot.timeLimit,
        amount: rate,
        penalty: 0,
        isOverdue: false,
        status: 'ACTIVE',
        qrCodeData: `PARK:${bookingSpot.id}:${user?.username}`
      };

      setBookings(prev => [newBooking, ...prev]);
      
      setSpots(prev => prev.map(s => s.id === bookingSpot.id ? {...s, status: SpotStatus.RESERVED} : s));
      
      addNotification('success', `Booking Confirmed. Max Time: ${bookingSpot.timeLimit}hr(s).`);
      setBookingSpot(null);
    }
  };

  const simulateTimePass = () => {
    // Fast forward 65 minutes to trigger 1-hour limits
    setCurrentTimeOffset(prev => prev + (65 * 60 * 1000));
    addNotification('info', 'DEBUG: Simulated 65 minutes passing...');
  };

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      
      <NotificationSystem notifications={notifications} onDismiss={removeNotification} />

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 transition-all">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 text-white">
            <Logo size="sm" />
            <h1 className="font-bold text-xl tracking-tight">CityHub AI</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setViewMode('DRIVER')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${viewMode === 'DRIVER' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <Car size={18} />
            <span>Find & Book Parking</span>
          </button>
          
          <button 
            onClick={() => setViewMode('MOVIES')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${viewMode === 'MOVIES' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <Film size={18} />
            <span>Movies</span>
          </button>

          <div className="py-2 opacity-50 border-t border-slate-800 my-2"></div>

          <button 
            onClick={() => setViewMode('HISTORY')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${viewMode === 'HISTORY' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <HistoryIcon size={18} />
            <span>History & Invoices</span>
          </button>

          <button 
            onClick={() => setViewMode('PROFILE')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${viewMode === 'PROFILE' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <UserCircle size={18} />
            <span>My Profile</span>
          </button>

          {user.role === 'admin' && (
            <>
              <div className="py-2 opacity-50 border-t border-slate-800 my-2"></div>
              <button 
                onClick={() => setViewMode('MANAGER')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${viewMode === 'MANAGER' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
              >
                <LayoutDashboard size={18} />
                <span>Admin Dashboard</span>
              </button>
            </>
          )}

          <div className="pt-8 px-4">
             <button 
               onClick={simulateTimePass}
               className="w-full flex items-center justify-center gap-2 mb-4 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-amber-400 border border-amber-900/50 rounded-lg transition-colors"
             >
               <Clock size={14} /> Simulate +1 Hr (Debug)
             </button>

             <p className="text-xs uppercase text-slate-500 font-semibold mb-2">System Status</p>
             <div className="flex items-center gap-2 text-sm text-emerald-400">
               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
               Online & Monitoring
             </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setUser(null)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800">
            {viewMode === 'DRIVER' && 'Parking Dashboard'}
            {viewMode === 'MANAGER' && 'City Operations'}
            {viewMode === 'MOVIES' && 'Movie Ticket Booking'}
            {viewMode === 'HISTORY' && 'My Activities'}
            {viewMode === 'PROFILE' && 'User Profile'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600 hidden md:block">Hi, {user.username}</span>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
              )}
            </button>
            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-full flex items-center justify-center font-bold text-xs">
              {user.username.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            
            {viewMode === 'DRIVER' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                <div className="lg:col-span-2">
                  <div className="mb-6 flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                      <p className="text-sm text-slate-500">Available Spots</p>
                      <p className="text-2xl font-bold text-emerald-600">{stats.availableSpots}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Current Rate</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-slate-800">
                          ₹{getDynamicRate(VehicleType.COMPACT).rate}
                        </p>
                        {getDynamicRate(VehicleType.COMPACT).isPeak && (
                           <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs rounded font-bold uppercase">Peak Hour</span>
                        )}
                      </div>
                    </div>
                    <div>
                       <p className="text-sm text-slate-500">Weather</p>
                       <p className="text-sm font-medium text-slate-800 flex items-center gap-1">28°C Sunny</p>
                    </div>
                  </div>
                  <ParkingMap 
                    spots={spots} 
                    onSpotClick={handleSpotClick} 
                  />
                  <p className="text-sm text-slate-500 mt-2 text-center">Click on a green spot to book</p>
                </div>
                <div className="lg:col-span-1">
                  <DriverChat spots={spots} />
                  
                  <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h4 className="font-semibold text-blue-900 mb-2">CityHub Benefits</h4>
                    <ul className="text-sm text-blue-800 space-y-2 list-disc pl-4">
                      <li>Reserve spots in advance</li>
                      <li>Contactless UPI payments</li>
                      <li>Ticketless Entry via QR</li>
                      <li><strong>Note:</strong> Shopping Zone limit is 1 Hour. Overstaying attracts penalties.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'MANAGER' && (
              <Dashboard 
                stats={stats} 
                spots={spots} 
                onAddSlot={handleAddSlot}
                onDeleteSlot={handleDeleteSlot}
              />
            )}
            
            {viewMode === 'MOVIES' && <MovieBooking />}

            {viewMode === 'HISTORY' && <History bookings={bookings} />}

            {viewMode === 'PROFILE' && <UserProfile user={user} onUpdate={setUser} />}

          </div>
        </div>

        {/* Parking Booking Payment Modal */}
        {bookingSpot && (
          <Payment 
            amount={getDynamicRate(bookingSpot.type).rate} 
            title={`Booking ${bookingSpot.section}-${bookingSpot.id}`}
            details={`${bookingSpot.category === 'MOVIE' ? 'Movie Zone' : 'Shopping Zone'} • Max ${bookingSpot.timeLimit} Hour${bookingSpot.timeLimit > 1 ? 's' : ''}`}
            onSuccess={handleBookingSuccess} 
            onCancel={() => setBookingSpot(null)} 
          />
        )}
      </main>
    </div>
  );
};

export default App;