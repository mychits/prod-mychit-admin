import Sidebar from "../components/layouts/Sidebar";
import { GrGroup } from "react-icons/gr";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import { MdGroups } from "react-icons/md";
import { LiaLayerGroupSolid } from "react-icons/lia";
import { FaUserLock } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { useEffect, useState } from "react";
import api from "../instance/TokenInstance";

const Home = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentsValue, setPaymentsValue] = useState("...");
  const [paymentsPerMonth, setPaymentsPerMonth] = useState([]);
  const [paymentsPerMonthValue, setPaymentsPerMonthValue] = useState("...");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/group/get-group");
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get("/agent/get-agent");
        setAgents(response.data);
      } catch (error) {
        console.error("Error fetching agent data:", error);
      }
    };
    fetchAgents();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user/get-user");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get("/payment/get-payment");
        console.log(response.data);
        const paymentData = response.data;
        const totalAmount = paymentData.reduce(
          (sum, payment) => sum + Number(payment.amount || 0),
          0
        );

        setPaymentsValue(totalAmount);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchMonthlyPayments = async () => {
      try {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstDay = `${currentYear}-${String(currentMonth + 1).padStart(
          2,
          "0"
        )}-01`;
        console.log("firstday",firstDay);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const lastDayFormatted = lastDay.toISOString().split("T")[0];

        const response = await api.get("/payment/get-report-receipt", {
          params: {
            from_date: firstDay,
            to_date: lastDayFormatted,
          },
        });

        setPaymentsPerMonth(response.data);

        const totalAmount = response.data.reduce((sum, payment) => {
          console.log("payment", payment.amount);
          return sum + Number(payment.amount || 0);
        }, 0);
        setPaymentsPerMonthValue(totalAmount);
      } catch (err) {
        console.error("Error fetching monthly payment data:", err.message);
      }
    };
    fetchMonthlyPayments();
  }, []);
  const cardData = [
    {
      icon: <LiaLayerGroupSolid size={20} />,
      text: "Groups",
      count: groups.length,
      bgColor: "bg-blue-200",
      iconColor: "bg-blue-900",
      redirect: "/group",
    },
    {
      icon: <MdGroups size={16} />,
      text: "Cutomers",
      count: users.length,
      bgColor: "bg-orange-200",
      iconColor: "bg-orange-900",
      redirect: "/user",
    },
    {
      icon: <FaUserLock size={16} />,
      text: "Agents",
      count: agents.length,
      bgColor: "bg-green-200",
      iconColor: "bg-green-900",
      redirect: "/agent",
    },
    {
      icon: <MdOutlinePayments size={16} />,
      text: "Payments",
      count: `₹${paymentsValue}`,
      bgColor: "bg-red-200",
      iconColor: "bg-red-900",
      redirect: "/payment",
    },
    {
      icon: (
        <div className="text-center">
          {" "}
          <SlCalender size={16} /> ₹{" "}
        </div>
      ),
      text: "Current Month Payments",
      count: `₹${paymentsPerMonthValue}`,
      bgColor: "bg-purple-200",
      iconColor: "bg-purple-900",
      redirect: "/payment",
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
                <a
                  href={card.redirect}
                  key={index}
                  className={`group flex items-center ${card.bgColor} p-3 rounded-md shadow-sm transform transition-transform duration-300 hover:scale-105`}
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
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
