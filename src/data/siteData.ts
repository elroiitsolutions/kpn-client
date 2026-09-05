import { address } from "framer-motion/client";

export const navigationLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Pages',
    children: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Why Choose Us', href: '/why-choose-us' },
      { label: 'Our Awards', href: '/our-awards' },
      // { label: 'Our Team', href: '/our-team' },
      // { label: 'Careers', href: '/careers' },
      // { label: 'FAQs', href: '/faqs' },
    ],
  },
  {
    label: 'Associate',
    children: [
      { label: 'Investors', href: '/investors' },
      { label: 'Our Venture', href: '/our-ventures' },
      {label: 'Joint Development', href: '/joint-development'},
      {label: 'Industrial', href: '/industrial'},
      { label: 'NRI Services', href: '/nri' },
      { label: 'Channel Partners', href: '/channel-partners' },
    ],
  },
  // { label: 'Services', href: '#services' },
  { label: 'Projects', href: '/projects' },
  { label: 'News', href: '/blogs' },
  { label: 'Contact', href: '/contact-us' },
];

export const servicesData = [
  {
    id: '01',
    title: 'Sales & Marketing',
    description: 'Building a real estate development is a complicated task requiring both deep understanding of buyer outreach, strategic branding, and high-conversion sales channels.',
    image: '/images/services/service1.jpg',
    href: '/projects',
  },
  {
    id: '02',
    title: 'Architecture & Design',
    description: 'We believe good architecture is a crucial foundation that influences the overall performance and long-term structural value of a real estate development.',
    image: '/images/services/service2.jpg',
    href: '/projects',
  },
  {
    id: '03',
    title: 'Construction Management',
    description: 'From design to operations, we love to solve complex challenges and exceed expectations with modern engineering practices and industry-leading safety standards.',
    image: '/images/services/service3.jpg',
    href: '/projects',
  },
  {
    id: '04',
    title: 'Investment & Capital',
    description: 'We are focused on improving the way capital projects get done, ensuring transparent joint ventures, capital security, and maximum investor appreciation.',
    image: '/images/services/service4.jpg',
    href: '/investors',
  },
  {
    id: '05',
    title: 'Project Management',
    description: 'Our comprehensive estimates and rigorous project management methodologies ensure timely project delivery without compromising on quality or aesthetics.',
    image: '/images/services/service5.jpg',
    href: '/projects',
  },
  {
    id: '06',
    title: 'Real Estate Development',
    description: 'We offer end-to-end real estate development solutions, crafting integrated community landmarks that deliver lasting value to homeowners and investors.',
    image: '/images/services/service6.jpg',
    href: '/projects',
  },
];
export const featuresData = [
  {
    num: '01',
    title: 'Modern, eco-friendly homes',
    description: 'Our goal is zero incidents and our lost time frequency rate is industry leading.',
    image: '/images/diffrent/img1.png',
  },
  {
    num: '02',
    title: 'Client-centered approach',
    description: 'We work with both investors and developers to create landmarks that make an impact.',
    image: '/images/diffrent/img2.png',
  },
  {
    num: '03',
    title: 'Community-focused living',
    description: 'Our multi-skilled team provides innovative, forward-thinking solutions.',
    image: '/images/diffrent/img3.png',
  },
  {
    num: '04',
    title: 'Sustainable architecture',
    description: 'We maintain this by ensuring transparency and professional conduct in every aspect.',
    image: '/images/diffrent/img4.png',
  },
];

export interface ProjectItem {
  id: string;
  name: string;
  slug: string;
  location: string;
  bhk: string;
  type: 'Apartments' | 'Plots' | 'Commercial' | 'Industrial' | 'Villas';
  status: 'Ongoing' | 'Completed' | 'Upcoming';
  budget: string;
  image: string;
  address?: string;
  description?: string;
  streetViewUrl?: string;
  mapEmbedUrl?: string;
}

