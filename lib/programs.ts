export type ProgramType = 'group' | 'one-on-one' | 'rental' | 'party' | 'apparel';

export interface SessionGroup {
  label: string;
  sessions: string[];
}

export interface Program {
  id: string;
  name: string;
  type: ProgramType;
  description: string;
  dates: string;
  times: string;
  price: number;
  pricePerSession?: number;
  deposit?: number;
  totalPrice?: number;
  ageGroup?: string;
  spotsAvailable?: number;
  flyer?: string;
  active: boolean;
  sessions?: string[];
  sessionGroups?: SessionGroup[];
  adultOnly?: boolean;
  requiresDatePicker?: boolean;
  contactUrl?: string;
  availableDays?: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  calendarEventTitle?: string;
  timeSlots?: string[];
}

export const programs: Program[] = [
  {
    id: 'girls-only-micro-school',
    name: 'Girls Only Micro School',
    type: 'group',
    description: 'Academic excellence, elite soccer development, grow, learn, and thrive. No challenge, no change.',
    dates: 'Now Enrolling',
    times: 'TBD',
    price: 0,
    ageGroup: 'Girls',
    active: true,
    flyer: '/microschool.avif',
    contactUrl: 'https://api.whatsapp.com/message/BJABSIIAFSBEG1?autoload=1&app_absent=0',
  },
  {
    id: 'autism-kicks',
    name: 'Autism Kicks',
    type: 'group',
    description: 'Support, educate, advocate. A special soccer program designed for children with autism.',
    dates: 'May 2, 2026 - May 23, 2026',
    times: 'Saturdays 11:00AM - 11:50AM',
    price: 114.40,
    ageGroup: 'Ages 4-12',
    active: true,
    flyer: '/autism.avif',
  },
  {
    id: 'summer-camp-2026',
    name: 'Summer Camp 2026',
    type: 'group',
    description: 'A full-day summer camp experience combining soccer training with fun activities.',
    dates: 'June 3, 2026 - August 7, 2026',
    times: '9:00AM - 4:30PM',
    price: 360,
    active: true,
    flyer: '/summer-camp.avif',
  },
  {
    id: 'twinkle-little-stars',
    name: 'Twinkle Stars & Little Stars Soccer Classes',
    type: 'group',
    description: 'Develop new skills in a fun, nurturing environment for our youngest players.',
    dates: 'Ongoing',
    times: 'See schedule',
    price: 46.80,
    ageGroup: 'Ages 2-6',
    active: true,
    flyer: '/twinkle.avif',
  },
  {
    id: 'summer-training-academy',
    name: 'Shooting Stars Academy Summer Training',
    type: 'group',
    description: 'Intensive summer training program for youth players. Age groups use a September 1 cutoff. U6 & Under (U5, U6): Tuesday & Thursday 5:30PM–6:30PM. U7–U9 (U7, U8, U9): Monday & Wednesday 6:30PM–7:30PM. U10 & Up (U10, U11, U12): Monday & Wednesday 6:30PM–7:30PM. Not sure which group your child is in? We\'ll confirm when we call you after registration.',
    dates: 'June 8 - August 6, 2026',
    times: 'U6 & Under: Tue & Thu 5:30–6:30PM | U7–U9: Mon & Wed 6:30–7:30PM | U10 & Up: Mon & Wed 6:30–7:30PM',
    price: 360,
    pricePerSession: 20,
    ageGroup: 'U5–U12',
    active: true,
    flyer: '/training.avif',
    sessionGroups: [
      {
        label: 'U6 & Under (U5, U6) — Tue & Thu 5:30–6:30PM',
        sessions: [
          'June 9, 2026', 'June 11, 2026', 'June 16, 2026', 'June 18, 2026',
          'June 23, 2026', 'June 25, 2026', 'June 30, 2026', 'July 2, 2026',
          'July 7, 2026', 'July 9, 2026', 'July 14, 2026', 'July 16, 2026',
          'July 21, 2026', 'July 23, 2026', 'July 28, 2026', 'July 30, 2026',
          'August 4, 2026', 'August 6, 2026',
        ],
      },
      {
        label: 'U7–U9 (U7, U8, U9) — Mon & Wed 6:30–7:30PM',
        sessions: [
          'June 8, 2026', 'June 10, 2026', 'June 15, 2026', 'June 17, 2026',
          'June 22, 2026', 'June 24, 2026', 'June 29, 2026', 'July 1, 2026',
          'July 6, 2026', 'July 8, 2026', 'July 13, 2026', 'July 15, 2026',
          'July 20, 2026', 'July 22, 2026', 'July 27, 2026', 'July 29, 2026',
          'August 3, 2026', 'August 5, 2026',
        ],
      },
      {
        label: 'U10 & Up (U10, U11, U12) — Mon & Wed 6:30–7:30PM',
        sessions: [
          'June 8, 2026', 'June 10, 2026', 'June 15, 2026', 'June 17, 2026',
          'June 22, 2026', 'June 24, 2026', 'June 29, 2026', 'July 1, 2026',
          'July 6, 2026', 'July 8, 2026', 'July 13, 2026', 'July 15, 2026',
          'July 20, 2026', 'July 22, 2026', 'July 27, 2026', 'July 29, 2026',
          'August 3, 2026', 'August 5, 2026',
        ],
      },
    ],
  },
  {
    id: 'elite-group-training',
    name: 'Elite Group Training',
    type: 'group',
    description: 'High-level group training for players of all levels. Monday through Friday.',
    dates: 'Ongoing',
    times: 'Monday-Friday 4:30PM-5:25PM or 5:30PM-6:25PM or 6:30PM-7:30PM',
    price: 46.80,
    ageGroup: 'All Levels',
    spotsAvailable: 8,
    active: true,
    flyer: '/elite-group.avif',
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    timeSlots: ['4:30PM - 5:25PM', '5:30PM - 6:25PM', '6:30PM - 7:30PM'],
    calendarEventTitle: 'Elite Group Training',
  },
  {
    id: 'adult-open-play',
    name: 'Adult Open Play / Team Rentals',
    type: 'rental',
    description: 'Open play and field rentals for adult teams and players. After 7PM. Must be 18 or older.',
    dates: 'Ongoing',
    times: 'After 7:00PM',
    price: 72.80,
    active: true,
    adultOnly: true,
    flyer: '/adult-open.avif',
  },
  {
    id: 'individual-training',
    name: '1-on-1 Individual Training',
    type: 'one-on-one',
    description: '1-on-1 individual lesson with a Shooting Stars trainer focusing on ball mastery, first touch, and shooting. Must cancel 24 hours in advance or forfeit full payment. Indoor shoes only, no cleats.',
    dates: 'Mon, Tue, Wed & Thu',
    times: 'Mon & Wed: 4:30–5:30PM or 5:30–6:30PM | Tue & Thu: 4:30–5:30PM',
    price: 72.80,
    active: true,
    flyer: '/individual.avif',
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday'],
    timeSlots: ['4:30PM - 5:30PM', '5:30PM - 6:30PM'],
  },
  // Training Packages (grouped under one card)
  {
    id: 'training-10pack',
    name: '1-on-1 Training — 10 Session Package',
    type: 'one-on-one',
    description: 'Our private training program is second to none. Techniques include Speed, Agility, First Touch, Dribbling, Passing, Tactical, Receiving, and Shooting. Price includes 4% service charge.',
    dates: 'Mon, Tue, Wed & Thu',
    times: 'Mon & Wed: 4:30–5:30PM or 5:30–6:30PM | Tue & Thu: 4:30–5:30PM',
    price: 416.00,
    active: true,
    flyer: '/individual.avif',
  },
  {
    id: 'training-20pack',
    name: '1-on-1 Training — 20 Session Package',
    type: 'one-on-one',
    description: 'Our private training program is second to none. Techniques include Speed, Agility, First Touch, Dribbling, Passing, Tactical, Receiving, and Shooting. Price includes 4% service charge.',
    dates: 'Mon, Tue, Wed & Thu',
    times: 'Mon & Wed: 4:30–5:30PM or 5:30–6:30PM | Tue & Thu: 4:30–5:30PM',
    price: 728.00,
    active: true,
    flyer: '/individual.avif',
  },
  // Apparel
  {
    id: 'dri-fit-apparel',
    name: 'Shooting Stars Dri-Fit Apparel',
    type: 'apparel',
    description: 'Shooting Stars apparel should be worn at all times. Official Shooting Stars dri-fit shirt.',
    dates: 'Available now',
    times: '',
    price: 20.80,
    active: true,
    flyer: '/individual.avif',
  },
  // Birthday Party Packages
  {
    id: 'birthday-silver',
    flyer: '/birthday.avif',
    name: 'Silver Birthday Party',
    type: 'party',
    description: 'Birthday parties are Fridays, Saturdays and Sundays. More than 20 kids? $12 per child. Want to rent the other field? Add $80 per hour.',
    dates: 'Fridays, Saturdays & Sundays',
    times: '12:00PM - 2:00PM, 4:00PM - 6:00PM, or 6:30PM - 8:30PM',
    price: 156.50,
    deposit: 156.50,
    totalPrice: 485,
    active: true,
    availableDays: ['friday', 'saturday', 'sunday'],
    timeSlots: ['12:00PM - 2:00PM', '4:00PM - 6:00PM', '6:30PM - 8:30PM'],
    calendarEventTitle: 'Silver Birthday Party',
  },
  {
    id: 'birthday-gold',
    flyer: '/birthday.avif',
    name: 'Gold Birthday Party',
    type: 'party',
    description: 'Birthday parties are Fridays, Saturdays and Sundays. More than 20 kids? $12 per child. Want to rent the other field? Add $80 per hour. The 12-3pm slot is Saturdays and Sundays only.',
    dates: 'Fridays, Saturdays & Sundays',
    times: '12:00PM - 3:00PM, 4:00PM - 7:00PM, or 6:30PM - 9:30PM',
    price: 156.50,
    deposit: 156.50,
    totalPrice: 585,
    active: true,
    availableDays: ['friday', 'saturday', 'sunday'],
    timeSlots: ['12:00PM - 3:00PM (Sat & Sun only)', '4:00PM - 7:00PM', '6:30PM - 9:30PM'],
    calendarEventTitle: 'Gold Birthday Party',
  },
];
