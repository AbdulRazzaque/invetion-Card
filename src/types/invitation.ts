export type GuestTitle = 'Mr.' | 'Mrs.' | 'Ms.' | 'Dr.' | 'Family' | 'Guest' | 'None';

export type TemplateStyle = 'floral-islamic' | 'minimal-elegance' | 'royal-gold';

export interface InvitationData {
  guestName: string;
  guestTitle: GuestTitle;
  eventTitle: string;
  subEventTitle?: string;
  groomName: string;
  brideName: string;
  fatherName: string;
  date: string;
  time: string;
  islamicDate: string;
  venue: string;
  quranVerse: string;
  quranReference: string;
  familyMessage: string;
  familySurname: string;
  familyMode: boolean;
  bismillahText: string;
  blessingText: string;
  invitationIntro: string;
  receptionOfText: string;
  templateStyle: TemplateStyle;
}

export const DEFAULT_INVITATION_DATA: InvitationData = {
  guestName: '',
  guestTitle: 'Mr.',
  eventTitle: 'RECEPTION CEREMONY',
  subEventTitle: '',
  groomName: 'ABDUSSAMAD',
  brideName: 'ABDUL AZIZ',
  fatherName: 'Mr. Abdul Qadir Abdul Rahim Mhaslayi',
  date: 'Sunday 15th November 2026',
  time: '12:30 PM',
  islamicDate: '4 Jamadilakhir 1448H',
  venue: 'Naseema Residency',
  quranVerse: '“And among His Signs is this that He created for you mates from among yourselves that you may dwell in tranquility with them and He has put love and mercy between your hearts.”',
  quranReference: "Qur'an 30:21",
  familyMessage: 'Compliments from Mr. & Mrs.',
  familySurname: 'Naseema Abdul Qadir Abdul Rahim Mhaslayi and Sane Family.',
  familyMode: false,
  bismillahText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
  blessingText: 'With the blessings of Allah Almighty',
  invitationIntro: 'You are cordially invited to attend',
  receptionOfText: 'the Reception ceremony of',
  templateStyle: 'floral-islamic',
};