export const projectsData: ProjectItem[] = [
  // -------------------------------------------------------------
  // 6 OFFICIAL APARTMENTS FROM KPN PROMOTERS
  // -------------------------------------------------------------
  {
    id: '01',
    name: 'KPN LeNid',
    slug: 'kpn-lenid',
    location: 'Urapakkam, Chennai',
    address: 'No. 48, Karanai Puducherry Rd, Urapakkam, Chennai',
    bhk: '1 & 2 BHK',
    type: 'Apartments',
    status: 'Ongoing',
    budget: '₹ 19L Onwards',
    image: '/images/projects/apt_lenid.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '02',
    name: 'DGM Monica Residency',
    slug: 'dgm-monica-residency',
    location: 'Urapakkam, Chennai',
    address: 'Near GST Road, Urapakkam, Chennai',
    bhk: '1 & 2 BHK',
    type: 'Apartments',
    status: 'Ongoing',
    budget: '₹ 30L Onwards',
    image: '/images/projects/apt_dgm_monica.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '03',
    name: 'SP2K Serenity Skyline',
    slug: 'sp2k-serenity-skyline',
    location: 'Urapakkam, Chennai',
    address: 'Karanai Puducherry Main Road, Urapakkam, Chennai',
    bhk: '1 & 2 BHK',
    type: 'Apartments',
    status: 'Upcoming',
    budget: '₹ 38L Onwards',
    image: '/images/projects/apt_sp2k_serenity.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '04',
    name: 'Royal Oak',
    slug: 'royal-oak',
    location: 'Urapakkam, Chennai',
    address: 'Opp. Railway Station, Urapakkam, Chennai',
    bhk: '2 BHK',
    type: 'Apartments',
    status: 'Ongoing',
    budget: '₹ 48L Onwards',
    image: '/images/projects/apt_royal_oak.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '05',
    name: 'KPN Vijayalakshmi',
    slug: 'kpn-vijayalakshmi',
    location: 'Urapakkam, Chennai',
    address: 'Near Kilambakkam Bus Terminus, Urapakkam, Chennai',
    bhk: '2 BHK',
    type: 'Apartments',
    status: 'Ongoing',
    budget: '₹ 54L Onwards',
    image: '/images/projects/apt_vijayalakshmi.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '06',
    name: 'KPN Enclave',
    slug: 'kpn-enclave',
    location: 'Urapakkam, Chennai',
    address: 'Adhanur Main Road, Urapakkam, Chennai',
    bhk: '2 BHK',
    type: 'Apartments',
    status: 'Ongoing',
    budget: '₹ 45L Onwards',
    image: '/images/projects/apt_kpn_enclave.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },

  // -------------------------------------------------------------
  // 8 OFFICIAL PLOTS FROM KPN PROMOTERS
  // -------------------------------------------------------------
  {
    id: '07',
    name: 'KPN Marvel Township',
    slug: 'kpn-marvel-township',
    location: 'Urapakkam, Chennai',
    address: 'Urapakkam Main Road, Chennai',
    bhk: 'Plots',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 2799/Sq.Ft',
    image: '/images/projects/plot_marvel.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '08',
    name: 'Sri Bhavai Amman Nagar II',
    slug: 'sri-bhavai-amman-nagar-ii',
    location: 'Urapakkam, Chennai',
    address: 'Near Bhavai Amman Temple, Urapakkam, Chennai',
    bhk: 'Plots',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 4999/Sq.Ft',
    image: '/images/projects/plot_sri_bhavai_amman.png',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '09',
    name: 'Sri Ranga Nagar',
    slug: 'sri-ranga-nagar',
    location: 'Nenmeli, Chennai',
    address: 'Nenmeli Main Road, Chengalpattu / Chennai',
    bhk: 'Plots',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 3299/Sq.Ft',
    image: '/images/projects/plot_sri_ranga_nagar.png',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '10',
    name: 'KPN Omega Town',
    slug: 'kpn-omega-town',
    location: 'Guduvanchery, Chennai',
    address: 'Nellikuppam Road, Guduvanchery, Chennai',
    bhk: 'Plots',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 2799/Sq.Ft',
    image: '/images/projects/plot_omega.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '11',
    name: 'AVP Kanagam Avenue',
    slug: 'avp-kanagam-avenue',
    location: 'Guduvanchery, Chennai',
    address: 'Govindarajapuram, Guduvanchery, Chennai',
    bhk: 'Plots',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 4500/Sq.Ft',
    image: '/images/projects/plot_avp_kanagam_avenue.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '12',
    name: 'AVP Kanagam Nagar',
    slug: 'avp-kanagam-nagar',
    location: 'Kalivanthapattu, Chennai',
    address: 'Kalivanthapattu Road, Maraimalai Nagar / Chennai',
    bhk: 'Plots',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 3500/Sq.Ft',
    image: '/images/projects/plot_avp_kanagam_nagar.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '13',
    name: 'KPN Thulir',
    slug: 'kpn-thulir',
    location: 'S.P. Kovil, Chennai',
    address: 'Singaperumal Koil Main Road, Chennai',
    bhk: 'Plots',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 2099/Sq.Ft',
    image: '/images/projects/plot_kpn_thulir.jpeg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '14',
    name: 'KPN Sri Sai Baba Nagar',
    slug: 'kpn-sri-sai-baba-nagar',
    location: 'Karanaikattur, Chennai',
    address: 'Karanai Kattur Main Road, Chennai',
    bhk: 'Plots',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 999/Sq.Ft',
    image: '/images/projectimg/KPN-SAI-BABA-NAGAR.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '15',
    name: 'KPN Hindhu Avenue',
    slug: 'kpn-hindhu-avenue',
    location: 'Urapakkam, Chennai',
    address: 'Hindhu Avenue, Urapakkam, Chennai',
    bhk: '2 & 3 BHK Villa',
    type: 'Villas',
    status: 'Ongoing',
    budget: '₹ 45L Onwards',
    image: '/images/projectimg/KPN-Hindu-Avenue.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '16',
    name: 'KPN Platinum City',
    slug: 'kpn-platinum-city',
    location: 'Karanaipuducheri, Chennai',
    address: 'Karanaipuducheri Main Road, Chennai',
    bhk: 'Plots',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 2499/Sq.Ft',
    image: '/images/projectimg/KPN-Platinum-City.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '17',
    name: 'KPN Sairam Nagar',
    slug: 'kpn-sairam-nagar',
    location: 'Urapakkam, Chennai',
    address: 'Sairam Nagar, Urapakkam, Chennai',
    bhk: '2 & 3 BHK Villa',
    type: 'Villas',
    status: 'Ongoing',
    budget: '₹ 52L Onwards',
    image: '/images/projectimg/KPN-Sai-Ram-Nagar.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '18',
    name: 'KPN Krishna Nagar',
    slug: 'kpn-krishna-nagar',
    location: 'Urapakkam, Chennai',
    address: 'Krishna Nagar, Urapakkam, Chennai',
    bhk: 'Plots',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 3200/Sq.Ft',
    image: '/images/projectimg/KPN-KRISHNA-NAGAR.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '19',
    name: 'KPN Grand',
    slug: 'kpn-grand',
    location: 'Karanaipuducheri, Chennai',
    address: 'KPN Grand, Karanaipuducheri, Chennai',
    bhk: '2 & 3 BHK Villa',
    type: 'Villas',
    status: 'Ongoing',
    budget: '₹ 58L Onwards',
    image: '/images/projectimg/KPN-GRAND.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '20',
    name: 'KPN Silverwood',
    slug: 'kpn-silverwood',
    location: 'Urapakkam, Chennai',
    address: 'Silverwood Avenue, Urapakkam, Chennai',
    bhk: '2 BHK',
    type: 'Apartments',
    status: 'Ongoing',
    budget: '₹ 42L Onwards',
    image: '/images/projectimg/KPN-SILVERWOOD.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
  {
    id: '21',
    name: 'KPN Sri Bhavani Amman Nagar',
    slug: 'kpn-sri-bhavani-amman-nagar',
    location: 'Karanaipuducheri, Chennai',
    address: 'Karanaipuducheri Main Road, Chennai',
    bhk: 'Plots',
    type: 'Plots',
    status: 'Ongoing',
    budget: '₹ 3899/Sq.Ft',
    image: '/images/projectimg/KPN-SRI-BHAVANI-AMMAN-NAGAR.jpg',
    streetViewUrl: 'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
  },
];

export const teamData = [
  {
    name: 'Johan Sanford',
    role: 'Executive Assistant',
    image: '/images/team/team-1.jpg',
  },
  {
    name: 'Floyd Miles',
    role: 'Director of Architecture',
    image: '/images/team/team-2.jpg',
  },
  {
    name: 'Dennis Daniels',
    role: 'Founder & CEO',
    image: '/images/team/team-3.jpg',
  },
  {
    name: 'Leslie Alexander',
    role: 'Development Manager',
    image: '/images/team/team-4.jpg',
  },
];
export const testimonialsData = [
  {
    title: "Excellent experience!",
    quote: "A wonderful experience! They knew what they were doing and were incredibly knowledgeable throughout the process.",
    author: "Floyd Miles",
    role: "Bond Projects Coordinator",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
  },
  {
    title: "Totally Impressed!",
    quote: "I asked to have the area rebuilt and they were very prompt! Mud and texture came out great! Would highly recommend!",
    author: "Ronald Benson",
    role: "Marketing Director",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  },
  {
    title: "Excellent Communication",
    quote: "We like the facilities & maintenance services here so much that we have even referred it to our relatives.",
    author: "John McConnor",
    role: "Senior Marketing Manager",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80",
  },
  {
    title: "Highly Recommended",
    quote: "Your team were great to work with on our basement remodel! I will definitely be working with them for future projects!",
    author: "Alena Fisher",
    role: "Senior Marketing Manager",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
  },
];

export interface BlogPostItem {
  id: string;
  slug: string;
  category: string;
  date: string;
  title: string;
  image: string;
  excerpt: string;
  content: string[];
  galleryImages?: string[];
}

export const blogData: BlogPostItem[] = [
  {
    id: '01',
    slug: 'how-to-get-started-in-buying-your-first-home',
    category: 'Tips & Tricks',
    date: 'Mar 18, 2025',
    title: 'How to Get Started in Buying Your First Home',
    image: '/images/blog/blog_1.jpg',
    excerpt: 'Navigating your first home purchase can feel overwhelming. Discover essential steps, financial planning, and developer guidance.',
    content: [
      'It’s no secret that access to quality housing and education is vital. Many buyers in underserved or growing communities lack proper developer guidance, qualified legal advisory, and transparent property options. This divide creates uncertainty for first-time buyers.',
      'Education and guidance empower families to dream beyond their circumstances and envision a world of possibilities. Investing in real estate is more than just acquiring property; it is about establishing a lasting legacy for your family.',
      'In a world brimming with opportunities, supporting sustainable residential developments lays the cornerstone of long-term wealth, security, and peace of mind.',
    ],
    galleryImages: [
      '/images/projects/project_1.jpg',
      '/images/projects/project_2.jpg',
    ],
  },
  {
    id: '02',
    slug: 'exploring-minimalism-with-a-touch-of-luxury',
    category: 'Company',
    date: 'Mar 18, 2025',
    title: 'Exploring Minimalism with a Touch of Luxury',
    image: '/images/blog/blog_2.jpg',
    excerpt: 'Modern architectural design balances clean lines with high-end finishes for a clutter-free, luxurious ambiance.',
    content: [
      'Minimalist home design focuses on essential structural beauty while incorporating premium natural textures and warm lighting.',
      'By streamlining interior spaces, homeowners create tranquil environments that promote wellness and modern living standards.',
    ],
    galleryImages: [
      '/images/projects/project_3.jpg',
      '/images/projects/project_4.jpg',
    ],
  },
  {
    id: '03',
    slug: 'are-sustainable-materials-the-future-of-homes',
    category: 'Social Media',
    date: 'Mar 18, 2025',
    title: 'Are Sustainable Materials the Future of Homes?',
    image: '/images/blog/blog_3.jpg',
    excerpt: 'Eco-friendly building materials are transforming modern real estate development and reducing environmental footprint.',
    content: [
      'Green building technology and sustainable material sourcing are rapidly becoming standard in modern residential infrastructure.',
      'Investing in energy-efficient insulation and solar integration ensures long-term utility savings and environmental preservation.',
    ],
    galleryImages: [
      '/images/projects/project_5.jpg',
      '/images/projects/project_6.jpg',
    ],
  },
  {
    id: '04',
    slug: 'biophilic-design-bringing-nature-indoors',
    category: 'Tips & Tricks',
    date: 'Mar 18, 2025',
    title: 'Biophilic Design Bringing Nature Indoors',
    image: '/images/projects/project_1.jpg',
    excerpt: 'Integrating natural greenery and sunlight into indoor spaces improves air quality and mental well-being.',
    content: [
      'Biophilic architecture seamlessly connects indoor living areas with natural landscape elements, courtyards, and vertical gardens.',
    ],
    galleryImages: [
      '/images/projects/project_1.jpg',
      '/images/projects/project_2.jpg',
    ],
  },
  {
    id: '05',
    slug: 'revamping-old-spaces',
    category: 'Social Media',
    date: 'Mar 18, 2025',
    title: 'Revamping Old Spaces',
    image: '/images/projects/project_2.jpg',
    excerpt: 'Smart renovation strategies for breathing new life into traditional residential properties.',
    content: [
      'Renovating legacy properties requires strategic structural enhancements and modern aesthetic updates.',
    ],
    galleryImages: [
      '/images/projects/project_3.jpg',
      '/images/projects/project_4.jpg',
    ],
  },
  {
    id: '06',
    slug: 'tiny-homes-big-benefits',
    category: 'Company',
    date: 'Mar 18, 2025',
    title: 'Tiny Homes: Big Benefits',
    image: '/images/projects/project_3.jpg',
    excerpt: 'Compact living spaces engineered for maximum functionality, affordability, and eco-friendly lifestyles.',
    content: [
      'Compact home floor plans utilize space optimization to deliver full comfort within efficient footprints.',
    ],
    galleryImages: [
      '/images/projects/project_5.jpg',
      '/images/projects/project_6.jpg',
    ],
  },
];

export interface AwardItem {
  id: string;
  year: string;
  title: string;
  organization: string;
  image: string;
}

export const awardsData: AwardItem[] = [
  {
    id: '01',
    year: '2024',
    title: 'FPA Home Expo 2024',
    organization: 'By Flat Promoters Association',
    image: '/images/awards/FPA-Home-Expo-2024.png',
  },
  {
    id: '02',
    year: '2023',
    title: 'FPA Home Expo 2023',
    organization: 'By Flat Promoters Association',
    image: '/images/awards/FPA-Home-Expo-2023.png',
  },
  {
    id: '03',
    year: '2025',
    title: 'Trusted Developer of the Year',
    organization: 'By Economic Times Achievers of Tamil Nadu',
    image: '/images/awards/Trusted-Developer-2025.png',
  },
  {
    id: '04',
    year: '2017',
    title: 'Best Builder Award',
    organization: 'Top Commercial & Residential Builder',
    image: '/images/awards/Best-Builder-2017.png',
  },
  {
    id: '05',
    year: '2019',
    title: 'Business Growth Award',
    organization: 'Excellence in Real Estate Development',
    image: '/images/awards/Business-Growth-2019.png',
  },
  {
    id: '06',
    year: '2021',
    title: 'Business Growth Award',
    organization: 'Outstanding Achievement in Housing',
    image: '/images/awards/Business-Growth-2021.png',
  },
  {
    id: '07',
    year: '2024',
    title: 'LIC Business Meet Award',
    organization: 'Outstanding Performance & Partnership',
    image: '/images/awards/LIC-Business-Meet-2024.png',
  },
  {
    id: '08',
    year: '2024',
    title: 'Township Developers of the Year',
    organization: 'Integrated Township Excellence',
    image: '/images/awards/Township-Developers-2024.png',
  },
  {
    id: '09',
    year: '2024',
    title: 'Life Membership Certificate',
    organization: 'Flat Promoters Association',
    image: '/images/awards/Life-Membership-Certificate.png',
  },
];