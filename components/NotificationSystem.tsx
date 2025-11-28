import React, { useEffect } from 'react';
import { X, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { Notification } from '../types';

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {notifications.map((note) => (
        <Toast key={note.id} note={note} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const Toast: React.FC<{ note: Notification; onDismiss: (id: string) => void }> = ({ note, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(note.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [note.id, onDismiss]);

  const getStyles = () => {
    switch (note.type) {
      case 'success': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (note.type) {
      case 'success': return <CheckCircle size={18} />;
      case 'warning': return <AlertTriangle size={18} />;
      default: return <Info size={18} />;
    }
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg w-80 animate-in slide-in-from-right-full duration-300 ${getStyles()}`}>
      <div className="mt-0.5 shrink-0">{getIcon()}</div>
      <div className="flex-1 text-sm font-medium">{note.message}</div>
      <button onClick={() => onDismiss(note.id)} className="opacity-50 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
};

export default NotificationSystem;