export type EventStatus = "Draft" | "Live" | "Completed";

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  status: EventStatus;
  attendeeCount: number;
  checkedIn: number;
  boothCount: number;
  challengeCount: number;
  description: string;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  company: string;
  nfcTag: string;
  /** ISO timestamp for when the attendee registered */
  registeredAt: string;
  /** Profile readiness percentage (0-100) */
  profileCompletion: number;
  /** Whether attendee enabled networking features */
  networkingEnabled: boolean;
  checkedIn: boolean;
  points: number;
  badges: string[];
  checkInTime?: string;
  eventId: string;
}

export interface Booth {
  id: string;
  name: string;
  category: string;
  visits: number;
  maxVisits: number;
  eventId: string;
  description: string;
}

export interface Challenge {
  id: string;
  title: string;
  points: number;
  completions: number;
  type: "Scan" | "Social" | "Quiz" | "Visit";
  description: string;
  eventId: string;
  totalParticipants: number;
}

export interface Reward {
  id: string;
  name: string;
  pointCost: number;
  claimed: number;
  stock: number;
  category: string;
  eventId: string;
}

export interface DailyCheckin {
  date: string;
  checkins: number;
}

export interface BoothVisitData {
  name: string;
  visits: number;
}

export interface EngagementData {
  time: string;
  engagement: number;
  checkins: number;
}

export interface HourlyCheckin {
  hour: string;
  count: number;
}

export interface PointsDistribution {
  name: string;
  value: number;
}

export const events: Event[] = [
  {
    id: "evt-001",
    name: "TechSummit 2024",
    date: "2024-05-15",
    location: "San Francisco, CA",
    status: "Completed",
    attendeeCount: 450,
    checkedIn: 423,
    boothCount: 18,
    challengeCount: 8,
    description: "Annual technology summit featuring the latest innovations in AI and cloud computing.",
  },
  {
    id: "evt-002",
    name: "DevConnect Spring",
    date: "2024-06-22",
    location: "Austin, TX",
    status: "Live",
    attendeeCount: 280,
    checkedIn: 167,
    boothCount: 12,
    challengeCount: 6,
    description: "Developer-focused networking event with workshops and live demos.",
  },
  {
    id: "evt-003",
    name: "InnovateCon 2024",
    date: "2024-08-10",
    location: "New York, NY",
    status: "Draft",
    attendeeCount: 600,
    checkedIn: 0,
    boothCount: 24,
    challengeCount: 10,
    description: "The premier innovation conference for startups and enterprise companies.",
  },
];

export const attendees: Attendee[] = [
  {
    id: "att-001",
    name: "Alex Johnson",
    email: "alex.johnson@techcorp.com",
    company: "TechCorp Inc.",
    nfcTag: "NFC-A1B2C3",
    registeredAt: "2026-04-04T14:05:00Z",
    profileCompletion: 100,
    networkingEnabled: true,
    checkedIn: true,
    points: 1250,
    badges: ["Early Bird", "Networker", "Challenge Master"],
    checkInTime: "9:02 AM",
    eventId: "evt-002",
  },
  {
    id: "att-002",
    name: "Sarah Williams",
    email: "sarah.w@innovate.io",
    company: "Innovate.io",
    nfcTag: "NFC-D4E5F6",
    registeredAt: "2026-04-04T13:42:00Z",
    profileCompletion: 90,
    networkingEnabled: true,
    checkedIn: true,
    points: 980,
    badges: ["Booth Explorer", "Social Butterfly"],
    checkInTime: "9:15 AM",
    eventId: "evt-002",
  },
  {
    id: "att-003",
    name: "Marcus Chen",
    email: "m.chen@startupxyz.com",
    company: "StartupXYZ",
    nfcTag: "NFC-G7H8I9",
    registeredAt: "2026-04-04T11:15:00Z",
    profileCompletion: 100,
    networkingEnabled: true,
    checkedIn: true,
    points: 2100,
    badges: ["Top Performer", "Early Bird", "Quiz Wizard", "Networker"],
    checkInTime: "8:45 AM",
    eventId: "evt-002",
  },
  {
    id: "att-004",
    name: "Emily Rodriguez",
    email: "emily.r@enterprise.com",
    company: "Enterprise Solutions",
    nfcTag: "NFC-J1K2L3",
    registeredAt: "2026-04-03T20:30:00Z",
    profileCompletion: 60,
    networkingEnabled: false,
    checkedIn: false,
    points: 320,
    badges: ["Early Bird"],
    eventId: "evt-002",
  },
  {
    id: "att-005",
    name: "David Park",
    email: "d.park@devhouse.io",
    company: "DevHouse",
    nfcTag: "NFC-M4N5O6",
    registeredAt: "2026-04-03T18:10:00Z",
    profileCompletion: 100,
    networkingEnabled: true,
    checkedIn: true,
    points: 1560,
    badges: ["Challenge Master", "Booth Explorer", "Networker"],
    checkInTime: "10:30 AM",
    eventId: "evt-002",
  },
  {
    id: "att-006",
    name: "Lisa Thompson",
    email: "l.thompson@cloudbase.net",
    company: "CloudBase",
    nfcTag: "NFC-P7Q8R9",
    registeredAt: "2026-04-03T12:55:00Z",
    profileCompletion: 80,
    networkingEnabled: true,
    checkedIn: true,
    points: 890,
    badges: ["Social Butterfly"],
    checkInTime: "11:05 AM",
    eventId: "evt-002",
  },
  {
    id: "att-007",
    name: "James Wilson",
    email: "j.wilson@futuretech.com",
    company: "FutureTech",
    nfcTag: "NFC-S1T2U3",
    registeredAt: "2026-04-02T09:22:00Z",
    profileCompletion: 40,
    networkingEnabled: false,
    checkedIn: false,
    points: 150,
    badges: [],
    eventId: "evt-002",
  },
  {
    id: "att-008",
    name: "Priya Patel",
    email: "priya@aiventures.co",
    company: "AI Ventures",
    nfcTag: "NFC-V4W5X6",
    registeredAt: "2026-04-02T15:05:00Z",
    profileCompletion: 100,
    networkingEnabled: true,
    checkedIn: true,
    points: 1820,
    badges: ["Top Performer", "Quiz Wizard", "Challenge Master"],
    checkInTime: "9:48 AM",
    eventId: "evt-002",
  },
  {
    id: "att-009",
    name: "Ryan O'Brien",
    email: "ryan.ob@scale.dev",
    company: "Scale.dev",
    nfcTag: "NFC-Y7Z8A1",
    registeredAt: "2026-04-01T19:45:00Z",
    profileCompletion: 90,
    networkingEnabled: false,
    checkedIn: true,
    points: 670,
    badges: ["Booth Explorer"],
    checkInTime: "12:15 PM",
    eventId: "evt-002",
  },
  {
    id: "att-010",
    name: "Naomi Tanaka",
    email: "n.tanaka@pixelworks.jp",
    company: "PixelWorks Japan",
    nfcTag: "NFC-B2C3D4",
    registeredAt: "2026-03-31T16:12:00Z",
    profileCompletion: 70,
    networkingEnabled: false,
    checkedIn: false,
    points: 430,
    badges: ["Early Bird"],
    eventId: "evt-002",
  },
  {
    id: "att-011",
    name: "Carlos Mendez",
    email: "c.mendez@latintech.mx",
    company: "LatinTech",
    nfcTag: "NFC-E5F6G7",
    registeredAt: "2026-03-30T10:00:00Z",
    profileCompletion: 95,
    networkingEnabled: true,
    checkedIn: true,
    points: 1340,
    badges: ["Networker", "Booth Explorer", "Social Butterfly"],
    checkInTime: "10:00 AM",
    eventId: "evt-002",
  },
  {
    id: "att-012",
    name: "Hannah Schmidt",
    email: "h.schmidt@eurodev.de",
    company: "EuroDev GmbH",
    nfcTag: "NFC-H8I9J1",
    registeredAt: "2026-03-29T14:40:00Z",
    profileCompletion: 100,
    networkingEnabled: true,
    checkedIn: true,
    points: 760,
    badges: ["Early Bird", "Social Butterfly"],
    checkInTime: "9:30 AM",
    eventId: "evt-002",
  },
];

