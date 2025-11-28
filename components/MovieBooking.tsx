import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import Payment from './Payment';
import { Star, Calendar, Users, Ticket } from 'lucide-react';

const DUMMY_MOVIES: Movie[] = [
  // Telugu Movies
  {
    id: '1',
    title: 'Baahubali: The Beginning',
    language: 'Telugu',
    rating: 4.9,
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Baahubali_The_Beginning_poster.jpg',
    showtimes: ['10:00 AM', '1:30 PM', '5:00 PM', '8:30 PM']
  },
  {
    id: '2',
    title: 'Baahubali 2: The Conclusion',
    language: 'Telugu',
    rating: 5.0,
    poster: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Baahubali_the_Conclusion.jpg',
    showtimes: ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM']
  },
  {
    id: '3',
    title: 'Kalki 2898 AD',
    language: 'Telugu',
    rating: 4.8,
    poster: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg',
    showtimes: ['11:00 AM', '2:30 PM', '6:00 PM', '9:30 PM']
  },
  {
    id: '6',
    title: 'Salaar: Part 1 – Ceasefire',
    language: 'Telugu',
    rating: 4.7,
    poster: 'https://upload.wikimedia.org/wikipedia/en/a/ad/Salaar_Part_1_-_Ceasefire_poster.jpg',
    showtimes: ['11:30 AM', '3:00 PM', '6:30 PM', '10:00 PM']
  },
  
  // Hindi Movies
  {
    id: 'h1',
    title: 'Jawan',
    language: 'Hindi',
    rating: 4.7,
    poster: 'https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg',
    showtimes: ['10:00 AM', '2:00 PM', '6:00 PM', '10:00 PM']
  },
  {
    id: 'h2',
    title: 'Stree 2',
    language: 'Hindi',
    rating: 4.6,
    poster: 'https://upload.wikimedia.org/wikipedia/en/1/1a/Stree_2_poster.jpg',
    showtimes: ['11:30 AM', '3:30 PM', '7:30 PM']
  },
  {
    id: 'h3',
    title: 'Animal',
    language: 'Hindi',
    rating: 4.5,
    poster: 'https://upload.wikimedia.org/wikipedia/en/9/90/Animal_%282023_film%29_poster.jpg',
    showtimes: ['10:30 AM', '2:30 PM', '6:30 PM', '10:30 PM']
  },

  // English Movies
  {
    id: 'e1',
    title: 'Oppenheimer',
    language: 'English',
    rating: 4.9,
    poster: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg',
    showtimes: ['10:00 AM', '2:00 PM', '6:00 PM', '9:30 PM']
  },
  {
    id: 'e2',
    title: 'Dune: Part Two',
    language: 'English',
    rating: 4.8,
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpg',
    showtimes: ['11:00 AM', '3:00 PM', '7:00 PM', '10:30 PM']
  },
  {
    id: 'e3',
    title: 'Deadpool & Wolverine',
    language: 'English',
    rating: 4.7,
    poster: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Deadpool_%26_Wolverine_poster.jpg',
    showtimes: ['9:30 AM', '12:30 PM', '3:30 PM', '6:30 PM']
  },
  {
    id: 'e4',
    title: 'Avatar: The Way of Water',
    language: 'English',
    rating: 4.8,
    poster: 'https://upload.wikimedia.org/wikipedia/en/5/54/Avatar_The_Way_of_Water_poster.jpg',
    showtimes: ['10:00 AM', '2:00 PM', '6:00 PM']
  }
];

const MovieBooking: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [queuePosition, setQueuePosition] = useState(0);
  const [isQueueing, setIsQueueing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  
  // Filter State
  const [activeLang, setActiveLang] = useState<string>('All');

  // Queue Algorithm Simulation
  useEffect(() => {
    let interval: any;
    if (isQueueing && queuePosition > 0) {
      interval = setInterval(() => {
        setQueuePosition((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsQueueing(false);
            setShowPayment(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000); // Fast queue for demo
    }
    return () => clearInterval(interval);
  }, [isQueueing, queuePosition]);

  const handleBook = (movie: Movie, time: string) => {
    setSelectedMovie(movie);
    setSelectedTime(time);
    
    // Random queue start position between 3 and 8
    const startPos = Math.floor(Math.random() * 5) + 3;
    setQueuePosition(startPos);
    setIsQueueing(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setSelectedMovie(null);
    alert(`Booking Confirmed for ${selectedMovie?.title}! Please check your email for the ticket.`);
  };

  const filteredMovies = activeLang === 'All' 
    ? DUMMY_MOVIES 
    : DUMMY_MOVIES.filter(m => m.language === activeLang);

  if (showPayment) {
    return (
      <Payment 
        amount={200.00} 
        onSuccess={handlePaymentSuccess} 
        onCancel={() => setShowPayment(false)} 
      />
    );
  }

  if (isQueueing) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] p-8 text-center bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 relative">
          <Users className="text-indigo-600" size={40} />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold text-sm animate-bounce">
            {queuePosition}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">You are in Queue</h2>
        <p className="text-slate-500 max-w-md">
          Due to high demand for <span className="font-semibold text-indigo-600">{selectedMovie?.title}</span>, 
          you have been placed in a waiting room. Please do not refresh.
        </p>
        <div className="mt-8 w-full max-w-xs bg-slate-100 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-indigo-600 animate-pulse w-full origin-left transition-transform duration-1000" style={{ transform: `scaleX(${1 - queuePosition/10})` }}></div>
        </div>
      </div>
    );
  }

  const languages = ['All', 'Telugu', 'Hindi', 'English'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800">Blockbuster Movies</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap border ${
                activeLang === lang 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-shadow group flex flex-col">
            <div className="relative h-96 overflow-hidden shrink-0">
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute top-2 right-2 bg-black/70 text-amber-400 px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold backdrop-blur-sm">
                <Star size={12} fill="currentColor" /> {movie.rating}
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                 <h3 className="font-bold text-white text-lg leading-tight mb-1">{movie.title}</h3>
                 <div className="text-slate-300 text-xs font-medium">{movie.language} • Action/Epic</div>
              </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <div className="mb-4 flex-1">
                <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                  <Calendar size={12} /> Today's Showtimes
                </p>
                <div className="flex flex-wrap gap-2">
                  {movie.showtimes.map((time) => (
                    <button 
                      key={time}
                      onClick={() => handleBook(movie, time)}
                      className="text-xs border border-indigo-100 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 px-2 py-1 rounded transition-colors"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                <span className="text-slate-900 font-bold">₹200</span>
                <button 
                  onClick={() => handleBook(movie, movie.showtimes[0])}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Ticket size={16} />
                  Book
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredMovies.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-100 rounded-xl border border-dashed border-slate-300">
            No movies found for selected language.
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieBooking;