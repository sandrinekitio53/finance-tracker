import p1 from '../assets/1.jpg';
import p2 from '../assets/download.jpg';
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
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export const assets = {
    p1,p2
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
    "image": p2,
}

// Inside your assets/assets.js
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
    date: "09/28/25 - 20:45",
    category: "Food",
    method: "Cash in Hand",
    amount: "1500frs",
    status: "Failed"
  },
  {
    id: 3,
    date: "09/28/25 - 22:45",
    category: "Food",
    method: "Momo",
    amount: "1500frs",
    status: "Pending"
  }
];
// export const ownerPageLinks = [
//     {name: "Dashboard", path: "/owner", icon:dashboardIcon , coloredIcon:dashboardIconColored},
//     {name:"Add expense details" , path: "/owner/Edetails"  , icon:expenseicon , coloredIcon: expenseiconColored},
//     { name:"Transaction history " , path: "/owner/transactions" , icon:transactionIcon , coloredIcon:transactionIconColored},
//     { name:"Manager Goals" , path: "/owner/manage-goals" , icon:goalsIcon , coloredIcon:goalsIconColored},

// ]

// #F2F8FB , #002366, 
// #2546EA
// #B0E0E6 the color for the bg 
// #2546EA color for the diff btns