import React from 'react';
import { Calendar, Clock, Moon, MapPin } from 'lucide-react';

interface EventDetailsProps {
  date: string;
  time: string;
  islamicDate: string;
  venue: string;
  className?: string;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  date,
  time,
  islamicDate,
  venue,
  className = '',
}) => {
  return (
    <div className={`w-full max-w-[340px] mx-auto text-[#3D352F] text-[13px] sm:text-[14px] leading-relaxed ${className}`}>
      <div className="space-y-1.5 sm:space-y-2">
        {/* Date Row */}
        {date && (
          <div className="grid grid-cols-[85px_1fr] sm:grid-cols-[100px_1fr] items-baseline text-left">
            <span className="font-cormorant font-semibold tracking-wider text-[#8A6D2B] uppercase text-[12px] sm:text-[13px] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#B89028] shrink-0 opacity-70" />
              Date
            </span>
            <span className="font-cormorant font-medium text-[#2C241E] text-[14px] sm:text-[15px]">
              {date}
            </span>
          </div>
        )}

        {/* Time Row */}
        {time && (
          <div className="grid grid-cols-[85px_1fr] sm:grid-cols-[100px_1fr] items-baseline text-left">
            <span className="font-cormorant font-semibold tracking-wider text-[#8A6D2B] uppercase text-[12px] sm:text-[13px] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#B89028] shrink-0 opacity-70" />
              Time
            </span>
            <span className="font-cormorant font-medium text-[#2C241E] text-[14px] sm:text-[15px]">
              {time}
            </span>
          </div>
        )}

        {/* Islamic Date Row */}
        {islamicDate && (
          <div className="grid grid-cols-[85px_1fr] sm:grid-cols-[100px_1fr] items-baseline text-left">
            <span className="font-cormorant font-semibold tracking-wider text-[#8A6D2B] uppercase text-[12px] sm:text-[13px] flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-[#B89028] shrink-0 opacity-70" />
              Islamic Date
            </span>
            <span className="font-cormorant font-medium text-[#2C241E] text-[14px] sm:text-[15px]">
              {islamicDate}
            </span>
          </div>
        )}

        {/* Venue Row */}
        {venue && (
          <div className="grid grid-cols-[85px_1fr] sm:grid-cols-[100px_1fr] items-baseline text-left">
            <span className="font-cormorant font-semibold tracking-wider text-[#8A6D2B] uppercase text-[12px] sm:text-[13px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#B89028] shrink-0 opacity-70" />
              Venue
            </span>
            <span className="font-cormorant font-medium text-[#2C241E] text-[14px] sm:text-[15px]">
              {venue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
