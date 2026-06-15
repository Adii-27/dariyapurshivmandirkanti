export type TempleUpdateCategory = "Community Post" | "Festival Announcement" | "Temple Notice";

export type TempleUpdate = {
  id: string;
  title: string;
  hindi?: string;
  publishedAt: string;
  changedAt: string;
  summary: string;
  content?: string;
  startDate?: string;
  endDate?: string;
  category: TempleUpdateCategory;
  featured: boolean;
  image?: string;
};

export type FestivalUpdate = {
  id: string;
  name: string;
  hindi: string;
  date: string;
  endDate?: string;
  description: string;
  bannerImage?: string;
  countdownEnabled: boolean;
  featured: boolean;
  changedAt?: string;
};

/**
 * Future Sanity CMS boundary:
 * - Keep components consuming these local types instead of Sanity documents directly.
 * - A Sanity query/adapter should normalize published documents into TempleUpdate[].
 * - Only published records should be exposed, ordered by publishedAt descending.
 * - Preview/draft handling and image support can be added without changing the section API.
 *
 * See SANITY_CMS_INTEGRATION.md for the intended schema and integration steps.
 */
export const TEMPLE_UPDATES: TempleUpdate[] = [];

export const FESTIVAL_UPDATES: FestivalUpdate[] = [
  {
    id: "shravan-maas-2026",
    name: "Shravan Maas Begins",
    hindi: "श्रावण मास आरम्भ",
    date: "2026-07-30T05:30:00+05:30",
    description: "The sacred month of Shiva begins, with special worship and jalabhishek.",
    countdownEnabled: true,
    featured: true,
  },
  {
    id: "first-shravan-somvar-2026",
    name: "First Shravan Somvar",
    hindi: "प्रथम श्रावण सोमवार",
    date: "2026-08-03T05:30:00+05:30",
    description: "The first Monday of Shravan, observed with special Shiva puja and fasting.",
    countdownEnabled: true,
    featured: false,
  },
  {
    id: "nag-panchami-2026",
    name: "Nag Panchami",
    hindi: "नाग पंचमी",
    date: "2026-08-17T06:00:00+05:30",
    description: "A sacred day honouring the serpent deities associated with Lord Shiva.",
    countdownEnabled: true,
    featured: false,
  },
  {
    id: "raksha-bandhan-2026",
    name: "Raksha Bandhan",
    hindi: "रक्षा बंधन",
    date: "2026-08-28T07:00:00+05:30",
    description: "A celebration of protection, family bonds, prayer and blessings.",
    countdownEnabled: true,
    featured: false,
  },
  {
    id: "janmashtami-2026",
    name: "Krishna Janmashtami",
    hindi: "श्रीकृष्ण जन्माष्टमी",
    date: "2026-09-04T19:00:00+05:30",
    description: "Community prayer, kirtan and the midnight celebration of Shri Krishna.",
    countdownEnabled: true,
    featured: false,
  },
  {
    id: "ganesh-chaturthi-2026",
    name: "Ganesh Chaturthi",
    hindi: "गणेश चतुर्थी",
    date: "2026-09-14T07:00:00+05:30",
    description: "Prayers to Bhagwan Ganesh for wisdom and auspicious beginnings.",
    countdownEnabled: true,
    featured: false,
  },
  {
    id: "vijaya-dashami-2026",
    name: "Vijaya Dashami",
    hindi: "विजयादशमी",
    date: "2026-10-20T08:00:00+05:30",
    description: "The victory of dharma, observed with worship and community blessings.",
    countdownEnabled: true,
    featured: false,
  },
  {
    id: "diwali-2026",
    name: "Diwali Deepotsav",
    hindi: "दीपावली दीपोत्सव",
    date: "2026-11-08T17:30:00+05:30",
    description: "The temple premises glow with diyas, prayer and festive devotion.",
    countdownEnabled: true,
    featured: false,
  },
  {
    id: "chhath-puja-2026",
    name: "Chhath Puja",
    hindi: "छठ पूजा",
    date: "2026-11-15T05:30:00+05:30",
    description: "A major Bihar observance dedicated to Surya Dev and Chhathi Maiya.",
    countdownEnabled: true,
    featured: false,
  },
];
