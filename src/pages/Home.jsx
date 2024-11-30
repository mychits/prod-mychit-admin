import Sidebar from "../components/layouts/Sidebar";
import { GrGroup } from "react-icons/gr";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import { BiUser } from "react-icons/bi";

const Home = () => {
  // Sample card data
  const cardData = [
    {
      icon: <GrGroup size={16} />,
      text: "Groups",
      count: 120,
      bgColor: "bg-blue-200",
      iconColor: "bg-blue-900",
    },
    {
      icon: <BiUser size={16} />,
      text: "Users",
      count: 350,
      bgColor: "bg-orange-200",
      iconColor: "bg-orange-900",
    },
    {
      icon: <BsArrowUp size={16} />,
      text: "Profit",
      count: 0,
      bgColor: "bg-green-200",
      iconColor: "bg-green-900",
    },
    {
      icon: <BsArrowDown size={16} />,
      text: "Loss",
      count: 0,
      bgColor: "bg-red-200",
      iconColor: "bg-red-900",
    },
  ];

  return (
    <>
      <div>
        <div className="flex mt-20">
          <Sidebar />
          <div className="flex-grow p-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 w-full">
              {cardData.map((card, index) => (
                <div
                  key={index}
                  className={`flex items-center ${card.bgColor} p-3 rounded-md shadow-sm`}
                >
                  <div
                    className={`flex items-center justify-center w-14 h-14 ${card.iconColor} text-white rounded-full mr-3`}
                  >
                    {card.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-medium text-black">
                      {card.text}
                    </p>
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-black">
                      {card.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
