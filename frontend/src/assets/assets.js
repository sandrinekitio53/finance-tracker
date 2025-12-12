import p1 from '../assets/1.jpg'
import p2 from '../assets/download.jpg'
import bg1 from '../assets/download(1).jpeg'
import bg2 from '../assets/download(2).jpeg'

export const assets = {
    p1,p2,bg1, bg2
}
export const pageLink = [  // these are being used to link to other pages easily
    {name: "Home" , path: '/'},
    {name: "About" , path: '/aboutus'},
    {name: "Services" , path: '/services'},
]

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

// F2F8FB the color for the bg 
// 2546EA color for the diff btns