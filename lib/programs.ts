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
  registrationFee?: number;
  registrationClosed?: boolean;
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
    id: 'twinkle-stars',
    name: 'Twinkle Stars Soccer Classes',
    type: 'group',
    description: 'Develop new skills in a fun, nurturing environment for our youngest players.',
    dates: 'June 26, 2026 – August 8, 2026 (No class July 4th)',
    times: 'Saturdays 9:10AM–9:55AM',
    price: 160,
    ageGroup: 'Ages 2-3',
    active: true,
    flyer: '/twinkle.avif',
    registrationClosed: true,
  },
  {
    id: 'little-stars',
    name: 'Little Stars Soccer Classes',
    type: 'group',
    description: 'Develop new skills in a fun, nurturing environment for our youngest players.',
    dates: 'June 26, 2026 – August 8, 2026 (No class July 4th)',
    times: 'Saturdays 10:00AM–11:00AM',
    price: 160,
    ageGroup: 'Ages 4-6',
    active: true,
    registrationClosed: true,
    flyer: '/twinkle.avif',
  },
  {
    id: 'autism-kicks',
    name: 'Autism Kicks',
    type: 'group',
    description: 'Support, educate, advocate. A special soccer program designed for children with autism.',
    dates: 'June 20, 2026 - July 18, 2026 (No class July 4th)',
    times: 'Saturdays 11:00AM - 11:50AM',
    price: 114.40,
    ageGroup: 'Ages 4-12',
    active: true,
    flyer: '/autism.avif',
    registrationClosed: true,
  },
  {
    id: 'summer-camp-2026',
    name: 'Summer Camp 2026',
    type: 'group',
    description: 'A full-day summer camp experience combining soccer training with fun activities. One week remaining — register now!',
    registrationFee: 50,
    dates: 'July 20–24, 2026',
    times: '9:00AM - 4:30PM',
    price: 360,
    pricePerSession: 360,
    active: true,
    flyer: '/summer-camp.avif',
    sessionGroups: [
      {
        label: 'Summer Camp 2026',
        sessions: [
          'Week 7: July 20–24',
        ],
      },
    ],
  },
  {
    id: 'summer-training-academy',
    name: 'Shooting Stars Academy Summer Training',
    type: 'group',
    description: 'Intensive summer training for players ages 4–12. U6 & Under train Tue & Thu 5:30–6:30PM. U7–U9 and U10+ train Mon & Wed 6:30–7:30PM. Full season payment at registration. Shirts sold separately.',
    dates: 'June 8 - August 6, 2026',
    times: 'U6 & Under: Tue & Thu 5:30–6:30PM | U7–U9 & U10+: Mon & Wed 6:30–7:30PM',
    price: 360,
    ageGroup: 'U5–U12',
    active: true,
    flyer: '/training.avif',
  },
  {
    id: 'elite-group-training',
    name: 'Elite Group Training',
    type: 'group',
    description: 'High-level group training for players of all levels. Monday through Friday. Drop-in or purchase a package.',
    dates: 'Ongoing',
    times: 'Mon–Thu: 4:30PM–5:25PM | Fri: 4:30PM–5:25PM or 5:30PM–6:25PM',
    price: 46.80,
    ageGroup: 'All Levels',
    spotsAvailable: 8,
    active: true,
    flyer: '/elite-group.avif',
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    timeSlots: ['4:30PM - 5:25PM', '5:30PM - 6:25PM'],
    calendarEventTitle: 'Elite Group Training',
  },
  {
    id: 'adult-open-play',
    name: 'Adult Open Play / Team Rentals',
    type: 'rental',
    description: 'Field rental for adult teams and players. $100/hour for up to 10 players. $10 per additional player. Must be 18 or older.',
    dates: 'Mon, Tue, Wed & Thu',
    times: 'Mon/Tue/Thu: 7:30PM–8:30PM or 8:30PM–9:30PM | Wed: 9:30PM–10:30PM',
    price: 104.00,
    active: true,
    adultOnly: true,
    flyer: '/adult-open.avif',
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday'],
    timeSlots: ['7:30PM - 8:30PM', '8:30PM - 9:30PM', '9:30PM - 10:30PM'],
  },
  {
    id: 'individual-training',
    name: '1-on-1 Individual Training',
    type: 'one-on-one',
    description: '1-on-1 individual lesson with a Shooting Stars trainer focusing on ball mastery, first touch, and shooting. Must cancel 24 hours in advance or forfeit full payment. Indoor shoes only, no cleats.',
    dates: 'Monday through Friday',
    times: 'Monday through Friday 4:30PM–5:25PM',
    price: 78.00,
    active: true,
    flyer: '/individual.avif',
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    timeSlots: ['4:30PM - 5:25PM'],
  },
  // Training Packages (grouped under one card)
  {
    id: 'training-10pack',
    name: '1-on-1 Training — 10 Session Package',
    type: 'one-on-one',
    description: 'Our private training program is second to none. Techniques include Speed, Agility, First Touch, Dribbling, Passing, Tactical, Receiving, and Shooting. Price includes 4% service charge.',
    dates: 'Monday through Friday',
    times: 'Monday through Friday 4:30PM–5:25PM',
    price: 728.00,
    active: true,
    flyer: '/individual.avif',
  },
  {
    id: 'training-20pack',
    name: '1-on-1 Training — 20 Session Package',
    type: 'one-on-one',
    description: 'Our private training program is second to none. Techniques include Speed, Agility, First Touch, Dribbling, Passing, Tactical, Receiving, and Shooting. Price includes 4% service charge.',
    dates: 'Monday through Friday',
    times: 'Monday through Friday 4:30PM–5:25PM',
    price: 728.00,
    active: false,
    flyer: '/individual.avif',
  },
  // Group Training Packages
  {
    id: 'group-training-10pack',
    name: 'Group Training — 10 Session Package',
    type: 'group',
    description: 'Save with a 10-session group training package. High-level training focusing on Speed, Agility, First Touch, Dribbling, and Tactical play. Must cancel 24 hours in advance or forfeit session. Price includes 4% service charge.',
    dates: 'Mon–Fri',
    times: 'Mon–Thu: 4:30PM–5:25PM | Fri: 4:30PM–5:25PM or 5:30PM–6:25PM',
    price: 416.00,
    active: true,
    flyer: '/elite-group.avif',
  },
  {
    id: 'group-training-20pack',
    name: 'Group Training — 20 Session Package',
    type: 'group',
    description: 'Best value. 20 group training sessions with a Shooting Stars trainer. High-level training focusing on Speed, Agility, First Touch, Dribbling, and Tactical play. Must cancel 24 hours in advance or forfeit session. Price includes 4% service charge.',
    dates: 'Mon–Fri',
    times: 'Mon–Thu: 4:30PM–5:25PM | Fri: 4:30PM–5:25PM or 5:30PM–6:25PM',
    price: 728.00,
    active: true,
    flyer: '/elite-group.avif',
  },
  // Apparel
  {
    id: 'dri-fit-apparel',
    name: 'Shooting Stars Dri-Fit Apparel',
    type: 'apparel',
    description: 'Official Shooting Stars dri-fit shirt. Available in blue, black, and pink.',
    dates: 'Available now',
    times: '',
    price: 20.80,
    active: true,
    flyer: '/individual.avif',
  },
  {
    id: 'cotton-apparel',
    name: 'Shooting Stars Cotton Shirt',
    type: 'apparel',
    description: 'Official Shooting Stars cotton shirt. Available in blue.',
    dates: 'Available now',
    times: '',
    price: 10.40,
    active: true,
    flyer: '/individual.avif',
  },
  // Birthday Party Packages
  {
    id: 'birthday-silver',
    flyer: '/birthday.avif',
    name: 'Silver Birthday Party',
    type: 'party',
    description: 'Birthday parties are Fridays, Saturdays and Sundays. After you reach your limit of 20 kids, $12 per child will apply. Want to rent the other field? Add $80 per hour.',
    dates: 'Fridays, Saturdays & Sundays',
    times: 'Sat & Sun: 12:00PM–2:00PM or 4:00PM–6:00PM | Fri: 6:30PM–8:30PM only',
    price: 156.50,
    deposit: 156.50,
    totalPrice: 485,
    active: true,
    availableDays: ['friday', 'saturday', 'sunday'],
    timeSlots: ['12:00PM - 2:00PM (Sat & Sun only)', '4:00PM - 6:00PM (Sat & Sun only)', '6:30PM - 8:30PM (Fri only)'],
    calendarEventTitle: 'Silver Birthday Party',
  },
  {
    id: 'birthday-gold',
    flyer: '/birthday.avif',
    name: 'Gold Birthday Party',
    type: 'party',
    description: 'Birthday parties are Fridays, Saturdays and Sundays. After you reach your limit of 20 kids, $12 per child will apply. Want to rent the other field? Add $80 per hour. The 12-3pm slot is Saturdays and Sundays only.',
    dates: 'Fridays, Saturdays & Sundays',
    times: 'Sat & Sun: 12:00PM–3:00PM or 4:00PM–7:00PM | Fri: 6:30PM–9:30PM only',
    price: 156.50,
    deposit: 156.50,
    totalPrice: 585,
    active: true,
    availableDays: ['friday', 'saturday', 'sunday'],
    timeSlots: ['12:00PM - 3:00PM (Sat & Sun only)', '4:00PM - 7:00PM (Sat & Sun only)', '6:30PM - 9:30PM (Fri only)'],
    calendarEventTitle: 'Gold Birthday Party',
  },
];
