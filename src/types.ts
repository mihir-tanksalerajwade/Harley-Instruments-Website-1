export interface Statistic {
  value: string;
  label: string;
}

export interface HeroSectionData {
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  imageSrc: string;
  statistics: Statistic[];
}

export interface AboutSectionData {
  badge: string;
  title: string;
  storyHeading: string;
  paragraphs: string[];
  milestones: { year: string; title: string; desc: string }[];
}

export interface ProductService {
  id: string;
  title: string;
  category: "equipment" | "service";
  shortDesc: string;
  fullDesc: string;
  specifications: string[];
  iconName: string; // e.g., 'Layers', 'Activity', 'ShieldAlert'
}

export interface TrustPoint {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ContactDetails {
  email: string;
  phone: string;
  linkedin: string;
  address: string;
  workingHoursWeekdays: string;
  workingHoursSaturday: string;
}

export interface InquiryLead {
  id: string;
  timestamp: string;
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  department: string;
  productInterest: string;
  message: string;
  status: "New" | "Contacted" | "Under Review" | "Resolved" | "Archived";
  adminNotes?: string;
}

export interface WebsiteData {
  hero: HeroSectionData;
  about: AboutSectionData;
  products: ProductService[];
  trustPoints: TrustPoint[];
  contact: ContactDetails;
}
