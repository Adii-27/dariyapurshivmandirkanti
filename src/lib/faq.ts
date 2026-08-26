export const FAQ_CATEGORIES = [
  "Temple",
  "Timings & Aarti",
  "Location",
  "Seva",
  "Festivals",
  "General",
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export type TempleFaq = {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  order?: number;
  featured: boolean;
};

export const DEFAULT_FAQS: TempleFaq[] = [
  {
    id: "faq-location-1",
    question: "Where is Dariyapur Shiv Mandir Kanti located?",
    answer:
      "Dariyapur Shiv Mandir Kanti is located in Dariyapur, Kanti, District – Muzaffarpur, Bihar. You can visit our Location page for detailed directions.",
    category: "Location",
    order: 1,
    featured: true,
  },
  {
    id: "faq-timings-1",
    question: "What are the temple timings?",
    answer: "The temple is open daily for devotees from 7:00 AM to 8:00 PM.",
    category: "Timings & Aarti",
    order: 2,
    featured: true,
  },
  {
    id: "faq-aarti-1",
    question: "What are the Aarti timings?",
    answer:
      "Morning Aarti is performed at 7:30 AM and Evening Aarti (Sandhya Aarti) is performed at 7:00 PM daily.",
    category: "Timings & Aarti",
    order: 3,
    featured: true,
  },
  {
    id: "faq-temple-1",
    question: "Is the temple open on all days?",
    answer:
      "Yes, Dariyapur Shiv Mandir Kanti is open on all 7 days of the week, including public holidays and festival days.",
    category: "Temple",
    order: 4,
    featured: true,
  },
  {
    id: "faq-location-2",
    question: "How can I reach the temple?",
    answer:
      "The temple is easily accessible by road from Muzaffarpur and Kanti. Kanti Railway Station is approx 2.8 km away, and Muzaffarpur Junction is approx 15 km away. Local autos, taxis, and buses are available.",
    category: "Location",
    order: 5,
    featured: true,
  },
  {
    id: "faq-temple-2",
    question: "Can devotees perform Jalabhishek?",
    answer:
      "Yes, devotees are welcome to perform Jalabhishek and offer prayers during regular darshan hours. Special arrangements are made on Mondays and during Shravan Maas.",
    category: "Temple",
    order: 6,
    featured: true,
  },
  {
    id: "faq-seva-1",
    question: "How can I participate in Seva?",
    answer:
      "Devotees can participate in various seva opportunities including daily temple maintenance, festival volunteering, and floral offerings. Please contact the temple management for details.",
    category: "Seva",
    order: 7,
    featured: true,
  },
  {
    id: "faq-festivals-1",
    question: "Are there any special arrangements during Sawan?",
    answer:
      "Yes, during the holy month of Shravan (Sawan), special queue management, Jalabhishek arrangements, security, and prasadam distribution are organized for the large number of visiting Kanwariyas and devotees.",
    category: "Festivals",
    order: 8,
    featured: true,
  },
  {
    id: "faq-general-1",
    question: "Where can I get the latest updates and notices?",
    answer:
      "All official temple notices, festival announcements, and community updates are published on our Updates page and broadcast via web push notifications.",
    category: "General",
    order: 9,
    featured: true,
  },
  {
    id: "faq-general-2",
    question: "Are there any entry fees or charges for Darshan?",
    answer:
      "No, Darshan at Dariyapur Shiv Mandir Kanti is completely free and open to all devotees. No prior booking or charges are required.",
    category: "General",
    order: 10,
    featured: false,
  },
  {
    id: "faq-seva-2",
    question: "Can I sponsor Bhandara or Prasad distribution?",
    answer:
      "Yes, devotees can sponsor Prasad distribution, Bhandara, and daily Shringar Seva on auspicious days. Please reach out through our Contact page.",
    category: "Seva",
    order: 11,
    featured: false,
  },
  {
    id: "faq-festivals-2",
    question: "Which major festivals are celebrated at the temple?",
    answer:
      "Maha Shivratri, Shravan Maas (Sawan Somwar), Kartik Purnima, Basant Panchami, and Navratri are celebrated with great devotion and community gatherings.",
    category: "Festivals",
    order: 12,
    featured: false,
  },
];