export const booths: Booth[] = [
  {
    id: "booth-001",
    name: "AI & Machine Learning",
    category: "Technology",
    visits: 187,
    maxVisits: 200,
    eventId: "evt-002",
    description: "Explore the latest in artificial intelligence and ML demos.",
  },
  {
    id: "booth-002",
    name: "Cloud Infrastructure",
    category: "Infrastructure",
    visits: 143,
    maxVisits: 200,
    eventId: "evt-002",
    description: "Cloud solutions and DevOps tooling showcase.",
  },
  {
    id: "booth-003",
    name: "Cybersecurity Hub",
    category: "Security",
    visits: 212,
    maxVisits: 250,
    eventId: "evt-002",
    description: "Security tools and zero-trust architecture demos.",
  },
  {
    id: "booth-004",
    name: "Developer Tools",
    category: "Tools",
    visits: 98,
    maxVisits: 150,
    eventId: "evt-002",
    description: "IDE plugins, CI/CD pipelines, and productivity tools.",
  },
  {
    id: "booth-005",
    name: "Web3 & Blockchain",
    category: "Emerging Tech",
    visits: 76,
    maxVisits: 150,
    eventId: "evt-002",
    description: "Decentralized applications and smart contract development.",
  },
  {
    id: "booth-006",
    name: "Startup Showcase",
    category: "Startups",
    visits: 165,
    maxVisits: 200,
    eventId: "evt-002",
    description: "Early-stage startups presenting innovative solutions.",
  },
  {
    id: "booth-007",
    name: "Open Source Corner",
    category: "Community",
    visits: 89,
    maxVisits: 150,
    eventId: "evt-002",
    description: "Celebrate open source projects and contributors.",
  },
  {
    id: "booth-008",
    name: "IoT & Edge Computing",
    category: "Hardware",
    visits: 121,
    maxVisits: 175,
    eventId: "evt-002",
    description: "Internet of Things and edge processing demos.",
  },
];

export const challenges: Challenge[] = [
  {
    id: "chal-001",
    title: "Visit 5 Booths",
    points: 250,
    completions: 89,
    type: "Visit",
    description: "Scan your NFC badge at any 5 different booths.",
    eventId: "evt-002",
    totalParticipants: 167,
  },
  {
    id: "chal-002",
    title: "Social Share",
    points: 150,
    completions: 134,
    type: "Social",
    description: "Share a post about the event on LinkedIn or Twitter.",
    eventId: "evt-002",
    totalParticipants: 167,
  },
  {
    id: "chal-003",
    title: "Tech Trivia Quiz",
    points: 350,
    completions: 56,
    type: "Quiz",
    description: "Complete the 10-question technology trivia quiz.",
    eventId: "evt-002",
    totalParticipants: 167,
  },
  {
    id: "chal-004",
    title: "Meet the Speakers",
    points: 200,
    completions: 43,
    type: "Scan",
    description: "Scan NFC tags from at least 3 speaker badges.",
    eventId: "evt-002",
    totalParticipants: 167,
  },
  {
    id: "chal-005",
    title: "Network Champion",
    points: 300,
    completions: 72,
    type: "Scan",
    description: "Connect with 10 other attendees via NFC.",
    eventId: "evt-002",
    totalParticipants: 167,
  },
  {
    id: "chal-006",
    title: "Feedback Hero",
    points: 100,
    completions: 118,
    type: "Social",
    description: "Submit feedback for 3 booth demos.",
    eventId: "evt-002",
    totalParticipants: 167,
  },
];

export const rewards: Reward[] = [
  {
    id: "rew-001",
    name: "Premium Swag Bag",
    pointCost: 500,
    claimed: 34,
    stock: 50,
    category: "Merchandise",
    eventId: "evt-002",
  },
  {
    id: "rew-002",
    name: "Conference T-Shirt",
    pointCost: 300,
    claimed: 67,
    stock: 100,
    category: "Merchandise",
    eventId: "evt-002",
  },
  {
    id: "rew-003",
    name: "VIP After-Party Access",
    pointCost: 1000,
    claimed: 15,
    stock: 20,
    category: "Experience",
    eventId: "evt-002",
  },
  {
    id: "rew-004",
    name: "Workshop Session Pass",
    pointCost: 750,
    claimed: 22,
    stock: 30,
    category: "Experience",
    eventId: "evt-002",
  },
  {
    id: "rew-005",
    name: "Digital Badge NFT",
    pointCost: 250,
    claimed: 89,
    stock: 200,
    category: "Digital",
    eventId: "evt-002",
  },
  {
    id: "rew-006",
    name: "1-Year SaaS License",
    pointCost: 2000,
    claimed: 4,
    stock: 10,
    category: "Software",
    eventId: "evt-002",
  },
];

export const dailyCheckins: DailyCheckin[] = [
  { date: "Jun 15", checkins: 0 },
  { date: "Jun 16", checkins: 12 },
  { date: "Jun 17", checkins: 28 },
  { date: "Jun 18", checkins: 45 },
  { date: "Jun 19", checkins: 38 },
  { date: "Jun 20", checkins: 67 },
  { date: "Jun 21", checkins: 82 },
  { date: "Jun 22", checkins: 167 },
];

export const boothVisitData: BoothVisitData[] = [
  { name: "AI & ML", visits: 187 },
  { name: "Security", visits: 212 },
  { name: "Cloud", visits: 143 },
  { name: "Startups", visits: 165 },
  { name: "IoT", visits: 121 },
  { name: "Dev Tools", visits: 98 },
  { name: "Open Source", visits: 89 },
  { name: "Web3", visits: 76 },
];

