import React, { useState } from 'react';
import { User } from '../types';
import { UserCircle, Car, Save, Shield } from 'lucide-react';

interface UserProfileProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
  const [vehicleNumber, setVehicleNumber] = useState(user.vehicleNumber || '');
  const [vehicleModel, setVehicleModel] = useState(user.vehicleModel || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate({
      ...user,
      vehicleNumber,
      vehicleModel
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{user.username}</h2>
            <p className="text-slate-500">{user.email || `${user.username.toLowerCase()}@example.com`}</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700">
              <Shield size={10} /> {user.role.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Car size={20} className="text-slate-500" />
              Vehicle Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">License Plate Number</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="TS 09 AB 1234"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Vehicle Model</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="e.g. Swift Dzire, Hyundai Creta"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <Save size={18} /> Save Changes
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
           <Shield size={20} />
        </div>
        <div>
          <h4 className="font-semibold text-blue-900">License Plate Recognition Enabled</h4>
          <p className="text-sm text-blue-800 mt-1">
            Your vehicle details are used for automated entry and exit at supported Smart Parking locations. Ensure your license plate number is correct.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;