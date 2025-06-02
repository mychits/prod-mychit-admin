/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import CircularLoader from "../components/loaders/CircularLoader";
import { Select } from "antd";
import Navbar from "../components/layouts/Navbar";
import filterOption from "../helpers/filterOption";

const AllUserReport = () => {
  const [searchText, setSearchText] = useState("");
  const [screenLoading, setScreenLoading] = useState(true);
  const [auctionTableData, setAuctionTableData] = useState([]);
  const [usersData, SetUsersData] = useState([]);

  const [totals, setTotals] = useState({
    totalCustomers: 0,
    totalGroups: 0,
    totalToBePaid: 0,
    totalProfit: 0,
    totalPaid: 0,
    totalBalance: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportResponse = await api.get("/user/all-customers-report");
        const usersList = [];
        let count = 0;

        reportResponse.data.forEach((usrData) => {
          if (usrData?.data) {
            usrData.data.forEach((data) => {
              if (data?.enrollment?.group) {
                const groupInstall = parseInt(data.enrollment.group.group_install);
                const groupType = data.enrollment.group.group_type;
                const totalPaidAmount = data.payments.totalPaidAmount;
                const auctionCount = parseInt(data?.auction?.auctionCount);
                const totalPayable = data.payable.totalPayable;
                const totalProfit = data.profit.totalProfit;
                const firstDividentHead = data.firstAuction.firstDividentHead;
                count++;

                const tempUsr = {
                  sl_no: count,
                  _id: usrData._id,
                  userName: usrData.userName,
                  userPhone: usrData.phone_number,
                  customerId: usrData.customer_id,
                  amountPaid: totalPaidAmount,
                  paymentsTicket: data.payments.ticket,
                  groupValue: data?.enrollment?.group?.group_value,
                  groupName: data.enrollment.group.group_name,
                  profit: totalProfit,
                  // agent: data?.enrollment?.agent,
                  // reffered_customer: data?.enrollment?.reffered_customer,
                  // reffered_lead: data?.enrollment?.reffered_lead,
                  reffered_by: data?.enrollment?.agent
                    ? data.enrollment.agent
                    : data?.enrollment?.reffered_customer
                    ? data.enrollment.reffered_customer
                    : data?.enrollment?.reffered_lead
                    ? data.enrollment.reffered_lead
                    : "N/A",
                  payment_type: data?.enrollment?.payment_type,
                  referred_type: data?.enrollment?.referred_type,
                    enrollmentDate: data?.enrollment?.createdAt
                    ? data.enrollment.createdAt.split("T")[0]
                    : "",
                  totalToBePaid:
                    groupType === "double"
                      ? groupInstall * auctionCount + groupInstall
                      : totalPayable + groupInstall + totalProfit,
                  toBePaidAmount:
                    groupType === "double"
                      ? groupInstall * auctionCount + groupInstall
                      : totalPayable + groupInstall + firstDividentHead,
                  balance:
                    groupType === "double"
                      ? groupInstall * auctionCount + groupInstall - totalPaidAmount
                      : totalPayable + groupInstall + firstDividentHead - totalPaidAmount,
                };

                usersList.push(tempUsr);
              }
            });
          }
        });

        SetUsersData(usersList);
        setScreenLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setScreenLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const totalCustomers = usersData.length;
    const groupSet = new Set(usersData.map(user => user.groupName));
    const totalGroups = groupSet.size;

    const totalToBePaid = usersData.reduce((sum, u) => sum + (u.totalToBePaid || 0), 0);
    const totalProfit = usersData.reduce((sum, u) => sum + (u.profit || 0), 0);
    const totalPaid = usersData.reduce((sum, u) => sum + (u.amountPaid || 0), 0);
    const totalBalance = usersData.reduce((sum, u) => sum + (u.balance || 0), 0);

    setTotals({
      totalCustomers,
      totalGroups,
      totalToBePaid,
      totalProfit,
      totalPaid,
      totalBalance
    });
  }, [usersData]);

  const Auctioncolumns = [
    { key: "sl_no", header: "SL. NO" },
    { key: "userName", header: "Customer Name" },
    { key: "userPhone", header: "Phone Number" },
    { key: "customerId", header: "Customer Id" },
    { key: "groupName", header: "Group Name" },
    { key: "groupValue", header: "Group Value" },
    { key: "enrollmentDate", header: "Enrollment Date" },
    { key: "referred_type", header: "Referred Type" },
    // { key: "agent", header: "Referred Agent" },
    // { key: "reffered_customer", header: "Referred Customer" },
    // { key: "reffered_lead", header: "Referred Lead" },
    { key: "reffered_by", header: "Referred By" },
    { key: "payment_type", header: "Payment Type" },
    { key: "paymentsTicket", header: "Ticket" },
    { key: "totalToBePaid", header: "Amount to be Paid" },
    { key: "profit", header: "Profit" },
    { key: "amountPaid", header: "Amount Paid" },
    { key: "balance", header: "Balance" },
  ];

  return (
    <div className="w-screen">
      <div className="flex mt-30">
        <Navbar
          onGlobalSearchChangeHandler={(e) => setSearchText(e.target.value)}
          visibility={true}
        />
        {screenLoading ? (
          <div className="w-full">
            <CircularLoader color="text-green-600" />
          </div>
        ) : (
          <div className="flex-grow p-7">
            <h1 className="text-2xl font-semibold text-center">
              All Customer Report
            </h1>

            <div className="mt-6 mb-8">
              <div className="mt-6 mb-8">
                <div className="flex justify-start border-b border-gray-300 mb-4"></div>
                <div className="mt-10">
                  <DataTable
                    data={filterOption(usersData, searchText)}
                    columns={Auctioncolumns}
                    exportedFileName={`CustomerReport.csv`}
                  />
                </div>

                {/* Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  <div className="flex flex-col border p-4 rounded shadow">
                    <span className="text-xl font-bold text-gray-700">Total Customers</span>
                    <span className="text-lg font-bold  text-blue-600">{totals.totalCustomers}</span>
                  </div>
                  <div className="flex flex-col border p-4 rounded shadow">
                    <span className="text-xl font-bold text-gray-700">Total Groups</span>
                    <span className="text-lg font-bold  text-green-600">{totals.totalGroups}</span>
                  </div>
                  <div className="flex flex-col border p-4 rounded shadow">
                    <span className="text-xl font-bold text-gray-700">Amount to be Paid</span>
                    <span className="text-lg font-bold text-blue-600">₹{totals.totalToBePaid}</span>
                  </div>
                  <div className="flex flex-col border p-4 rounded shadow">
                    <span className="text-xl font-bold text-gray-700">Total Profit</span>
                    <span className="text-lg font-bold text-green-600">₹{totals.totalProfit}</span>
                  </div>
                  <div className="flex flex-col border p-4 rounded shadow">
                    <span className="text-xl font-semibold text-gray-700">Total Amount Paid</span>
                    <span className="text-lg font-bold text-indigo-600">₹{totals.totalPaid}</span>
                  </div>
                  <div className="flex flex-col border p-4 rounded shadow">
                    <span className="text-xl font-bold text-gray-700">Total Balance</span>
                    <span className="text-lg font-bold text-red-600">₹{totals.totalBalance}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUserReport;
