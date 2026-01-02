import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowRight, Camera, Crown, Globe, Heart, Briefcase, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type EventStatus = "ongoing" | "upcoming" | "past";
type EventCategory = "flagship" | "international" | "community" | "vocational" | "club";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  attendees: number;
  status: EventStatus;
  category: EventCategory;
  image: string;
  gallerySlug?: string;
}

const events: Event[] = [
  // Flagship Events
  {
    id: 1,
    title: "ECOSWAP Phase 1: Smiling Roots",
    description: "On Van Mahotsav, we held our first event of RY 25-26 at Nigam Pratibha Vidyalaya, Hari Nagar. The day began with a powerful Nukkad Natak on environmental themes, followed by a plantation drive with 190 saplings planted by Rotaractors and students.",
    date: "July 4, 2025",
    location: "MCD School, Hari Nagar",
    attendees: 190,
    status: "past",
    category: "flagship",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop",
    gallerySlug: "ecoswap-phase-1",
  },
  {
    id: 2,
    title: "Hello Monthly Visitors 3.0 Phase 1",
    description: "We distributed 3500 sanitary pads at Jahangirpuri slum, in collaboration with Foundation Ayra and Be Me. An interactive awareness session focused on menstrual hygiene, myth-busting, and body positivity.",
    date: "July 27, 2025",
    location: "Jahangirpuri Slum",
    attendees: 350,
    status: "past",
    category: "flagship",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
    gallerySlug: "hmv-phase-1",
  },
  {
    id: 3,
    title: "Hello Monthly Visitors 3.0 Phase 2",
    description: "Phase 2 at Harijan Basti, Vasant Kunj, in collaboration with Foundation Ayra and Be Me. 900 boxes of high quality sanitary napkins distributed with an interactive session on menstrual health and hygiene.",
    date: "August 23, 2025",
    location: "Harijan Basti, Vasant Kunj",
    attendees: 900,
    status: "past",
    category: "flagship",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
    gallerySlug: "hmv-phase-2",
  },
  {
    id: 4,
    title: "ECOSWAP Phase 2: The Green Bin Revolution",
    description: "A panel discussion on sustainability with 579 participants from 53 clubs and 13 districts across India, Nepal and Nigeria. From not draining oil in basins to large scale discussions like LCA, ESG.",
    date: "September 5, 2025",
    location: "Google Meet",
    attendees: 579,
    status: "past",
    category: "flagship",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop",
    gallerySlug: "ecoswap-phase-2",
  },
  {
    id: 5,
    title: "Hello Monthly Visitors 3.0 Phase 3",
    description: "Phase 3 at Sarvodaya Kanya Vidyalaya, Janakpuri in collaboration with Grateful Child Welfare Foundation. Through an engaging quiz, expert session by Dr. Sheetal Sharma, and Q&A, students learned about menstrual health.",
    date: "September 8, 2025",
    location: "Sarvodaya Kanya Vidyalaya, Janakpuri",
    attendees: 200,
    status: "past",
    category: "flagship",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
    gallerySlug: "hmv-phase-3",
  },
  {
    id: 6,
    title: "Swasthyasetu Phase 1",
    description: "In collaboration with Sushakti Charitable Trust and ALT F Coworking Space, we promoted preventive healthcare. Over 1000 health checkups performed including thalassemia screening, and 50 blood units collected.",
    date: "September 10, 2025",
    location: "AltF Co-Working, Mohan Estate",
    attendees: 1000,
    status: "past",
    category: "flagship",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    gallerySlug: "swasthyasetu-phase-1",
  },
  {
    id: 7,
    title: "HPV सुरक्षा संकल्प Phase 1",
    description: "Second chapter of HPV vaccination at Bosco Public School. After the success of first camp with 278 vaccines, this initiative ensured participants received their second and final shield of protection against HPV.",
    date: "September 26, 2025",
    location: "Bosco Public School, Pashchim Vihar",
    attendees: 278,
    status: "past",
    category: "flagship",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    gallerySlug: "hpv-suraksha-phase-1",
  },
  {
    id: 8,
    title: "ECOSWAP Phase 3: Swachh Yamuna Abhiyan",
    description: "With 400+ participants, 10+ Rotarians, DRR, 16+ collaborators, and 10+ Rotaract Clubs, we collected over 500 kgs of plastic waste at Yuva Shakti Ghat in lieu of Gandhi Jayanti and World Rivers' Day.",
    date: "September 28, 2025",
    location: "Yuva Shakti Ghat, Sec-94, Noida",
    attendees: 400,
    status: "past",
    category: "flagship",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop",
    gallerySlug: "ecoswap-phase-3",
  },
  {
    id: 9,
    title: "Roshni 2.0 Phase 1",
    description: "A spectacular success featuring creative women-led stalls with jewelry, clothing, art, diyas, and lifestyle products. Included NGOs like UDAI and Aamdani by Saday for social upliftment.",
    date: "October 11, 2025",
    location: "Shalimar Bagh",
    attendees: 150,
    status: "past",
    category: "flagship",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&h=400&fit=crop",
    gallerySlug: "roshni-phase-1",
  },
  {
    id: 10,
    title: "Roshni 2.0 Phase 2",
    description: "Showcased women-led ventures and NGOs including Udai, She Creates, Undefined Arts, Roslay Jewels, Pearl Card Studio, Pretty Saree Emporium, and Shiv Shakti. Celebrated women's creativity and entrepreneurship.",
    date: "October 16-18, 2025",
    location: "Dwarka Sector 4",
    attendees: 200,
    status: "past",
    category: "flagship",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&h=400&fit=crop",
    gallerySlug: "roshni-phase-2",
  },
  {
    id: 11,
    title: "Hello Monthly Visitors 3.0 Phase 4",
    description: "Phase 4 at Sidhartha Nagar in collaboration with Pinkishe Foundation. An insightful session on menstrual health led by Dr. Abhilasha Garg, an Ayurvedic Gynecologist, focusing on breaking taboos.",
    date: "November 20, 2025",
    location: "Ashram",
    attendees: 200,
    status: "past",
    category: "flagship",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
    gallerySlug: "hmv-phase-4",
  },
  {
    id: 12,
    title: "HPV सुरक्षा संकल्प Phase 2",
    description: "Continuing our HPV vaccination initiative at Bal Bharati School Noida, providing protection against HPV to students.",
    date: "December 20, 2025",
    location: "Bal Bharati School, Noida",
    attendees: 300,
    status: "past",
    category: "flagship",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    gallerySlug: "hpv-suraksha-phase-2",
  },

  // Community Services
  {
    id: 13,
    title: "Pehraan - Dhaage Umeed Ke",
    description: "A one-day donation drive in collaboration with Aarogya Sankalp Foundation, distributing clean clothes and footwear to bring dignity and comfort to underprivileged families. 'Threads of Hope.'",
    date: "July 20, 2025",
    location: "Sayed Gaon",
    attendees: 100,
    status: "past",
    category: "community",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=400&fit=crop",
    gallerySlug: "pehraan",
  },
  {
    id: 14,
    title: "Sunheri कहानियाँ",
    description: "Visit to Swarg Vridh Ashram where we distributed essential supplies—food, medicines, and hearing aids—while engaging in heartfelt conversations with elderly residents. Stories of resilience left a deep impact.",
    date: "July 20, 2025",
    location: "Swarg Vridh Ashram, Nihal Vihar, Nangloi",
    attendees: 50,
    status: "past",
    category: "community",
    image: "https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=600&h=400&fit=crop",
    gallerySlug: "sunheri-kahaniya",
  },
  {
    id: 15,
    title: "Knot So Common: A Bond of Honour",
    description: "Under Rakhi For Real Heroes, we visited the DCP office and Janak Super Speciality Hospital to tie rakhis to those who selflessly serve us — DCP, SI, SO, constables, doctors, nurses, and security guards.",
    date: "August 8, 2025",
    location: "DCP Office Western Range, Janakpuri",
    attendees: 50,
    status: "past",
    category: "community",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
    gallerySlug: "knot-so-common",
  },
  {
    id: 16,
    title: "Har Dil Azad",
    description: "Independence Day celebration with the girls of Asha Grih at Dwarka. Playing, dancing, drawing, origami, making Indian flags with handprints - a day filled with love and independence.",
    date: "August 15, 2025",
    location: "Asha Grih Girls Home, Dwarka",
    attendees: 40,
    status: "past",
    category: "community",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop",
    gallerySlug: "har-dil-azad",
  },
  {
    id: 17,
    title: "CyberSafe - Don't Get Phished!",
    description: "Cyber safety event with Mr. Soumy Naman Srivastava. With 23 collaborating clubs and 150+ participants on Google Meet, the session covered spotting real-time cyber threats and checking compromised emails.",
    date: "August 23, 2025",
    location: "Google Meet",
    attendees: 150,
    status: "past",
    category: "community",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
    gallerySlug: "cybersafe",
  },
  {
    id: 18,
    title: "Clean-O-Mania: Shine Bright with Healthy Hygiene",
    description: "Hygiene Awareness Session at MCD School, Hari Nagar reaching 210+ students from Classes 3 to 5. Teaching handwashing, brushing, nail care through role plays, Q&A, and the Glitter Germs Experiment.",
    date: "September 12, 2025",
    location: "MCD School, Hari Nagar",
    attendees: 210,
    status: "past",
    category: "community",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    gallerySlug: "clean-o-mania",
  },
  {
    id: 19,
    title: "Let's Talk. Let's Heal.",
    description: "Suicide prevention awareness session in collaboration with RAC Kathmandu North East. 105+ participants with insights from Ms. Meemansha Gaur and Mr. Pradish Paudel on breaking stigma and identifying warning signs.",
    date: "September 24, 2025",
    location: "Google Meet",
    attendees: 105,
    status: "past",
    category: "community",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop",
    gallerySlug: "lets-talk-lets-heal",
  },
  {
    id: 20,
    title: "ReVIVE - Every Second Counts",
    description: "CPR Awareness and Training Session in collaboration with Ayushman Hospital and NSS NSUT East Cell. Dr. Ankit Sharma demonstrated life-saving CPR techniques with over 120 participants.",
    date: "November 6, 2025",
    location: "NSUT East Campus",
    attendees: 120,
    status: "past",
    category: "community",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    gallerySlug: "revive",
  },
  {
    id: 21,
    title: "सुंदर पल: Beautiful Moments with Beautiful Hearts",
    description: "Children's Day outing taking 30+ boys up to age 15 from Asha Grih Orphanage to Bharat Darshan Park. Ensuring smooth coordination, safety, and an engaging learning experience.",
    date: "November 14, 2025",
    location: "Bharat Darshan Park, Punjabi Bagh",
    attendees: 30,
    status: "past",
    category: "community",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop",
    gallerySlug: "sundar-pal",
  },
  {
    id: 22,
    title: "Read Label: A Step Towards Mindful Eating",
    description: "Awareness session at Shri Sanatan Dharam Saraswati Bal Mandir School with Maharaja Agrasen Hospital dieticians. 80+ students learned about interpreting ingredient lists and nutritional values.",
    date: "November 15, 2025",
    location: "Shri Sanatan Dharam Saraswati Bal Mandir School",
    attendees: 80,
    status: "past",
    category: "community",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&h=400&fit=crop",
    gallerySlug: "read-label",
  },
  {
    id: 23,
    title: "Khushiyon Ki Thali",
    description: "A warm food donation drive at Rohini Sector 3. We distributed 800+ plates of Rajma Chawal to kids, the elderly, hard-working labourers, rickshaw pullers and many more.",
    date: "November 16, 2025",
    location: "Rohini Sector 3",
    attendees: 800,
    status: "past",
    category: "community",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop",
    gallerySlug: "khushiyon-ki-thali",
  },

  // Vocational Service
  {
    id: 24,
    title: "CreoVision Ep 1: Edit Smart with Canva",
    description: "Exclusively for club members, celebrating World Youth Skills Day. Led by Mr. Deven Gupta (Nike, Haldiram's), covering design principles, Canva tools, and intro to video editing with Filmora.",
    date: "July 19, 2025",
    location: "Google Meet",
    attendees: 40,
    status: "past",
    category: "vocational",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    gallerySlug: "creovision-ep-1",
  },
  {
    id: 25,
    title: "CreoVision Ep 2: HR Unplugged",
    description: "Panel discussion with 80+ participants and 15 collaborating clubs. Seasoned panelists Ms. Rishika Verma, Mr. Asit N Shukla, and Ms. Diya Bhat discussed ATS, CV structure, and importance of research papers.",
    date: "August 24, 2025",
    location: "Google Meet",
    attendees: 80,
    status: "past",
    category: "vocational",
    image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=600&h=400&fit=crop",
    gallerySlug: "creovision-ep-2",
  },
  {
    id: 26,
    title: "Unscripted: Speak Your Mind",
    description: "Public Speaking & Confidence Workshop at Ramjas International School with Mr. Khalid Imam from College Skills. 70+ participants empowered to overcome hesitation and stage fright.",
    date: "August 30, 2025",
    location: "Ramjas International School, R.K. Puram",
    attendees: 70,
    status: "past",
    category: "vocational",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop",
    gallerySlug: "unscripted",
  },
  {
    id: 27,
    title: "CreoVision Ep 3: Promptify - Prompting Made Simple",
    description: "Workshop on creating Rotaract event messages using AI prompts, generating visuals for posters, writing event reports with ChatGPT, and preparing pitch decks using Gamma.",
    date: "November 30, 2025",
    location: "Google Meet",
    attendees: 50,
    status: "past",
    category: "vocational",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=400&fit=crop",
    gallerySlug: "creovision-ep-3",
  },

  // Club Services
  {
    id: 28,
    title: "Anugraha: Beginning of Chapter 2",
    description: "The official inauguration ceremony for the new Rotaract year at Delhi Public Library, Chandani Chowk.",
    date: "July 12, 2025",
    location: "Delhi Public Library, Chandani Chowk",
    attendees: 60,
    status: "past",
    category: "club",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop",
    gallerySlug: "anugraha",
  },
  {
    id: 29,
    title: "Entangled: Beautifully Tangled in Moments",
    description: "Friendship Day celebration at Pacific Mall with 16 members. Activities included making friendship loopbands, gaming with bowling, air hockey, VR, claw machines, followed by lunch at Sandos.",
    date: "August 3, 2025",
    location: "Pacific Mall, NSP Pitampura",
    attendees: 16,
    status: "past",
    category: "club",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
    gallerySlug: "entangled",
  },
  {
    id: 30,
    title: "Joy Jam: The Fun Time",
    description: "Fellowship event over Google Meet featuring games like Guess the Movie, Scavenger Hunt, and Collaborative Storytelling. A lighthearted evening to interact and strengthen connections.",
    date: "September 18, 2025",
    location: "Google Meet",
    attendees: 25,
    status: "past",
    category: "club",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&h=400&fit=crop",
    gallerySlug: "joy-jam",
  },
  {
    id: 31,
    title: "DRR's Official Visit",
    description: "The District Rotaract Representative's official visit to our club for guidance and interaction with members.",
    date: "September 23, 2025",
    location: "Google Meet",
    attendees: 40,
    status: "past",
    category: "club",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    gallerySlug: "drr-visit",
  },
  {
    id: 32,
    title: "DSE-ए-Diwali!",
    description: "Our club's Diwali celebration filled with lights, laughter, and fellowship among members.",
    date: "October 4, 2025",
    location: "Janakpuri",
    attendees: 35,
    status: "past",
    category: "club",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&h=400&fit=crop",
    gallerySlug: "dse-diwali",
  },
  {
    id: 33,
    title: "Secret Santa",
    description: "Our annual Secret Santa gift exchange bringing joy and surprise to all club members during the festive season.",
    date: "December 26, 2025",
    location: "Google Meet",
    attendees: 30,
    status: "past",
    category: "club",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&h=400&fit=crop",
    gallerySlug: "secret-santa",
  },

  // International Service
  {
    id: 34,
    title: "InkBonds: Mega Letterhead Exchange",
    description: "Letterhead Exchange event with participation from 24 clubs across 5 districts. Members engaged in meaningful exchanges, sharing club initiatives and cultural insights.",
    date: "July 27, 2025",
    location: "Central Park, Connaught Place",
    attendees: 100,
    status: "past",
    category: "international",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
    gallerySlug: "inkbonds-1",
  },
  {
    id: 35,
    title: "Rakhi for Real Heroes",
    description: "International Avenue initiative where we tied rakhis to those who selflessly serve us across India — police officers, doctors, nurses, and security guards.",
    date: "August 1-10, 2025",
    location: "Pan India",
    attendees: 200,
    status: "past",
    category: "international",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
    gallerySlug: "rakhi-real-heroes",
  },
  {
    id: 36,
    title: "Imphal Culture Exchange",
    description: "Cultural exchange program in Imphal, exploring the rich heritage and traditions of the North East.",
    date: "August 28, 2025",
    location: "Imphal",
    attendees: 30,
    status: "past",
    category: "international",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop",
    gallerySlug: "imphal-exchange",
  },
  {
    id: 37,
    title: "2nd Edition of North East CSR Connect",
    description: "CSR networking event at The Lalit New Delhi connecting organizations working for North East development.",
    date: "September 17, 2025",
    location: "The Lalit, New Delhi",
    attendees: 100,
    status: "past",
    category: "international",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
    gallerySlug: "ne-csr-connect",
  },
  {
    id: 38,
    title: "Swaad Sangam: A Fusion of Indian & Nepali Flavours",
    description: "Strengthening the Sister Club bond between RaC Delhi South East and RaC Kathmandu East, celebrating unity through culture and cuisine. As Dhokla met Aaloo ka Achaar, hearts blended across borders.",
    date: "October 8, 2025",
    location: "Google Meet",
    attendees: 50,
    status: "past",
    category: "international",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop",
    gallerySlug: "swaad-sangam",
  },
  {
    id: 39,
    title: "Inkbonds 2.0",
    description: "Mega Letterhead Exchange bringing together clubs from districts 3011, 3012, and 3141. Successfully exchanged letterheads with RAC NMIMS ASMSOC.",
    date: "October 24, 2025",
    location: "Central Secretariat",
    attendees: 80,
    status: "past",
    category: "international",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
    gallerySlug: "inkbonds-2",
  },
  {
    id: 40,
    title: "RIDE: Daastan-e-Dilli",
    description: "A 3-day Rotaract Inter-District Exchange exploring Delhi's rich history and culture with Rotaractors from different districts.",
    date: "November 21-23, 2025",
    location: "Delhi",
    attendees: 50,
    status: "past",
    category: "international",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop",
    gallerySlug: "ride-daastan-e-dilli",
  },
  {
    id: 41,
    title: "Inkbonds 3.0",
    description: "Third edition hosting Rtr. Bishakha from RAC KNE Nepal (RID 3292). Ten clubs from RID 3011 and 3012 joined, sharing letterheads and pins. Included Qutub Minar light show and Delhi street food.",
    date: "December 7, 2025",
    location: "Central Park, Connaught Place",
    attendees: 40,
    status: "past",
    category: "international",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
    gallerySlug: "inkbonds-3",
  },
  {
    id: 42,
    title: "Rotaract Inter Club Exchange",
    description: "Exchange program between Delhi and Kathmandu, Nepal. Building international friendships and cultural understanding across borders.",
    date: "December 7-8 & 22-23, 2025",
    location: "Delhi & Kathmandu, Nepal",
    attendees: 30,
    status: "past",
    category: "international",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop",
    gallerySlug: "inter-club-exchange",
  },
  {
    id: 43,
    title: "Ekatra: A Fellowship Lunch",
    description: "Brought together 5 Rotaractors from 3 clubs across RID 3234 and 3141, with 8 participating clubs. Mega Letterhead Exchange at Xero Degree followed by fellowship lunch and Delhi street food.",
    date: "December 10, 2025",
    location: "Xero Degree, Connaught Place",
    attendees: 40,
    status: "past",
    category: "international",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop",
    gallerySlug: "ekatra",
  },
  {
    id: 44,
    title: "SEARIC Summit Nepal 2025",
    description: "South East Asia Rotaract Inter-Country Summit in Pokhara, Nepal - connecting Rotaractors from across the South East Asian region.",
    date: "December 19-21, 2025",
    location: "Pokhara, Nepal",
    attendees: 200,
    status: "past",
    category: "international",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop",
    gallerySlug: "searic-nepal",
  },
];

