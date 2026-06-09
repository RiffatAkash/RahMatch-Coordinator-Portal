import { Member, MatchRequest } from './types';

// Helper function to encode SVG string safely for CSS and img HTML tags, keeping code 100% readable
const svgToDataUrl = (svgString: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

export const MALE_AVATAR_1_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#F1F5F9" />
  <path d="M70 400 C70 300, 120 230, 200 230 C280 230, 330 300, 330 400 Z" fill="#1E293B" />
  <path d="M160 230 L240 230 L220 310 L180 310 Z" fill="#93C5FD" />
  <path d="M160 230 L200 280 L180 230 Z" fill="#60A5FA" />
  <path d="M240 230 L200 280 L220 230 Z" fill="#60A5FA" />
  <path d="M190 270 L210 270 L215 380 L200 400 L185 380 Z" fill="#EF4444" />
  <polygon points="190,265 210,265 215,280 185,280" fill="#DC2626" />
  <path d="M170 190 Q200 230 230 190 L220 260 H180 Z" fill="#FDBA74" />
  <path d="M170 190 Q200 230 230 190" fill="none" stroke="#E2E8F0" stroke-width="2" />
  <ellipse cx="200" cy="155" rx="55" ry="70" fill="#FDBA74" />
  <path d="M140 150 C140 80, 260 80, 260 150 C260 150, 270 140, 270 120 C270 70, 130 70, 130 120 Z" fill="#92400E" />
  <path d="M145 120 C165 65, 235 65, 255 100 C240 90, 210 90, 200 95 C185 85, 160 95, 145 120 Z" fill="#B45309" />
</svg>
`;

export const MALE_AVATAR_2_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#EDF2F7" />
  <path d="M60 400 C60 310, 110 240, 200 240 C290 240, 340 310, 340 400 Z" fill="#7C3AED" />
  <path d="M170 200 L230 200 L215 260 L185 260 Z" fill="#D97706" />
  <path d="M165 240 C180 255, 220 255, 235 240" fill="none" stroke="#6D28D9" stroke-width="4" />
  <ellipse cx="200" cy="160" rx="55" ry="70" fill="#EAB308" />
  <path d="M140 150 C140 80, 260 80, 260 150 C260 150, 275 140, 275 110 C275 60, 125 60, 125 110 Z" fill="#0F172A" />
  <path d="M140 120 C160 70, 240 70, 260 110 C240 95, 205 95, 195 102 C180 90, 155 100, 140 120 Z" fill="#1E293B" />
</svg>
`;

export const MALE_AVATAR_3_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#F8FAFC" />
  <path d="M60 400 C60 320, 110 250, 200 250 C290 250, 340 320, 340 400 Z" fill="#EA580C" />
  <path d="M170 240 L230 240 L200 360 Z" fill="#475569" />
  <line x1="200" y1="280" x2="200" y2="400" stroke="#94A3B8" stroke-width="4" />
  <rect x="197" y="278" width="6" height="15" rx="2" fill="#E2E8F0" />
  <path d="M135 250 C135 220, 160 220, 185 245" fill="none" stroke="#C2410C" stroke-width="6" stroke-linecap="round" />
  <path d="M265 250 C265 220, 240 220, 215 245" fill="none" stroke="#C2410C" stroke-width="6" stroke-linecap="round" />
  <line x1="165" y1="250" x2="165" y2="310" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round" />
  <circle cx="165" cy="310" r="5" fill="#94A3B8" />
  <line x1="235" y1="250" x2="235" y2="310" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round" />
  <circle cx="235" cy="310" r="5" fill="#94A3B8" />
  <path d="M175 200 L225 200 L215 260 L185 260 Z" fill="#FFDBB5" />
  <ellipse cx="200" cy="160" rx="55" ry="70" fill="#FFDBB5" />
  <path d="M145 150 C145 220, 255 220, 255 150 C255 180, 245 210, 200 215 C155 210, 145 180, 145 150 Z" fill="#451A03" />
  <path d="M170 175 C185 185, 215 185, 230 175 C215 178, 185 178, 170 175 Z" fill="#451A03" />
  <path d="M140 150 C140 85, 260 85, 260 150 C260 150, 270 140, 270 115 C270 65, 130 65, 130 115 Z" fill="#451A03" />
  <path d="M142 120 C162 70, 238 70, 258 110 C240 95, 205 95, 195 102 C180 90, 155 100, 142 120 Z" fill="#78350F" />
</svg>
`;

export const FEMALE_AVATAR_1_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#F1F5F9" />
  <path d="M80 400 C80 320, 130 250, 200 250 C270 250, 320 320, 320 400 Z" fill="#FFFBEB" />
  <path d="M160 250 C175 270, 225 270, 240 250" fill="none" stroke="#FDE047" stroke-width="2" />
  <path d="M150 140 C150 110, 250 110, 250 140 L250 160 C250 160, 200 145, 150 160 Z" fill="#047857" />
  <ellipse cx="200" cy="170" rx="50" ry="62" fill="#FEE2E2" />
  <path d="M200 70 C120 70, 125 150, 125 210 C125 250, 140 280, 165 310 C180 330, 220 330, 235 310 C260 280, 275 250, 275 210 C275 150, 280 70, 200 70 Z M200 100 C240 100, 252 130, 252 170 C252 210, 235 242, 200 242 C165 242, 148 210, 148 170 C148 130, 160 100, 200 100 Z" fill="#065F46" />
  <path d="M145 235 C170 280, 230 280, 255 235 L280 340 L120 340 Z" fill="#047857" opacity="0.9" />
  <path d="M165 275 C185 300, 215 300, 235 275" fill="none" stroke="#065F46" stroke-width="3" />
</svg>
`;

export const FEMALE_AVATAR_2_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#FAF5FF" />
  <path d="M80 400 C80 320, 130 250, 200 250 C270 250, 320 320, 320 400 Z" fill="#E2E8F0" />
  <path d="M150 140 C150 110, 250 110, 250 140 L250 160 C250 160, 200 145, 150 160 Z" fill="#DB2777" opacity="0.4" />
  <ellipse cx="200" cy="170" rx="50" ry="62" fill="#EBD2B4" />
  <path d="M200 70 C120 70, 125 150, 125 210 C125 250, 140 280, 165 310 C180 330, 220 330, 235 310 C260 280, 275 250, 275 210 C275 150, 280 70, 200 70 Z M200 100 C240 100, 252 130, 252 170 C252 210, 235 242, 200 242 C165 242, 148 210, 148 170 C148 130, 160 100, 200 100 Z" fill="#EC4899" />
  <path d="M145 235 C170 280, 230 280, 255 235 L285 360 L115 360 Z" fill="#F472B6" />
  <path d="M155 260 C180 290, 220 290, 245 260" fill="none" stroke="#DB2777" stroke-dasharray="1 1" stroke-width="2" />
  <path d="M175 285 C190 305, 210 305, 225 285" fill="none" stroke="#EC4899" stroke-width="3" />
</svg>
`;

export const FEMALE_AVATAR_3_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#F8FAFC" />
  <path d="M80 400 C80 320, 130 250, 200 250 C270 250, 320 320, 320 400 Z" fill="#F1F5F9" />
  <path d="M120 400 L160 280 L200 400 C180 360, 140 360, 120 400 Z" fill="#0F172A" />
  <path d="M280 400 L240 280 L200 400 C220 360, 260 360, 280 400 Z" fill="#0F172A" />
  <path d="M150 140 C150 110, 250 110, 250 140 L250 160 C250 160, 200 145, 150 160 Z" fill="#1E3A8A" />
  <ellipse cx="200" cy="170" rx="50" ry="62" fill="#E2A97F" />
  <path d="M200 70 C120 70, 125 150, 125 210 C125 250, 140 280, 165 310 C180 330, 220 330, 235 310 C260 280, 275 250, 275 210 C275 150, 280 70, 200 70 Z M200 100 C240 100, 252 130, 252 170 C252 210, 235 242, 200 242 C165 242, 148 210, 148 170 C148 130, 160 100, 200 100 Z" fill="#1E40AF" />
  <path d="M145 235 C170 280, 230 280, 255 235 L290 350 L110 350 Z" fill="#2563EB" opacity="0.95" />
  <path d="M165 275 C185 300, 215 300, 235 275" fill="none" stroke="#1E40AF" stroke-width="3" />
</svg>
`;

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm1',
    name: 'Aisha Rahman',
    gender: 'bride',
    age: 26,
    education: 'M.S. in Data Analytics',
    profession: 'Senior Data Scientist',
    location: 'London, UK',
    familyBackground: 'Observant and highly educated Muslim family. Father is a retired Senior High Court Judge, mother is a University Professor of Islamic History. One brother who resides in Dubai.',
    marriagePreferences: 'Practicing Muslim professional, professional or tech analyst, age 26-30, career-minded, who values both religious values and professional growth. Based in or willing to stay in London.',
    photoUrl: svgToDataUrl(FEMALE_AVATAR_1_SVG),
    isPremiumActive: true,
    isEligible: true,
    contactEmail: 'aisha.rahman@example.com',
    contactPhone: '+44 7700 900088'
  },
  {
    id: 'm2',
    name: 'Yasmin Al-Farsi',
    gender: 'bride',
    age: 28,
    education: 'Doctor of Dental Surgery (DDS)',
    profession: 'Pediatric Dentist',
    location: 'New York, USA',
    familyBackground: 'Warm, respectful, close-knit Arab-American Muslim family. Father runs a pediatric dental clinic in Brooklyn, mother is a freelance digital designer.',
    marriagePreferences: 'Kind, career-oriented professional who practices Islamic values, loves travel, and values warm family ties. Age range 28-34, NY/NJ tri-state area.',
    photoUrl: svgToDataUrl(FEMALE_AVATAR_2_SVG),
    isPremiumActive: true,
    isEligible: true,
    contactEmail: 'yasmin.alfarsi@example.com',
    contactPhone: '+1 (212) 555-0192'
  },
  {
    id: 'm3',
    name: 'Mariam Siddiqui',
    gender: 'bride',
    age: 29,
    education: 'MBA, London Business School',
    profession: 'Strategy Consultant',
    location: 'London, UK',
    familyBackground: 'Modern, observant British-Pakistani family settled in the UK. Parents are healthcare directors. Brother works in financial consulting.',
    marriagePreferences: 'Observant, progressive, and career-driven Muslim professional, age 29-33, based in or near London.',
    photoUrl: svgToDataUrl(FEMALE_AVATAR_3_SVG),
    isPremiumActive: false, // E.g., simulation profile with expired status to show validation warning
    isEligible: true,
    contactEmail: 'mariam.siddiqui@example.com',
    contactPhone: '+44 7700 900077'
  },
  {
    id: 'm4',
    name: 'Tariq Mahmood',
    gender: 'groom',
    age: 28,
    education: 'B.S. in Computer Science (Stanford)',
    profession: 'Staff Software Engineer',
    location: 'Seattle, USA',
    familyBackground: 'Respectable, practicing Muslim background. Father is an aerospace engineering consultant near Seattle, mother is a freelance interior designer. Undergirded with high morals.',
    marriagePreferences: 'Independent, tech or healthcare Muslim professional, values state and religious prayers, age 25-29, living in or open to relocating to US West Coast.',
    photoUrl: svgToDataUrl(MALE_AVATAR_1_SVG),
    isPremiumActive: true,
    isEligible: true,
    contactEmail: 'tariq.m@example.com',
    contactPhone: '+1 (206) 555-0144'
  },
  {
    id: 'm5',
    name: 'Zayd Al-Hassan',
    gender: 'groom',
    age: 30,
    education: 'Master of Architecture, Columbia',
    profession: 'Lead Urban Architect',
    location: 'New York, USA',
    familyBackground: 'Creative, open-minded American-Muslim family. Mother is an Islamic arts gallery curator, father is a comparative literature professor.',
    marriagePreferences: 'Compassionate, family-loving professional who values deen and self-growth. Respectful of moderate values, age 26-32, East Coast.',
    photoUrl: svgToDataUrl(MALE_AVATAR_2_SVG),
    isPremiumActive: true,
    isEligible: true,
    contactEmail: 'zayd.hassan@example.com',
    contactPhone: '+1 (718) 555-0188'
  },
  {
    id: 'm6',
    name: 'Farhan Mustafa',
    gender: 'groom',
    age: 31,
    education: 'CFA, London School of Economics',
    profession: 'Investment Portfolio Manager',
    location: 'London, UK',
    familyBackground: 'Sophisticated professional Muslim family settled in South Kensington, London. Father is a Senior Chartered Accountant, mother is the founder of a high-end modest fashion boutique.',
    marriagePreferences: 'Ambitious, observant Muslim partner who values open communication, career aspirations, and cultural heritage. Age 27-32, in London.',
    photoUrl: svgToDataUrl(MALE_AVATAR_3_SVG),
    isPremiumActive: true,
    isEligible: true,
    contactEmail: 'farhan.mustafa@example.com',
    contactPhone: '+44 20 7946 0958'
  }
];