export const engagementOverTime: EngagementData[] = [
  { time: "8:00 AM", engagement: 5, checkins: 8 },
  { time: "9:00 AM", engagement: 32, checkins: 45 },
  { time: "10:00 AM", engagement: 58, checkins: 62 },
  { time: "11:00 AM", engagement: 74, checkins: 78 },
  { time: "12:00 PM", engagement: 45, checkins: 30 },
  { time: "1:00 PM", engagement: 52, checkins: 18 },
  { time: "2:00 PM", engagement: 80, checkins: 25 },
  { time: "3:00 PM", engagement: 91, checkins: 12 },
  { time: "4:00 PM", engagement: 65, checkins: 8 },
  { time: "5:00 PM", engagement: 38, checkins: 4 },
];

export const hourlyCheckins: HourlyCheckin[] = [
  { hour: "8 AM", count: 8 },
  { hour: "9 AM", count: 45 },
  { hour: "10 AM", count: 62 },
  { hour: "11 AM", count: 78 },
  { hour: "12 PM", count: 30 },
  { hour: "1 PM", count: 18 },
  { hour: "2 PM", count: 25 },
  { hour: "3 PM", count: 12 },
  { hour: "4 PM", count: 8 },
  { hour: "5 PM", count: 4 },
];

export const pointsDistribution: PointsDistribution[] = [
  { name: "0-250", value: 28 },
  { name: "251-500", value: 34 },
  { name: "501-1000", value: 52 },
  { name: "1001-2000", value: 38 },
  { name: "2000+", value: 15 },
];

// ─── Feedback ─────────────────────────────────────────────────────────────────

export interface FeedbackEntry {
  id: string;
  attendeeName: string;
  attendeeType: "VIP" | "Speaker" | "Sponsor" | "Guest" | "Student";
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  category: "Overall" | "Booths" | "Networking" | "Organization" | "Content";
  date: string;
}

export interface FeedbackSurvey {
  id: string;
  title: string;
  questionCount: number;
  responses: number;
  status: "Active" | "Draft" | "Closed";
  createdDate: string;
}

export const feedbackEntries: FeedbackEntry[] = [
  { id: "fb-001", attendeeName: "Alex Johnson",   attendeeType: "Guest",   rating: 5, comment: "Loved the NFC networking — made 8 meaningful connections without exchanging a single card.", category: "Networking",    date: "Jun 22, 9:45 AM"  },
  { id: "fb-002", attendeeName: "Sarah Williams",  attendeeType: "Sponsor", rating: 4, comment: "Great brand exposure. The booth check-in system was seamless and our team had zero issues.", category: "Booths",        date: "Jun 22, 10:12 AM" },
  { id: "fb-003", attendeeName: "Marcus Chen",     attendeeType: "VIP",     rating: 5, comment: "Best tech event I've been to. The gamification kept everyone engaged the entire day.",       category: "Overall",       date: "Jun 22, 10:33 AM" },
  { id: "fb-004", attendeeName: "Emily Rodriguez", attendeeType: "Student", rating: 4, comment: "Super valuable. Would have loved more startup-focused panels in the afternoon.",             category: "Content",       date: "Jun 22, 11:02 AM" },
  { id: "fb-005", attendeeName: "David Park",      attendeeType: "Guest",   rating: 5, comment: "The NFC tap-to-connect is a total game changer. No more fumbling for business cards!",      category: "Networking",    date: "Jun 22, 11:28 AM" },
  { id: "fb-006", attendeeName: "Lisa Thompson",   attendeeType: "Sponsor", rating: 3, comment: "Good visibility but booth traffic dropped sharply after lunch. Prize draws could help.",    category: "Booths",        date: "Jun 22, 12:15 PM" },
  { id: "fb-007", attendeeName: "James Wilson",    attendeeType: "Guest",   rating: 2, comment: "Felt overcrowded at peak hours. Better queue management at the main entrance would help.",  category: "Organization",  date: "Jun 22, 12:44 PM" },
  { id: "fb-008", attendeeName: "Priya Patel",     attendeeType: "Speaker", rating: 5, comment: "Excellent organization end to end. The speaker lounge setup and scheduling was perfect.",   category: "Organization",  date: "Jun 22, 1:10 PM"  },
  { id: "fb-009", attendeeName: "Ryan O'Brien",    attendeeType: "Guest",   rating: 4, comment: "The challenges made me explore booths I wouldn't have visited — really clever design.",    category: "Overall",       date: "Jun 22, 2:05 PM"  },
  { id: "fb-010", attendeeName: "Naomi Tanaka",    attendeeType: "VIP",     rating: 5, comment: "Premium experience from check-in to close. The attention to detail was remarkable.",        category: "Overall",       date: "Jun 22, 2:38 PM"  },
  { id: "fb-011", attendeeName: "Carlos Mendez",   attendeeType: "Student", rating: 3, comment: "Really fun event but the Wi-Fi was unreliable during the afternoon sessions.",             category: "Organization",  date: "Jun 22, 3:14 PM"  },
  { id: "fb-012", attendeeName: "Hannah Schmidt",  attendeeType: "Guest",   rating: 4, comment: "Smooth check-in and the leaderboard created a great competitive energy throughout.",       category: "Networking",    date: "Jun 22, 4:02 PM"  },
];

