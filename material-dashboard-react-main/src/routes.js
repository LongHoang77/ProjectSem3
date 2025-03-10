

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import TicketTransactions from "layouts/TicketTransactions";

// @mui icons
import Icon from "@mui/material/Icon";
import TicketTypes from "layouts/TicketTypes";
import MovieManagement from "layouts/MovieManagement";
import ShowtimeManagement from "layouts/ShowtimeManagement";
import ShopManagement from "layouts/ShopManagement";
import FoodCourtManagement from "layouts/FoodCourtManagement";
import GalleryManagement from "layouts/GalleryManagement";



const routes = [
    
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
//   {
//     type: "collapse",
//     name: "Movie Management",
//     key: "tables",
//     icon: <Icon fontSize="small">table_view</Icon>,
//     route: "/tables",
//     component: <Tables />,
//   },
  {
    type: "collapse",
    name: "Ticket Transactions",
    key: "ticket-transactions",
    icon: <Icon fontSize="small">receipt</Icon>,
    route: "/ticket-transactions",
    component: <TicketTransactions />,
  },

  {
    type: "collapse",
    name: "Ticket Type",
    key: "ticket-types",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/ticket-types",
    component: <TicketTypes />,
  },
  {
    type: "collapse",
    name: "Showtime Management",
    key: "showtime-management",
    icon: <Icon fontSize="small">schedule</Icon>,
    route: "/showtime-management",
    component: <ShowtimeManagement />,
  },
  {
    type: "collapse",
    name: "Movie Management",
    key: "movie-management",
    icon: <Icon fontSize="small">movie</Icon>,
    route: "/movie-management",
    component: <MovieManagement />,
  },
  {
    type: "collapse",
    name: "Shop Management",
    key: "shop-management",
    icon: <Icon fontSize="small">store</Icon>,
    route: "/shop-management",
    component: <ShopManagement />,
  },
  {
    type: "collapse",
    name: "Food Courts",
    key: "foodcourts",
    icon: <Icon fontSize="small">restaurant</Icon>,
    route: "/foodcourts",
    component: <FoodCourtManagement />,
  },

  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
    hideInSidenav: true,
  },
  {
    type: "collapse",
    name: "Gallery Management",
    key: "gallery-management",
    icon: <Icon fontSize="small">image</Icon>,
    route: "/gallery-management",
    component: <GalleryManagement />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },

  
];

export default routes;