export const INITIAL_MATCH_REQUESTS: MatchRequest[] = [
  {
    id: 'req1',
    requestingPartyId: 'm1', // Aisha Rahman (bride)
    candidatePartyId: 'm4', // Tariq Mahmood (groom)
    currentStep: 3,
    step1Completed: true,
    step1Notes: 'Aisha Rahman requested matchmaking assistance. Her level of deen, educational profile, and details have been thoroughly verified.',
    step2Completed: true,
    step2Notes: 'Identified Tariq Mahmood as a highly suitable candidate matching her criteria (tech professional, practicing Muslim, appropriate age, located in USA, excellent education background).',
    step2Verified: {
      compatibility: true,
      completeness: true,
      activeStatus: true,
      eligibleProposals: true
    },
    step3Status: 'Pending',
    step3Notes: 'Sent Tariq Mahmood\'s profile illustration and detailed overview to Aisha Rahman. Awaiting her feedback.',
    step4Completed: false,
    step4Notes: '',
    step4DateShared: '',
    step5Status: 'Pending',
    step5Notes: '',
    step6Completed: false,
    logs: [
      {
        id: 'l1',
        timestamp: '2026-06-08T10:00:00Z',
        step: 1,
        message: 'Matchmaking request raised by Aisha Rahman\'s family. Islamic credentials and background verified successfully.',
        author: 'Matchmaker'
      },
      {
        id: 'l2',
        timestamp: '2026-06-08T11:30:00Z',
        step: 2,
        message: 'Searched database. Selected Tariq Mahmood. Confirmed active status, complete high-res files, and standard compatibility guidelines.',
        author: 'Matchmaker'
      },
      {
        id: 'l3',
        timestamp: '2026-06-08T12:00:00Z',
        step: 3,
        message: 'Shared candidate photo & draft portfolio with Aisha Rahman privately. Tariq Mahmood has not been notified yet.',
        author: 'System'
      }
    ]
  },
  {
    id: 'req2',
    requestingPartyId: 'm2', // Yasmin Al-Farsi (bride)
    candidatePartyId: 'm5', // Zayd Al-Hassan (groom)
    currentStep: 6,
    step1Completed: true,
    step1Notes: 'Yasmin Al-Farsi requested coordination help. Profile verification complete.',
    step2Completed: true,
    step2Notes: 'Zayd Al-Hassan matches educational backgrounds, age preference (30), location (New York), and family values. Checked all 4 points.',
    step2Verified: {
      compatibility: true,
      completeness: true,
      activeStatus: true,
      eligibleProposals: true
    },
    step3Status: 'Interested',
    step3Notes: 'Shared Photo of Zayd Al-Hassan with Yasmin Al-Farsi. Yasmin immediately expressed deep interest.',
    step4Completed: true,
    step4Notes: 'Requested approved authorization to contact second party (Zayd). Date of share: June 8, 2026. Added coordinator system notes.',
    step4DateShared: '2026-06-08',
    step5Status: 'Interested',
    step5Notes: 'Shared Yasmin\'s pediatric dentistry background and photo portrait safely with Zayd. Zayd was extremely pleased and expressed strong interest.',
    step6Completed: true,
    familyDiscussionScheduled: '2026-06-12',
    logs: [
      {
        id: 'la1',
        timestamp: '2026-06-07T09:00:00Z',
        step: 1,
        message: 'Yasmin Al-Farsi registered a new matchmaking assistance case.',
        author: 'Matchmaker'
      },
      {
        id: 'la2',
        timestamp: '2026-06-07T10:15:00Z',
        step: 2,
        message: 'Matched with Zayd Al-Hassan. Both are in New York and fit general career expectations.',
        author: 'Matchmaker'
      },
      {
        id: 'la3',
        timestamp: '2026-06-07T11:00:00Z',
        step: 3,
        message: 'Shared photo portfolio with Yasmin Al-Farsi privately. Received status update: INTERESTED.',
        author: 'Requesting Party'
      },
      {
        id: 'la4',
        timestamp: '2026-06-07T14:30:00Z',
        step: 4,
        message: 'Family consent & approval recorded in system. Added matchmaking notes to proceeding docket.',
        author: 'Matchmaker'
      },
      {
        id: 'la5',
        timestamp: '2026-06-08T09:00:00Z',
        step: 5,
        message: 'Shared Yasmin\'s dossier package with Zayd. Received status update: INTERESTED.',
        author: 'Second Party'
      },
      {
        id: 'la6',
        timestamp: '2026-06-08T10:30:00Z',
        step: 6,
        message: 'MUTUAL INTEREST CONFIRMED! Notification sent. Family introductory zoom call scheduled for June 12th.',
        author: 'System'
      }
    ]
  }
];
