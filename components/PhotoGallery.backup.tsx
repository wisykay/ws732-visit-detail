
import React, { useState } from 'react';
import { Tag } from 'lucide-react';

interface BBox {
  x: number; // percentage
  y: number; // percentage
  w: number; // percentage
  h: number; // percentage
  label: string;
  status: 'passed' | 'failed' | 'warning';
}

interface PhotoData {
  url: string;
  boxes: BBox[];
}

const PHOTO: PhotoData = {
  url: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728',
  boxes: [
    { x: 15, y: 15, w: 15, h: 20, label: 'Pepsi 2L', status: 'passed' },
    { x: 35, y: 15, w: 15, h: 20, label: 'Pepsi 2L', status: 'passed' },
    { x: 55, y: 15, w: 15, h: 20, label: 'Pepsi 2L', status: 'passed' },
    { x: 20, y: 40, w: 12, h: 18, label: 'Pepsi 1.25L', status: 'passed' },
    { x: 50, y: 40, w: 12, h: 18, label: '7up 1.25L', status: 'passed' },
    { x: 70, y: 75, w: 15, h: 12, label: 'Price Tag', status: 'warning' },
  ]
};

export interface Door {
  id: string;
  label: string;
  url: string;
  boxes: BBox[];
}

interface PhotoGalleryProps {
  selectedIndex?: number;
  imageSrc?: string;
  boxes?: BBox[];
  doors?: Door[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ selectedIndex = 0, imageSrc, boxes, doors }) => {
  const [activeDoorId, setActiveDoorId] = useState<string>(doors?.[0]?.id || '');

  const currentDoor = doors ? doors.find(d => d.id === activeDoorId) : null;
  const displayImage = currentDoor ? currentDoor.url : (imageSrc || PHOTO.url);
  const displayBoxes = currentDoor ? currentDoor.boxes : (boxes || PHOTO.boxes);

  const [showBoxes, setShowBoxes] = useState(false);

  const getStatusColor = (status: string) => {
    if (status === 'passed') return 'border-emerald-500 bg-emerald-500/10 text-emerald-600';
    if (status === 'failed') return 'border-red-500 bg-red-500/10 text-red-600';
    return 'border-amber-500 bg-amber-500/10 text-amber-600';
  };

  return (
    <div className="bg-slate-900 rounded-[6px] max-h-[500px] relative overflow-hidden flex flex-col shadow-2xl border border-slate-800">
      {/* Door Tabs */}
      {doors && doors.length > 0 && (
        <div className="flex overflow-x-auto bg-slate-800/50 backdrop-blur-sm border-b border-white/10 no-scrollbar">
          {doors.map(door => (
            <button
              key={door.id}
              onClick={() => setActiveDoorId(door.id)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors ${activeDoorId === door.id
                ? 'text-white bg-white/10 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
            >
              {door.label}
            </button>
          ))}
        </div>
      )}


      <div className="flex-1 relative group bg-black overflow-hidden">
        <img
          src={displayImage}
          alt="Retail Visit"
          className="w-full h-full object-contain animate-in fade-in duration-500 select-none"
        />

        {showBoxes && displayBoxes.map((box, idx) => (
          <div
            key={idx}
            className={`absolute border-2 rounded-sm transition-all animate-in zoom-in-95 duration-300 ${getStatusColor(box.status)}`}
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.w}%`,
              height: `${box.h}%`,
            }}
          >
            <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-inherit border-inherit border text-[8px] font-black rounded-t rounded-br whitespace-nowrap shadow-sm">
              {box.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
