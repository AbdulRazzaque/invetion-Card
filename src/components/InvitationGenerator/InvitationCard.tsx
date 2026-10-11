import React, { forwardRef } from 'react';
import { InvitationData } from '../../types/invitation';
import { FloralDecoration } from './FloralDecoration';
import { GoldFrame } from './GoldFrame';
import { EventDetails } from './EventDetails';
import { QuranVerse } from './QuranVerse';
import { formatGuestDisplayName } from '../../utils/individualCardExport';

interface InvitationCardProps {
  data: InvitationData;
  className?: string;
  isExporting?: boolean;
}

export const InvitationCard = forwardRef<HTMLDivElement, InvitationCardProps>(
  ({ data, className = '', isExporting = false }, ref) => {
    // Format guest display name
    const guestDisplayName = React.useMemo(() => {
      return formatGuestDisplayName(data.guestName, data.guestTitle, data.familyMode) || null;
    }, [data.guestName, data.guestTitle, data.familyMode]);

    return (
      <div
        ref={ref}
        id="wedding-invitation-card"
        className={`relative w-full max-w-[540px] aspect-[5/7] bg-[#FAF7F2] text-[#2C241E] overflow-hidden select-none transition-shadow duration-300 font-cormorant ${
          isExporting ? '' : 'shadow-luxury hover:shadow-2xl'
        } ${className}`}
        style={{
          boxSizing: 'border-box',
        }}
      >
        {/* Soft Parchment Paper Texture Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
          style={{
            backgroundImage: `radial-gradient(#E8DFC9 0.75px, transparent 0.75px), radial-gradient(#E8DFC9 0.75px, #FAF7F2 0.75px)`,
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0, 15px 15px',
          }}
        />

        {/* Watercolor Florals Framing */}
        <FloralDecoration />

        {/* Ornate Gold Filigree Border & Corners */}
        <GoldFrame />

        {/* Invitation Text Content Container */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between py-6 sm:py-8 px-5 sm:px-8 text-center">
          
          {/* TOP SECTION: Bismillah & Blessings */}
          <div className="space-y-0.5 sm:space-y-1 pt-0.5">
            {data.bismillahText && (
              <div className="font-arabic text-[#8A6D2B] text-[17px] sm:text-[21px] tracking-wide leading-tight drop-shadow-sm">
                {data.bismillahText}
              </div>
            )}

            {data.blessingText && (
              <p className="font-cormorant italic text-[#725C26] text-[11.5px] sm:text-[12.5px] tracking-wider">
                {data.blessingText}
              </p>
            )}

            {/* Small Gold Divider */}
            <div className="flex items-center justify-center gap-2 pt-0.5 opacity-70">
              <span className="w-8 h-[0.75px] bg-gradient-to-r from-transparent to-[#B89028]" />
              <svg className="w-3.5 h-3.5 text-[#B89028]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.5 9L20 10.5L13.5 12L12 19L10.5 12L4 10.5L10.5 9L12 2Z" />
              </svg>
              <span className="w-8 h-[0.75px] bg-gradient-to-l from-transparent to-[#B89028]" />
            </div>
          </div>

          {/* MAIN HEADER: Event Title */}
          <div className="space-y-0.5">
            <h1 className="font-cormorant font-semibold text-[#8B6B23] tracking-[0.2em] sm:tracking-[0.25em] text-[19px] sm:text-[23px] uppercase leading-tight">
              {data.eventTitle || 'RECEPTION CEREMONY'}
            </h1>
            {data.subEventTitle && (
              <p className="text-[11.5px] font-medium tracking-widest uppercase text-[#967B38]">
                {data.subEventTitle}
              </p>
            )}

            <div className="space-y-0.5 pt-0.5">
              <p className="font-cormorant italic text-[#4A3F35] text-[11.5px] sm:text-[12.5px] leading-tight">
                {data.invitationIntro || 'You are cordially invited to attend'}
              </p>
              <p className="font-cormorant italic text-[#4A3F35] text-[11.5px] sm:text-[12.5px] leading-tight">
                {data.receptionOfText || 'the Reception ceremony of'}
              </p>
            </div>
          </div>

          {/* GROOM & BRIDE NAMES */}
          <div className="py-0.5 space-y-0.5 sm:space-y-1">
            <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-0.5 font-cormorant font-bold text-[#6D4E12] tracking-wide text-[18px] sm:text-[21px] leading-tight">
              <span className="whitespace-nowrap">{data.groomName || 'ABDUSSAMAD'}</span>
              <span className="font-script text-[18px] sm:text-[21px] font-normal lowercase mx-0.5 text-[#9E7B2F]">
                and
              </span>
              <span className="whitespace-nowrap">{data.brideName || 'ABDUL AZIZ'}</span>
            </div>

            {data.fatherName && (
              <p className="font-cormorant text-[#5A4D43] text-[11.5px] sm:text-[13px] tracking-wide mt-1">
                {data.fatherName.startsWith('S/O') ? data.fatherName : `S/O ${data.fatherName}`}
              </p>
            )}
          </div>

          {/* PERSONALIZED GUEST HONOR BAR */}
          <div className="my-0.5 py-1 px-3 sm:px-4 rounded-lg bg-gradient-to-r from-transparent via-[#F7EFE1]/80 to-transparent border-y border-[#D4AF37]/30 max-w-[390px] mx-auto w-full transition-all duration-300">
            <p className="text-[9.5px] sm:text-[10.5px] tracking-widest uppercase text-[#94721C] font-semibold mb-0.5">
              Cordially Invited
            </p>
            <div className="font-cormorant font-bold text-[16px] sm:text-[18px] text-[#4A3614] tracking-wide leading-snug">
              {guestDisplayName ? (
                <span>
                  {data.familyMode ? '' : 'Dear '}
                  <span className="text-[#7A5714] underline decoration-[#D4AF37]/40 decoration-1 underline-offset-4">
                    {guestDisplayName}
                  </span>
                </span>
              ) : (
                <span className="text-[#A39282] italic font-normal text-[14px] sm:text-[16px]">
                  Dear [Guest Name]
                </span>
              )}
            </div>
          </div>

          {/* EVENT DETAILS (Date, Time, Islamic Date, Venue) */}
          <div className="py-0.5">
            <EventDetails
              date={data.date}
              time={data.time}
              islamicDate={data.islamicDate}
              venue={data.venue}
            />
          </div>

          {/* QURAN VERSE */}
          <div className="py-0.5">
            <QuranVerse
              verse={data.quranVerse}
              reference={data.quranReference}
            />
          </div>

          {/* FAMILY COMPLIMENTS */}
          <div className="space-y-0.5 pb-1">
            {data.familyMessage && (
              <p className="font-cormorant text-[11px] sm:text-[12px] text-[#695B50] tracking-wide">
                {data.familyMessage}
              </p>
            )}
            {data.familySurname && (
              <p className="font-cormorant font-medium text-[11px] sm:text-[12.5px] text-[#4A3D34] tracking-wide">
                {data.familySurname}
              </p>
            )}
          </div>

        </div>
      </div>
    );
  }
);

InvitationCard.displayName = 'InvitationCard';
