import Sidebar from "../components/layouts/Sidebar";
import {NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
import { FaCalendarDays } from "react-icons/fa6";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaPeopleArrows } from "react-icons/fa";
import { MdOutlineEmojiPeople } from "react-icons/md";
import { FaPersonWalkingArrowLoopLeft } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { MdOutlineReceiptLong } from "react-icons/md";
import { RiAuctionFill } from "react-icons/ri";
import { MdMan } from "react-icons/md";
import { LiaCalculatorSolid } from "react-icons/lia";
import { GiMoneyStack } from "react-icons/gi"
const subMenus = [
  { title: "Daybook", link: "/reports/daybook" ,Icon:FaCalendarDays },
  { title: "Group Report", link: "/reports/group-report" ,Icon:FaPeopleGroup  },
  { title: "Enrollment Report", link: "/reports/enrollment-report" ,Icon:FaPeopleArrows },
  { title: "All Customer Report", link: "/reports/all-user-report" ,Icon:FaPersonWalkingArrowLoopLeft },
  { title: "Customer Report", link: "/reports/user-report",Icon:MdOutlineEmojiPeople},
  { title: "Employee Report", link: "/reports/employee-report",Icon: FaUserTie },
  { title: "Commission Report", link: "/reports/commission-report" ,Icon:RiMoneyRupeeCircleFill },
  { title: "Receipt Report", link: "/reports/receipt",Icon:MdOutlineReceiptLong  },
  { title: "Auction Report", link: "/reports/auction-report",Icon:RiAuctionFill  },
  { title: "Lead Report", link: "/reports/lead-report",Icon:MdMan  },
  { title: "Pigme Report", link: "/reports/pigme-report",Icon:LiaCalculatorSolid  },
  { title: "Loan Report", link: "/reports/loan-report",Icon:GiMoneyStack  },
];
const Reports = () => {
  return (
    <div>
      <div className="w-screen flex mt-20">
       {document.location.pathname ==="/reports" && <Navbar/>}
        <Sidebar />
        <div className="flex-grow">
          <div className="w-[300px] bg-gray-50 h-full  p-4">
            {subMenus.map(({ title, link, Icon, red }) => (
              <NavLink
            
                className={({ isActive }) =>
                  `my-2 flex items-center gap-2 font-medium rounded-md hover:bg-gray-300  p-3 ${
                    red ? "text-red-800" : "text-blue-950"
                  } ${isActive ? "bg-gray-200 border-l-8 border-blue-300" : ""}`
                }
                to={link}
              >
                {({ isActive }) => (
              <>
                <Icon className={`${isActive ? "animate-bounce" : ""}`} />
                {title}
              </>
            )}
              </NavLink>
            ))}
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Reports;
