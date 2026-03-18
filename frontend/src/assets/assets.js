import p1 from '../assets/1.jpg';
import user1 from '../assets/user1.jpg';
import user2 from '../assets/user2.jpg';
import user3 from '../assets/user3.jpeg';
import user4 from '../assets/user4.jpg';
// import p2 from '../assets/download.jpg';
// import bg1 from '../assets/download(1).jpeg';
// import bg2 from '../assets/download(2).jpeg';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart, 
  Target, 
  BarChart3, 
  LogOut,
  PlusCircle,  
  Bell,        
  Search,       
  UserCog,
  UserRound,
  Calendar, Mail, Phone, MapPin,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export const assets = {
  p1
    // p1,p2
    // , bg2, bg1
}

export const Icons = {
  Dashboard: LayoutDashboard,
  Transactions: ArrowLeftRight,
  Budget: PieChart,
  Goals: Target,
  Analytics: BarChart3,
  Account:  UserCog,
  Logout: LogOut,
  Add: PlusCircle,
  Notification: Bell,
  Search: Search,
  User: UserRound,
  Calendar,
  ArrowUp,
  ArrowDown,
};


export const SidebarLinks = [
  { id: 1, label: 'Dashboard', path: '/owner/dashboard', icon: Icons.Dashboard },
  { id: 2, label: 'Transactions', path: '/owner/transactions', icon: Icons.Transactions },
  { id: 3, label: 'Budgeting', path: '/owner/budget', icon: Icons.Budget },
  { id: 4, label: 'Savings Goals', path: '/owner/goals', icon: Icons.Goals },
  { id: 5, label: 'Analytics', path: '/owner/analytics', icon: Icons.Analytics },
  { id: 6, label: 'Account', path: '/owner/account', icon: Icons.Account },
];

export const dummyUserData = {
    "_id": "23t2f298y23e2iiyr2680987",
    "name": "Jennifer",
    "email": "JDcars@gmail.com",
    "role": "owner",
    "image": p1,
}

export const summaryCardDetails = [
  {
    id: "balance",
    label: "Total Balance",
    detail: "vs last month"
  },
  {
    id: "income",
    label: "Monthly Income",
    detail: "Target: 500k FCFA"
  },
  {
    id: "expenses",
    label: "Total Expenses",
    detail: "transactions this month"
  },
  {
    id: "savings",
    label: "Total Savings",
    detail: "Keep it up!"
  }
];

export const transactionHistory = [
  {
    id: 1,
    date: "09/29/25 - 18:45",
    category: "Transport",
    method: "Cash in Hand",
    amount: "500frs",
    status: "Complete"
  },
  {
    id: 2,
    date: "07/28/25 - 20:45",
    category: "Food",
    method: "Cash in Hand",
    amount: "1500frs",
    status: "Failed"
  },
  {
    id: 3,
    date: "08/28/25 - 22:45",
    category: "Food",
    method: "Momo",
    amount: "1500frs",
    status: "Pending"
  }
];


 export const goalData = [
  { 
    id: 1, 
    title: "Wi-Fi Box", 
    targetAmount: 25000, 
    savedSoFar: 5000, 
    targetDate: "03 Feb 2026" 
  },
  { 
    id: 2, 
    title: "Mum's Birthday", 
    targetAmount: 25000, 
    savedSoFar: 3000, 
    targetDate: "03 Aug 2026" 
  },
  { 
    id: 3, 
    title: "Defense Expenses", 
    targetAmount: 25000, 
    savedSoFar: 7000, 
    targetDate: "29 March 2026" 
  },
  { 
    id: 4, 
    title: "Camtel Internet", 
    targetAmount: 3500, 
    savedSoFar: 500, 
    targetDate: "24 Nov 2023" 
  },
  { 
    id: 5, 
    title: "Anna's Birthday", 
    targetAmount: 5000, 
    savedSoFar: 1000, 
    targetDate: "14 Jan 2026" 
  },
  { 
    id: 6, 
    title: "Defense Expenses", 
    targetAmount: 25000, 
    savedSoFar: 7000, 
    targetDate: "29 March 2026" 
  }
];
export const CATEGORIES = [
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transport' },
  { value: 'rent', label: 'Rent & Utilities' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'entertainment', label: 'Fun & Vibes' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' }
];
export const testimonialData = [
  {
    id: 1,
    initials: "EY",
    name: "Eren Yegeur",
    rating: 5,
    theme: "indigo",
    image: user1, 
    body: "Finally, an app that understands FCFA! It’s the first time I’ve actually felt in control of my monthly business spending."
  },
  {
    id: 2,
    initials: "MA",
    name: "Mikasa Akerman",
    rating: 5,
    theme: "pink",
    image: user2, 
    body: "The interface is so smooth. Tracking my student allowance used to be a hassle, but now it’s my favorite daily habit."
  },
  {
    id: 3,
    initials: "LA",
    name: "Livail Akerman",
    rating: 3.5,
    theme: "pink",
    image: user3, 
    body: "The interface is so smooth. Tracking my student allowance used to be a hassle, but now it’s my favorite daily habit."
  },
  {
    id: 4,
    initials: "SA",
    name: "Samira A.",
    rating: 4,
    theme: "pink",
    image: user4, 
    body: "The interface is so smooth. Tracking my student allowance used to be a hassle, but now it’s my favorite daily habit."
  },
];

export const contactDetails = [
  {
    id: 1,
    icon: Mail,
    label: "Email Us",
    value: "support@personalFinance.com",
    color: "#4f46e5"
  },
  {
    id: 2,
    icon: Phone,
    label: "Call/WhatsApp",
    value: "+237 672 62 35 57",
    color: "#10b981"
  },
  {
    id: 3,
    icon: MapPin,
    label: "Location",
    value: "Yaoundé, Cameroon",
    color: "#f59e0b"
  }
];
export const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Vault Overview", href: "#overview" },
    { name: "Testimonials", href: "#testimonials" }
  ],
  company: [
    { name: "About FinGuard", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" }
  ],
  social: [
    { name: "Twitter", href: "#" },
    { name: "LinkedIn", href: "#" },
    { name: "Instagram", href: "#" }
  ]
};


// #F2F8FB , #002366, 
// #2546EA
// #B0E0E6 the color for the bg 
// #2546EA color for the diff btns