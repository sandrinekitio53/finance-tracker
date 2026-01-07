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
  UserRound
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
  User: UserRound
};


export const SidebarLinks = [
  { id: 1, label: 'Overview', path: '/owner/dashboard', icon: Icons.Dashboard },
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