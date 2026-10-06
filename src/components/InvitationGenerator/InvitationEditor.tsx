import React, { useState } from 'react';
import {
  User,
  Users,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { InvitationData, GuestTitle } from '../../types/invitation';
import { InvitationActions } from './InvitationActions';

interface InvitationEditorProps {
  data: InvitationData;
  updateField: <K extends keyof InvitationData>(field: K, value: InvitationData[K]) => void;
  hasChanges: boolean;
  onReset: () => void;
  onGenerate: () => void;
  isExporting: boolean;
  isSharing: boolean;
  onDownload: () => void;
  onShare: () => void;
  onWhatsApp: () => void;
  onCopy: () => void;
  onPrint: () => void;
}

const TITLE_OPTIONS: { label: string; value: GuestTitle }[] = [
  { label: 'Mr.', value: 'Mr.' },
  { label: 'Mrs.', value: 'Mrs.' },
  { label: 'Ms.', value: 'Ms.' },
  { label: 'Dr.', value: 'Dr.' },
  { label: 'Family', value: 'Family' },
  { label: 'Guest', value: 'Guest' },
  { label: 'None', value: 'None' },
];

const SAMPLE_GUESTS = [
  { title: 'Mr.' as GuestTitle, name: 'Abdul Rahman' },
  { title: 'Dr.' as GuestTitle, name: 'Ahmed Khan' },
  { title: 'Family' as GuestTitle, name: 'The Farooqi Family', isFamily: true },
  { title: 'Mr.' as GuestTitle, name: 'Mustafa Ali & Family' },
];

export const InvitationEditor: React.FC<InvitationEditorProps> = ({
  data,
  updateField,
  hasChanges,
  onReset,
  onGenerate,
  isExporting,
  isSharing,
  onDownload,
  onShare,
  onWhatsApp,
  onCopy,
  onPrint,
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [verseOpen, setVerseOpen] = useState(false);

  const applySampleGuest = (sample: typeof SAMPLE_GUESTS[0]) => {
    updateField('guestTitle', sample.title);
    updateField('guestName', sample.name);
    if (sample.isFamily !== undefined) {
      updateField('familyMode', sample.isFamily);
    }
    onGenerate();
  };

  return (
    <div className="w-full space-y-6">
      
      {/* SECTION 1: PROMINENT GUEST NAME CARD */}
      <div className="bg-[#FAF7F1] border border-[#E6D9C3] rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
        {/* Subtle decorative gold corner wash */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#F2E5C9]/50 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#F5ECDB] text-[#8C6D27]">
              {data.familyMode ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </span>
            <label htmlFor="guest-name-input" className="font-cormorant font-bold text-xl text-[#362A1F]">
              Guest Personalization
            </label>
          </div>

          {/* Invite a Family Switch */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-sans font-medium text-[#6F6052]">
              Invite Family
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={data.familyMode}
              onClick={() => updateField('familyMode', !data.familyMode)}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                data.familyMode ? 'bg-[#9C792E]' : 'bg-[#DCD2C1]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  data.familyMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <p className="text-[12.5px] text-[#78695A] mb-4">
          {data.familyMode
            ? 'Personalize with the honored family name (e.g. "The Qureshi Family").'
            : 'Enter the guest name to automatically personalize the card in real-time.'}
        </p>

        {/* Input Row: Title Selector + Name Input */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-3">
          {!data.familyMode && (
            <div className="sm:w-28 shrink-0">
              <label htmlFor="guest-title-select" className="sr-only">Title</label>
              <select
                id="guest-title-select"
                value={data.guestTitle}
                onChange={(e) => updateField('guestTitle', e.target.value as GuestTitle)}
                className="w-full px-3 py-3 rounded-xl bg-white border border-[#D9CBB3] text-[#33271D] text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#C8A251]/50 focus:border-[#C8A251] shadow-inner transition-all"
              >
                {TITLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="relative flex-1">
            <input
              id="guest-name-input"
              type="text"
              value={data.guestName}
              onChange={(e) => updateField('guestName', e.target.value)}
              placeholder={data.familyMode ? 'e.g. The Ahmed Family' : 'Enter guest name (e.g. Abdul Rahman)'}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#D9CBB3] text-[#2C2219] text-[15px] font-medium placeholder-[#A39482] focus:outline-none focus:ring-2 focus:ring-[#C8A251]/50 focus:border-[#C8A251] shadow-inner transition-all"
            />
            {data.guestName && (
              <button
                type="button"
                onClick={() => updateField('guestName', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#8C7D6F] hover:text-[#33271D] px-1.5 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Quick Sample Guest Chips */}
        <div className="flex items-center flex-wrap gap-1.5 pt-1 mb-4">
          <span className="text-[11px] text-[#8A7A6B] font-medium pr-1">Try:</span>
          {SAMPLE_GUESTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applySampleGuest(sample)}
              className="text-[11.5px] px-2.5 py-1 rounded-full bg-[#F3EBE0] hover:bg-[#EADBCE] text-[#594B3C] border border-[#E0D3C1] transition-colors"
            >
              {sample.title !== 'None' ? `${sample.title} ` : ''}{sample.name}
            </button>
          ))}
        </div>

        {/* Generate Invitation Button */}
        <button
          type="button"
          onClick={onGenerate}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-sans font-medium text-[14px] text-[#423114] bg-gradient-to-r from-[#F0DFBE] via-[#F8ECCF] to-[#F0DFBE] hover:from-[#E8D4AE] hover:to-[#E8D4AE] border border-[#DFC389] shadow-sm hover:shadow transition-all duration-200 active:scale-[0.99]"
        >
          <Sparkles className="w-4 h-4 text-[#8C6D27]" />
          <span>Generate & Personalize Card</span>
        </button>
      </div>

      {/* SECTION 2: EVENT DETAILS ACCORDION */}
      <div className="bg-[#FAF7F1] border border-[#E6D9C3] rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setDetailsOpen(!detailsOpen)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F5EFE4] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#F5ECDB] text-[#8C6D27]">
              <Calendar className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-cormorant font-bold text-lg text-[#362A1F]">
                Event & Couple Details
              </h3>
              <p className="text-[11.5px] text-[#7A6B5C]">
                Reception Ceremony, Bride & Groom, Venue, Dates
              </p>
            </div>
          </div>
          {detailsOpen ? (
            <ChevronUp className="w-5 h-5 text-[#8C7A6B]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#8C7A6B]" />
          )}
        </button>

        {detailsOpen && (
          <div className="p-5 pt-0 border-t border-[#EDE4D4] space-y-4">
            
            {/* Event Title */}
            <div>
              <label className="block text-[12px] font-sans font-medium text-[#665748] mb-1">
                Event Title
              </label>
              <input
                type="text"
                value={data.eventTitle}
                onChange={(e) => updateField('eventTitle', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9CBB3] text-[#2C2219] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C8A251]/50 focus:border-[#C8A251]"
              />
            </div>

            {/* Groom & Bride Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-sans font-medium text-[#665748] mb-1">
                  Groom Name
                </label>
                <input
                  type="text"
                  value={data.groomName}
                  onChange={(e) => updateField('groomName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9CBB3] text-[#2C2219] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C8A251]/50 focus:border-[#C8A251]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-sans font-medium text-[#665748] mb-1">
                  Bride Name
                </label>
                <input
                  type="text"
                  value={data.brideName}
                  onChange={(e) => updateField('brideName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9CBB3] text-[#2C2219] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C8A251]/50 focus:border-[#C8A251]"
                />
              </div>
            </div>

            {/* Father's Name / Relation */}
            <div>
              <label className="block text-[12px] font-sans font-medium text-[#665748] mb-1">
                Father / Host Name
              </label>
              <input
                type="text"
                value={data.fatherName}
                onChange={(e) => updateField('fatherName', e.target.value)}
                placeholder="Mr. Abdul Qadir Abdul Rahim Mhaslayi"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9CBB3] text-[#2C2219] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C8A251]/50 focus:border-[#C8A251]"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-sans font-medium text-[#665748] mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#967B38]" /> Date
                </label>
                <input
                  type="text"
                  value={data.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  placeholder="Sunday 15th November 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9CBB3] text-[#2C2219] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C8A251]/50 focus:border-[#C8A251]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-sans font-medium text-[#665748] mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#967B38]" /> Time
                </label>
                <input
                  type="text"
                  value={data.time}
                  onChange={(e) => updateField('time', e.target.value)}
                  placeholder="12:30 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9CBB3] text-[#2C2219] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C8A251]/50 focus:border-[#C8A251]"
                />
              </div>
            </div>

            {/* Islamic Date & Venue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-sans font-medium text-[#665748] mb-1">
                  Islamic Date
                </label>
                <input
                  type="text"
                  value={data.islamicDate}
                  onChange={(e) => updateField('islamicDate', e.target.value)}
                  placeholder="4 Jamadilakhir 1448H"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9CBB3] text-[#2C2219] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C8A251]/50 focus:border-[#C8A251]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-sans font-medium text-[#665748] mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#967B38]" /> Venue
                </label>
                <input
                  type="text"
                  value={data.venue}
                  onChange={(e) => updateField('venue', e.target.value)}
                  placeholder="Naseema Residency"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9CBB3] text-[#2C2219] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C8A251]/50 focus:border-[#C8A251]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: BLESSINGS, QURAN VERSE & FAMILY COMPLIMENTS ACCORDION */}
      <div className="bg-[#FAF7F1] border border-[#E6D9C3] rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setVerseOpen(!verseOpen)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F5EFE4] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-[#F5ECDB] text-[#8C6D27]">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-cormorant font-bold text-lg text-[#362A1F]">
                Blessings & Family Compliments
              </h3>
              <p className="text-[11.5px] text-[#7A6B5C]">
                Bismillah, Quran Verse 30:21, Family greetings
              </p>
            </div>
          </div>
          {verseOpen ? (
            <ChevronUp className="w-5 h-5 text-[#8C7A6B]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#8C7A6B]" />
          )}
        </button>

        {verseOpen && (
          <div className="p-5 pt-0 border-t border-[#EDE4D4] space-y-4">
            
            {/* Bismillah Text */}
            <div>
              <label className="block text-[12px] font-sans font-medium text-[#665748] mb-1">
                Bismillah Calligraphy (Arabic)
              </label>
              <input
                type="text"
                value={data.bismillahText}
                onChange={(e) => updateField('bismillahText', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9CBB3] text-[#2C2219] text-[15px] font-arabic focus:outline-none focus:ring-2 focus:ring-[#C8A251]/50 focus:border-[#C8A251]"
                dir="rtl"
              />
            </div>

            {/* Quran Verse */}
            <div>
              <label className="block text-[12px] font-sans font-medium text-[#665748] mb-1">
                Quran Verse Reference
              </label>
              <input
                type="text"
                value={data.quranReference}
                onChange={(e) => updateField('quranReference', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9CBB3] text-[#2C2219] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C8A251]/50 focus:border-[#C8A251]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-sans font-medium text-[#665748] mb-1">
                Quran Verse Translation
              </label>
              <textarea
                rows={3}
                value={data.quranVerse}
                onChange={(e) => updateField('quranVerse', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9CBB3] text-[#2C2219] text-[13px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#C8A251]/50 focus:border-[#C8A251]"
              />
            </div>

            {/* Compliments Text */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-sans font-medium text-[#665748] mb-1">
                  Compliments Header
                </label>
                <input
                  type="text"
                  value={data.familyMessage}
                  onChange={(e) => updateField('familyMessage', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9CBB3] text-[#2C2219] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C8A251]/50 focus:border-[#C8A251]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-sans font-medium text-[#665748] mb-1">
                  Family Names
                </label>
                <input
                  type="text"
                  value={data.familySurname}
                  onChange={(e) => updateField('familySurname', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9CBB3] text-[#2C2219] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#C8A251]/50 focus:border-[#C8A251]"
                />
              </div>
            </div>

          </div>
        )}
      </div>

      {/* SECTION 4: ACTIONS PANEL (Download, Share, WhatsApp, Print, Copy) */}
      <InvitationActions
        data={data}
        isExporting={isExporting}
        isSharing={isSharing}
        hasChanges={hasChanges}
        onDownload={onDownload}
        onShare={onShare}
        onWhatsApp={onWhatsApp}
        onCopy={onCopy}
        onPrint={onPrint}
        onReset={onReset}
      />

    </div>
  );
};