const categoryConfig = {
  flagship: {
    label: "Flagship",
    icon: Crown,
    color: "bg-primary",
    bgColor: "bg-primary/10",
    textColor: "text-primary",
  },
  international: {
    label: "International",
    icon: Globe,
    color: "bg-blue-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600",
  },
  community: {
    label: "Community Services",
    icon: Heart,
    color: "bg-rose-500",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-600",
  },
  vocational: {
    label: "Vocational",
    icon: Briefcase,
    color: "bg-amber-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600",
  },
  club: {
    label: "Club Services",
    icon: Handshake,
    color: "bg-emerald-500",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600",
  },
};

const statusConfig = {
  ongoing: {
    label: "Currently Active",
    color: "bg-green-500",
    bgColor: "bg-green-500/10",
    textColor: "text-green-600",
  },
  upcoming: {
    label: "Coming Soon",
    color: "bg-secondary",
    bgColor: "bg-secondary/10",
    textColor: "text-secondary",
  },
  past: {
    label: "Completed",
    color: "bg-muted-foreground",
    bgColor: "bg-muted",
    textColor: "text-muted-foreground",
  },
};

const Events = () => {
  const [activeCategory, setActiveCategory] = useState<EventCategory | "all">("all");
  const [activeStatus, setActiveStatus] = useState<EventStatus | "all">("all");

  const filteredEvents = events.filter((e) => {
    const categoryMatch = activeCategory === "all" || e.category === activeCategory;
    const statusMatch = activeStatus === "all" || e.status === activeStatus;
    return categoryMatch && statusMatch;
  });

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <section className="py-20 md:py-32 bg-muted/30 relative">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                Our Events
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Making <span className="gradient-text">Impact</span> Together
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From plantation drives to blood donation camps, explore our projects that create real change.
              </p>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 text-center">Filter by Category</h3>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={cn(
                    "px-5 py-2.5 rounded-full font-medium transition-all text-sm flex items-center gap-2",
                    activeCategory === "all"
                      ? "gradient-bg text-primary-foreground shadow-lg"
                      : "bg-card hover:bg-muted border border-border"
                  )}
                >
                  All Categories
                </button>
                {(Object.keys(categoryConfig) as EventCategory[]).map((cat) => {
                  const config = categoryConfig[cat];
                  const Icon = config.icon;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "px-5 py-2.5 rounded-full font-medium transition-all text-sm flex items-center gap-2",
                        activeCategory === cat
                          ? `${config.color} text-white shadow-lg`
                          : "bg-card hover:bg-muted border border-border"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Filter */}
            <div className="mb-12">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 text-center">Filter by Status</h3>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {[
                  { key: "all", label: "All Events" },
                  { key: "ongoing", label: "🔥 Currently Active" },
                  { key: "upcoming", label: "📅 Upcoming" },
                  { key: "past", label: "✅ Completed" },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveStatus(filter.key as EventStatus | "all")}
                    className={cn(
                      "px-6 py-3 rounded-full font-medium transition-all",
                      activeStatus === filter.key
                        ? "gradient-bg text-primary-foreground shadow-lg"
                        : "bg-card hover:bg-muted"
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => {
                const catConfig = categoryConfig[event.category];
                const CatIcon = catConfig.icon;
                
                return (
                  <div
                    key={event.id}
                    className="glass-card rounded-3xl overflow-hidden hover-lift group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                          statusConfig[event.status].bgColor,
                          statusConfig[event.status].textColor
                        )}>
                          <span className={cn("w-2 h-2 rounded-full", statusConfig[event.status].color)} />
                          {statusConfig[event.status].label}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                          catConfig.bgColor,
                          catConfig.textColor
                        )}>
                          <CatIcon className="w-3 h-3" />
                          {catConfig.label}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      {/* Meta Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 text-primary" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 text-primary" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4 text-primary" />
                          {event.attendees}+ Participants
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          variant={event.status === "ongoing" ? "hero" : "outline"} 
                          className="flex-1"
                        >
                          {event.status === "ongoing" ? "Join Now" : event.status === "upcoming" ? "Register" : "Details"}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                        {event.gallerySlug && (
                          <Button variant="outline" size="icon" asChild>
                            <Link to={`/gallery?event=${event.gallerySlug}`}>
                              <Camera className="w-4 h-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No events found matching your filters.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => { setActiveCategory("all"); setActiveStatus("all"); }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
};

export default Events;
