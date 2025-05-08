import { Fragment, useRef, useState } from "react";
import { BsArrowLeftShort, BsChevronDown } from "react-icons/bs";
import { RiDashboardFill } from "react-icons/ri";
import { SiGoogleanalytics } from "react-icons/si";
import { TbCategoryPlus } from "react-icons/tb";
import { IoIosPersonAdd } from "react-icons/io";
import { BsCash } from "react-icons/bs";
import { GrAnalytics } from "react-icons/gr";
import { CgProfile, CgWebsite } from "react-icons/cg";
import { IoIosSettings } from "react-icons/io";
import { IoIosHelpCircle } from "react-icons/io";
import { RiAuctionLine } from "react-icons/ri";
import { FaPeopleArrows, FaUserLock } from "react-icons/fa";
import { GiGoldBar } from "react-icons/gi";
import { IoPeopleOutline } from "react-icons/io5";
import { GoGraph } from "react-icons/go";
import { GiTakeMyMoney } from "react-icons/gi";
import { PiCalculatorBold } from "react-icons/pi";
import { FaPersonCane } from "react-icons/fa6";
import { FaHandshake } from "react-icons/fa";
import ids from "../../data/ids";
import { TbArrowsLeftDown } from "react-icons/tb";
const MenuSidebar = [
  {
    id: "$1",
    title: "Dashboard",
    icon: <RiDashboardFill />,
    link: "/dashboard",
  },
  { title: "Analytics", icon: <SiGoogleanalytics />, link: "/analytics" },
  {
    id: "$2",
    title: "Groups ",
    spacing: true,
    icon: <TbCategoryPlus />,
    link: "/group",
  },
  {
    id: ids.three,
    title: "Customers ",
    icon: <IoIosPersonAdd />,
    link: "/user",
  },
  {
    id: "$4",
    title: "Enrollments ",
    icon: <FaPeopleArrows />,
    link: "/enrollment",
  },
  
  {
    id: "$18",
    title: "Tasks",
    icon: <FaUserLock />, 
    link: "/task",
  },
  {
    id: ids.seven,
    title: "Employees",
    icon: <FaUserLock />,
    link: "/agent",
  },
  
  {
    id: "$7",
    title: "Leads",
    icon: <IoPeopleOutline />,
    link: "/lead",
  },
  {
    id: "$8",
    title: "Loans",
    icon: <GiTakeMyMoney />,
    link: "/loan",
  },
  {
    id: "$9",
    title: "Pigme",
    icon: <PiCalculatorBold />,
    link: "/pigme",
  },
  {
    id: ids.eleven,
    title: "Auctions ",
    icon: <RiAuctionLine />,
    link: "/auction",
  },
  { id: ids.twelve, title: "Payments ", icon: <BsCash />, link: "/payment" },
  {
    id: "$12",
    title: "Reports",
    icon: <GrAnalytics />,
    link: "/reports",
  },
  {
    id: ids.fourteen,
    title: "Marketing",
    icon: <GoGraph />,
    link: "/marketing",
  },
  {
    id: ids.fifteen,
    title: "Profile",
    spacing: true,
    icon: <CgProfile />,
    link: "/profile",
  },
  {
    id: "$15",
    title: "Other Sites",
    icon: <CgWebsite />,
    submenu: true,
    submenuItems: [
      {
        id: "#1",
        title: "Gold Admin",
        link: "http://gold-admin-web.s3-website.eu-north-1.amazonaws.com/",
        newTab: true,
      }, // External link
      {
        id: "#2",
        title: "Chit Plans Admin",
        link: "https://erp.admin.mychits.co.in/chit-enrollment-plan/admin/",
        newTab: true,
      }, // External link
      {
        id: "#3",
        title: "Chit Enrollment Request",
        link: "https://erp.admin.mychits.co.in/src/request/enrollment.php?user-role=&user-code=",
        newTab: true,
      }, // External link
      // { title: "Consolidated", link: "/consolidate" },
    ],
  },
  {
    id: "$16",
    title: "Setting",
    icon: <IoIosSettings />,
    link: "/lead-setting",
  },
  {
    id: "$17",
    title: "Help & Support",
    icon: <IoIosHelpCircle />,
    link: "/help",
  },
];

const Sidebar = () => {
  const ref = useRef(null);
  const [open, setOpen] = useState(true);
  const [submenuOpenIndex, setSubmenuOpenIndex] = useState(null);
  const toggleSubMenu = (index) => {
    if (submenuOpenIndex === index) {
      setSubmenuOpenIndex(null);
    } else {
      setSubmenuOpenIndex(index);
    }
  };

  return (
    <>
      <div
        ref={ref}
        className={`bg-secondary min-h-screen max-h-auto p-5 pt-8 ${
          open ? "w-64" : "w-20"
        } duration-300 relative`}
      >
        <BsArrowLeftShort
          className={`bg-white text-secondary text-3xl rounded-full absolute -right-3 top-9 border border-secondary cursor-pointer ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        />
        <div className="inline-flex">
          <GiGoldBar
            className={`bg-amber-300 text-4xl rounded cursor-pointer block float-left mr-2 duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h3
            className={`text-white origin-left font-medium text-2xl ${
              !open && "scale-0"
            } duration-300 `}
          >
            MyChits
          </h3>
        </div>

        <ul className="pt-2">
          {MenuSidebar.map((menu, index) => (
            <Fragment key={menu.id}>
              <a href={menu.link} onClick={() => toggleSubMenu(index)}>
                <li
                  className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md ${
                    menu.spacing ? "mt-9" : "mt-2"
                  }`}
                >
                  <span className="text-2xl block float-left">{menu.icon}</span>
                  <span
                    className={`text-base font-medium flex-1 ${
                      !open && "hidden"
                    } `}
                  >
                    {menu.title}
                  </span>
                  {menu.submenu && open && (
                    <BsChevronDown
                      className={`${submenuOpenIndex && "rotate-180"}`}
                    />
                  )}
                </li>
              </a>
              {menu.submenu && submenuOpenIndex === index && open && (
                <ul>
                  {menu.submenuItems.map((submenuItem, index) => (
                    <Fragment key={submenuItem.id}>
                      {/* Use target="_blank" for external links */}

                      <a
                        href={submenuItem.link}
                        rel="noopener noreferrer"
                        target={`${submenuItem.newTab ? "_blank" : "_self"}`}
                      >
                        <li
                          className={`${
                            submenuItem.red ? "text-red-300" : "text-gray-300"
                          } select-none text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5 hover:bg-light-white rounded-md ${
                            menu.spacing ? "mt-9" : "mt-2"
                          }`}
                        >
                          {submenuItem?.icon}
                          {submenuItem.title}
                        </li>
                      </a>
                    </Fragment>
                  ))}
                </ul>
              )}
            </Fragment>
          ))}
        </ul>
        <div
          className="rounded-md fixed right-1 bottom-5 bg-blue-900 p-2 bg-opacity-30 hover:bg-opacity-100 active:scale-95"
          onClick={() => {
            ref.current.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <TbArrowsLeftDown className="text-3xl text-white rotate-90" />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