// Aggregate stats (derived from a larger set of 67 responses — table shows recent 12)
export const feedbackStats = {
  totalResponses: 67,
  avgRating: 4.2,
  positiveRate: 81,   // % of 4–5 star
  responseRate: 40,   // % of checked-in attendees who responded
};

export const ratingDistribution: { stars: 1 | 2 | 3 | 4 | 5; count: number }[] = [
  { stars: 5, count: 34 },
  { stars: 4, count: 20 },
  { stars: 3, count: 8  },
  { stars: 2, count: 4  },
  { stars: 1, count: 1  },
];

export const feedbackThemes: { theme: string; count: number; sentiment: "positive" | "neutral" | "negative" }[] = [
  { theme: "NFC Networking",     count: 38, sentiment: "positive" },
  { theme: "Booth Experience",   count: 29, sentiment: "positive" },
  { theme: "Event Organization", count: 24, sentiment: "positive" },
  { theme: "Content & Speakers", count: 18, sentiment: "positive" },
  { theme: "Food & Catering",    count: 12, sentiment: "neutral"  },
  { theme: "Crowd Management",   count: 8,  sentiment: "negative" },
  { theme: "Wi-Fi Connectivity", count: 6,  sentiment: "negative" },
];

export const feedbackSurveys: FeedbackSurvey[] = [
  { id: "sv-001", title: "Event Experience Survey", questionCount: 6, responses: 67, status: "Active",  createdDate: "Jun 20" },
  { id: "sv-002", title: "Booth Quality Feedback",  questionCount: 4, responses: 43, status: "Active",  createdDate: "Jun 20" },
  { id: "sv-003", title: "Networking Session Poll",  questionCount: 3, responses: 28, status: "Closed",  createdDate: "Jun 18" },
  { id: "sv-004", title: "Speaker Feedback Form",   questionCount: 5, responses: 0,  status: "Draft",   createdDate: "Jun 21" },
];

// ─── Attendee type engagement breakdown ──────────────────────────────────────

export interface AttendeeTypeEngagement {
  type: string;
  count: number;
  avgPoints: number;
  checkinRate: number; // percentage 0–100
  avgInteractions: number;
  color: string; // hex for chart / accent
}

export const attendeeTypeEngagement: AttendeeTypeEngagement[] = [
  { type: "VIP",     count: 24,  avgPoints: 1840, checkinRate: 96,  avgInteractions: 14.2, color: "#6366f1" },
  { type: "Speaker", count: 18,  avgPoints: 2100, checkinRate: 100, avgInteractions: 18.5, color: "#8b5cf6" },
  { type: "Sponsor", count: 32,  avgPoints: 1420, checkinRate: 91,  avgInteractions: 11.8, color: "#f59e0b" },
  { type: "Guest",   count: 156, avgPoints:  820, checkinRate: 58,  avgInteractions:  7.3, color: "#10b981" },
  { type: "Student", count: 50,  avgPoints: 1120, checkinRate: 78,  avgInteractions:  9.6, color: "#06b6d4" },
];

// Total: 24 + 18 + 32 + 156 + 50 = 280 → matches liveEvent.attendeeCount
export const profileCompletionRate = 74; // percentage
export const totalInteractions = 1891;
export const avgInteractionsPerAttendee = +(totalInteractions / 280).toFixed(1); // 6.8

// ─────────────────────────────────────────────────────────────────────────────

export const recentCheckIns = attendees
  .filter((a) => a.checkedIn)
  .slice(0, 5)
  .map((a) => ({
    id: a.id,
    name: a.name,
    time: a.checkInTime || "N/A",
    nfcTag: a.nfcTag,
    company: a.company,
  }));

export const topPerformers = [...attendees]
  .sort((a, b) => b.points - a.points)
  .slice(0, 5);
