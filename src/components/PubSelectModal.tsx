import React, { useState } from 'react';
import { X, User } from 'lucide-react';
import PlacesAutocomplete from './PlacesAutocomplete';

interface PlaceData {
  place_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface PubSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (place: PlaceData | null, username: string | null) => void;
}

const PubSelectModal: React.FC<PubSelectModalProps> = ({ isOpen, onClose, onSave }) => {
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);
  const [username, setUsername] = useState('');

  if (!isOpen) return null;

  const isSaveDisabled = !selectedPlace;

  const handleSave = () => {
    if (!isSaveDisabled && selectedPlace) {
      onSave(selectedPlace, username || null);
    }
  };

  const handleSkip = () => {
    onSave(null, null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#0A0A0A] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 pb-2 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#F5F5F0] mb-1">Where are you?</h2>
            <p className="text-sm text-[#9CA3AF]">Pinpoint the pint</p>
          </div>
          <button 
            onClick={onClose}
            className="text-[#525252] hover:text-[#F5F5F0] transition-colors p-2 bg-[#1A1A1A] rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          <div className="space-y-2">
            <label className="text-[#F5F5F0] text-sm font-semibold">
              Pub <span className="text-[#ef4444]">*</span>
            </label>
            <PlacesAutocomplete
              value={selectedPlace?.name || ''}
              onChange={setSelectedPlace}
              placeholder="e.g., The Temple Bar, Dublin"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#F5F5F0] text-sm font-semibold">
              Your Handle <span className="text-[#525252] font-normal">(optional)</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
                <User
                  className="text-[#525252] group-focus-within:text-[#DDC9B4] transition-colors duration-300"
                  size={20}
                />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full bg-transparent border-b border-[#2a2a2a] text-[#DDC9B4] text-base py-3 pl-8 pr-4 placeholder-[#525252] focus:outline-none focus:border-[#DDC9B4] transition-all duration-300 rounded-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={handleSkip}
            className="w-1/3 py-4 rounded-xl text-sm text-[#9CA3AF] font-medium border border-[#2a2a2a] hover:bg-[#1A1A1A] hover:text-[#F5F5F0] transition-all"
          >
            Skip
          </button>
          <button
            onClick={handleSave}
            disabled={isSaveDisabled}
            className={`flex-1 py-4 rounded-xl text-sm font-bold text-[#0A0A0A] transition-all duration-200
              ${isSaveDisabled 
                ? 'bg-[#2a2a2a] text-[#4B5563] cursor-not-allowed' 
                : 'bg-[#F5F5F0] hover:bg-[#ffffff]'
              }`}
          >
            Lock It In
          </button>
        </div>

      </div>
    </div>
  );
};

export default PubSelectModal;