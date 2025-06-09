/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import api from "../instance/TokenInstance";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Modal from "../components/modals/Modal";
import { BsEye } from "react-icons/bs";
import UploadModal from "../components/modals/UploadModal";
import axios from "axios";
import url from "../data/Url";
import { Select, Dropdown } from "antd";
import DataTable from "../components/layouts/Datatable";
import CustomAlert from "../components/alerts/CustomAlert";
import EndlessCircularLoader from "../components/loaders/EndlessCircularLoader";
import CircularLoader from "../components/loaders/CircularLoader";
import Navbar from "../components/layouts/Navbar";
import filterOption from "../helpers/filterOption";
import { IoMdMore } from "react-icons/io";
import { Link } from "react-router-dom";
import { fieldSize } from "../data/fieldSize";

const Receipt = () => {
  const [groups, setGroups] = useState([]);
  const [TableDaybook, setTableDaybook] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedAuctionGroup, setSelectedAuctionGroup] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedAuctionGroupId, setSelectedAuctionGroupId] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredAuction, setFilteredAuction] = useState([]);
  const [groupInfo, setGroupInfo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [currentUpdateGroup, setCurrentUpdateGroup] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [receiptNo, setReceiptNo] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilterField, setShowFilterField] = useState(false);
  const [selectedLabel,setSelectedLabel] = useState("Today");
  
  const now = new Date();
  const onGlobalSearchChangeHandler = (e) => {
    setSearchText(e.target.value);
  };
  const todayString = now.toISOString().split("T")[0];
  const [selectedFromDate, setSelectedFromDate] = useState(todayString);
  const [selectedDate, setSelectedDate] = useState(todayString);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState("");
  const [payments, setPayments] = useState([]);

  const [formData, setFormData] = useState({
    group_id: "",
    user_id: "",
    ticket: "",
    receipt_no: "",
    pay_date: "",
    amount: "",
    pay_type: "cash",
    transaction_id: "",
  });
  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });
  const handleModalClose = () => setShowUploadModal(false);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/group/get-group-admin");
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await api.get("/payment/get-latest-receipt");
        setReceiptNo(response.data);
      } catch (error) {
        console.error("Error fetching receipt data:", error);
      }
    };
    fetchReceipt();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/user/get-user");
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    if (receiptNo) {
      setFormData((prevData) => ({
        ...prevData,
        receipt_no: receiptNo.receipt_no,
      }));
    }
  }, [receiptNo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeUser = (e) => {
    const { name, value } = e.target;
    const [user_id, ticket] = value.split("-");
    setFormData((prevData) => ({
      ...prevData,
      user_id,
      ticket,
    }));
  };

  const handleGroup = async (event) => {
    const groupId = event.target.value;
    setSelectedGroupId(groupId);
    setFormData((prevFormData) => ({
      ...prevFormData,
      group_id: groupId,
    }));

    handleGroupChange(groupId);

    if (groupId) {
      try {
        const response = await api.get(`/group/get-by-id-group/${groupId}`);
        setGroupInfo(response.data || {});
      } catch (error) {
        console.error("Error fetching group data:", error);
        setGroupInfo({});
      }
    } else {
      setGroupInfo({});
    }
  };

  const groupOptions = [
    { value: "Today", label: "Today" },
    { value: "Yesterday", label: "Yesterday" },
    { value: "ThisMonth", label: "This Month" },
    { value: "LastMonth", label: "Last Month" },
    { value: "ThisYear", label: "This Year" },
    { value: "Custom", label: "Custom"},
  ];

  const handleGroupPayment = async (groupId) => {
    // const groupId = event.target.value;
    setSelectedAuctionGroupId(groupId);
  };

  const handleSelectFilter = (value) => {
    setSelectedLabel(value)
    //const { value } = e.target;
    setShowFilterField(false);

    const today = new Date();
    const formatDate = (date) => date.toLocaleDateString("en-CA");

    if (value === "Today") {
      const formatted = formatDate(today);
      setSelectedFromDate(formatted);
      selectedDate(formatted);
    } else if (value === "Yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const formatted = formatDate(yesterday);
      setSelectedFromDate(formatted);
      selectedDate(formatted);
    } else if (value === "ThisMonth") {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setSelectedFromDate(formatDate(start));
      selectedDate(formatDate(end));
    } else if (value === "LastMonth") {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      setSelectedFromDate(formatDate(start));
      selectedDate(formatDate(end));
    } else if (value === "ThisYear") {
      const start = new Date(today.getFullYear(), 0, 1);
      const end = new Date(today.getFullYear(), 11, 31);
      setSelectedFromDate(formatDate(start));
      selectedDate(formatDate(end));
    } else if (value === "Custom") {
      setShowFilterField(true);
    }
  };
  const formatPayDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options).replace(",", "");
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/payment/get-report-receipt`, {
          params: {
            from_date: selectedFromDate,
            to_date: selectedDate,
            groupId: selectedAuctionGroupId,
            userId: selectedCustomers,
            pay_type: selectedPaymentMode,
          },
        });
        if (response.data && response.data.length > 0) {
          const validPayments = response.data.filter(
            (payment) => payment.group_id !== null
          );

          setFilteredAuction(validPayments);
          console.log("payment:", validPayments);

          const totalAmount = validPayments.reduce(
            (sum, payment) => sum + Number(payment.amount || 0),
            0
          );
          setPayments(totalAmount);

          const formattedData = validPayments.map((group, index) => ({
            _id: group?._id,
            id: index + 1,
            date: group?.pay_date,
            group: group?.group_id?.group_name || group.pay_for,
            name: group?.user_id?.full_name,
            category: group?.pay_for || "Chit",
            phone_number: group?.user_id?.phone_number,
            receipt_no: group?.receipt_no,
            old_receipt_no: group?.old_receipt_no,
            ticket: group?.ticket,
            amount: group?.amount,
            mode: group?.pay_type,
            collected_by:
              group?.collected_by?.name ||
              group?.admin_type?.admin_name ||
              "Super Admin",
            action: (
              <div className="flex justify-center gap-2">
                <Dropdown
                trigger={['click']}
                  menu={{
                    items: [
                      {
                        key: "1",
                        label: (
                          <Link
                            target="_blank"
                            to={`/print/${group._id}`}
                            className="text-blue-600 "
                          >
                            Print
                          </Link>
                        ),
                      },
                    ],
                  }}
                  placement="bottomLeft"
                >
                  <IoMdMore className="text-bold" />
                </Dropdown>
              </div>
            ),
          }));

          setTableDaybook(formattedData);
        } else {
          setFilteredAuction([]);
        }
      } catch (error) {
        console.error("Error fetching payment data:", error);
        setFilteredAuction([]);
        setPayments(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [
    selectedAuctionGroupId,
    selectedDate,
    selectedPaymentMode,
    selectedCustomers,
    selectedFromDate,
  ]);

  const columns = [
    { key: "id", header: "SL. NO" },
    { key: "date", header: "Date" },
    { key: "group", header: "Group Name" },
    { key: "name", header: "Customer Name" },
    { key: "category", header: "Category" },
    { key: "phone_number", header: "Customer Phone Number" },
    { key: "receipt_no", header: "Receipt Number" },
    { key: "old_receipt_no", header: "Old Receipt" },
    { key: "ticket", header: "Ticket" },
    { key: "amount", header: "Amount" },
    { key: "mode", header: "Payment Mode" },
    { key: "collected_by", header: "Collected By" },
    { key: "action", header: "Action" },
  ];

  useEffect(() => {
    if (groupInfo && formData.bid_amount) {
      const commission = (groupInfo.group_value * 5) / 100 || 0;
      const win_amount =
        (groupInfo.group_value || 0) - (formData.bid_amount || 0);
      const divident = (formData.bid_amount || 0) - commission;
      const divident_head = groupInfo.group_members
        ? divident / groupInfo.group_members
        : 0;
      const payable = (groupInfo.group_install || 0) - divident_head;

      setFormData((prevData) => ({
        ...prevData,
        group_id: groupInfo._id,
        commission,
        win_amount,
        divident,
        divident_head,
        payable,
      }));
    }
  }, [groupInfo, formData.bid_amount]);

  const handlePaymentModeChange = (e) => {
    const selectedMode = e.target.value;
    setPaymentMode(selectedMode);
    setFormData((prevData) => ({
      ...prevData,
      pay_type: selectedMode,
      transaction_id: selectedMode === "online" ? prevData.transaction_id : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/payment/add-payment", formData);
      if (response.status === 201) {
        alert("Payment Added Successfully");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error submitting payment data:", error);
    }
  };

  const handleDeleteModalOpen = async (groupId) => {
    try {
      const response = await api.get(`/payment/get-payment-by-id/${groupId}`);
      setCurrentGroup(response.data);
      setShowModalDelete(true);
    } catch (error) {
      console.error("Error fetching enroll:", error);
    }
  };

  const handleDeleteAuction = async () => {
    if (currentGroup) {
      try {
        await api.delete(`/payment/delete-payment/${currentGroup._id}`);
        alert("Payment deleted successfully");
        setShowModalDelete(false);
        setCurrentGroup(null);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting auction:", error);
      }
    }
  };

  const handleUpdateModalOpen = async (groupId) => {
    try {
      const response = await api.get(`/auction/get-auction-by-id/${groupId}`);
      setCurrentUpdateGroup(response.data);
      setShowModalUpdate(true);
    } catch (error) {
      console.error("Error fetching auction:", error);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();

    const formDatas = new FormData();
    const fileInput = e.target.file;
    if (fileInput && fileInput.files[0]) {
      formDatas.append("file", fileInput.files[0]);

      try {
        const response = await api.post(`/payment/payment-excel`, formDatas, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 200) {
          alert("File uploaded successfully!");
          window.location.reload();
          setShowUploadModal(false);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file.");
      }
    } else {
      alert("Please select a file to upload.");
    }
  };

  return (
    <>
      <div className="w-screen">
        <div className="flex mt-30">
          <Navbar
            onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
            visibility={true}
          />
          <CustomAlert
            type={alertConfig.type}
            isVisible={alertConfig.visibility}
            message={alertConfig.message}
          />
          <div className="flex-grow p-7">
            <h1 className="text-2xl font-bold">Reports - Receipt</h1>
            <div className="mt-6 mb-8">
              <div className="mb-2">
                <div className="flex justify-start items-center w-full gap-4">
                  <div className="mb-2">
                    <label>Filter Option</label>
                    {/* <select
                      onChange={handleSelectFilter}
                      className="border border-gray-300 rounded px-6 shadow-sm outline-none w-full max-w-md"
                    >
                      <option value="Today">Today</option>
                      <option value="Yesterday">Yesterday</option>
                      <option value="ThisMonth">This Month</option>
                      <option value="LastMonth">Last Month</option>
                      <option value="ThisYear">This Year</option>
                      <option value="Custom">Custom</option>
                    </select> */}
                    <Select
                      showSearch
                      popupMatchSelectWidth={false}
                      onChange={handleSelectFilter}
                      value ={selectedLabel}
                      placeholder="Search Or Select Filter"
                      filterOption={(input, option) =>
                        option.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      className="w-full max-w-xs h-11"
                    >
                      {groupOptions.map((time) => (
                        <Select.Option key={time.value} value={time.value}>
                          {time.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  {showFilterField && (
                    <div className="flex gap-4">
                      <div className="mb-2">
                        <label>From Date</label>
                        <input
                          type="date"
                          value={selectedFromDate}
                          onChange={(e) => setSelectedFromDate(e.target.value)}
                          className="border border-gray-300 rounded px-4 py-2 shadow-sm outline-none w-full max-w-xs"
                        />
                      </div>
                      <div className="mb-2">
                        <label>To Date</label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="border border-gray-300 rounded px-4 py-2 shadow-sm outline-none w-full max-w-xs"
                        />
                      </div>
                    </div>
                  )}
                  <div className="mb-2">
                    <label>Group</label>
                    {/* <select
                      value={selectedAuctionGroupId}
                      onChange={handleGroupPayment}
                      className="border border-gray-300 rounded px-6 py-2 shadow-sm outline-none w-full max-w-md"
                    >
                      <option value="">All </option>
                      {groups.map((group) => (
                        <option key={group._id} value={group._id}>
                          {group.group_name}
                        </option>
                      ))}
                    </select> */}
                    <Select
                      showSearch
                      popupMatchSelectWidth={false}
                      value={selectedAuctionGroupId}
                      onChange={handleGroupPayment}
                      placeholder="Search Or Select Group"
                      filterOption={(input, option) =>
                        option.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      className="w-full max-w-xs h-11"
                    >
                      <Select.Option value={""}>All</Select.Option>
                      {groups.map((group) => (
                        <Select.Option key={group._id} value={group._id}>
                          {group.group_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  <div className="mb-2">
                    <label>Customer</label>
                    {/* <select
                      value={selectedCustomers}
                      onChange={(e) => setSelectedCustomers(e.target.value)}
                      className="border border-gray-300 rounded px-6 py-2 shadow-sm outline-none w-full max-w-md"
                    >
                      <option value="">All</option>
                      {filteredUsers.map((group) => (
                        <option key={group?._id} value={group?._id}>
                          {group?.full_name} - {group.phone_number}
                        </option>
                      ))}
                    </select> */}
                    <Select
                      showSearch
                      popupMatchSelectWidth={false}
                      value={selectedCustomers}
                      filterOption={(input, option) =>
                        option.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      placeholder="Search Or Select Customer"
                      onChange={(groupId) => setSelectedCustomers(groupId)}
                      className="w-full max-w-xs h-11"
                      // className="border border-gray-300 rounded px-6 py-2 shadow-sm outline-none w-full max-w-md"
                    >
                      <Select.Option value="">All</Select.Option>
                      {filteredUsers.map((group) => (
                        <Select.Option key={group?._id} value={group?._id}>
                          {group?.full_name} - {group.phone_number}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  <div className="mb-2">
                    <label>Payment Mode</label>
                    {/* <select
                      value={selectedPaymentMode}
                      onChange={(e) => setSelectedPaymentMode(e.target.value)}
                      className="border border-gray-300 rounded px-6 py-2 shadow-sm outline-none w-full max-w-md"
                    >
                      <option value="">All</option>
                      <option value="cash">Cash</option>
                      <option value="online">Online</option>
                    </select> */}
                    <Select
                      value={selectedPaymentMode}
                      showSearch
                      placeholder="Search Or Select Payment"
                      popupMatchSelectWidth={false}
                      onChange={(groupId) => setSelectedPaymentMode(groupId)}
                      filterOption={(input, option) =>
                        option.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      className="w-full max-w-xs h-11"
                      // className="border border-gray-300 rounded px-6 py-2 shadow-sm outline-none w-full max-w-md"
                    >
                      <Select.Option value="">All</Select.Option>
                      <Select.Option value="cash">Cash</Select.Option>
                      <Select.Option value="online">Online</Select.Option>
                    </Select>
                  </div>
                  <div>
                    <h1 className="text-md mt-6">
                      Total Amount:{" "}
                      <span className="text-xl">₹{payments || 0}</span>
                    </h1>
                  </div>
                </div>
              </div>
              {filteredAuction && filteredAuction.length > 0 && !isLoading ? (
                <div className="mt-10">
                  <DataTable
                    data={filterOption(TableDaybook, searchText)}
                    columns={columns}
                    exportedFileName={`ReportsReceipt-${
                      TableDaybook.length > 0
                        ? TableDaybook[0].name +
                          " to " +
                          TableDaybook[TableDaybook.length - 1].name
                        : "empty"
                    }.csv`}
                  />
                  <div className="flex justify-end mt-4 pr-4">
                    <span className="text-lg font-semibold">
                      Total Amount: ₹{payments}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-10 text-center text-gray-500">
                  <CircularLoader
                    isLoading={isLoading}
                    failure={filteredAuction.length <= 0}
                    data="Receipt Data"
                  />
                </div>
              )}
            </div>
          </div>
          <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
            <div className="py-6 px-5 lg:px-8 text-left">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Add Payment
              </h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="w-full">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="category"
                  >
                    Group
                  </label>
                  <select
                    value={selectedGroupId}
                    onChange={handleGroup}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  >
                    <option value="">Select Group</option>
                    {groups.map((group) => (
                      <option key={group._id} value={group._id}>
                        {group.group_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="category"
                  >
                    Customers
                  </label>
                  <select
                    name="user_id"
                    value={`${formData.user_id}-${formData.ticket}`}
                    onChange={handleChangeUser}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  >
                    <option value="">Select Customer</option>
                    {filteredUsers.map((user) => (
                      <option
                        key={`${user?.user_id?._id}-${user.tickets}`}
                        value={`${user?.user_id?._id}-${user.tickets}`}
                      >
                        {user?.user_id?.full_name} | {user.tickets}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-row justify-between space-x-4">
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_value"
                    >
                      Receipt No.
                    </label>
                    <input
                      type="text"
                      name="receipt_no"
                      value={formData.receipt_no}
                      id="receipt_no"
                      placeholder="Receipt No."
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_install"
                    >
                      Payment Date
                    </label>
                    <input
                      type="date"
                      name="pay_date"
                      value={formData.pay_date}
                      id="pay_date"
                      onChange={handleChange}
                      placeholder=""
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-between space-x-4">
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_value"
                    >
                      Amount
                    </label>
                    <input
                      type="text"
                      name="amount"
                      value={formData.amount}
                      id="amount"
                      onChange={handleChange}
                      placeholder="Enter Amount"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="pay_mode"
                    >
                      Payment Mode
                    </label>
                    <select
                      name="pay_mode"
                      id="pay_mode"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                      onChange={handlePaymentModeChange}
                    >
                      <option value="cash">Cash</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                </div>
                {paymentMode === "online" && (
                  <div className="w-full mt-4">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="transaction_id"
                    >
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      name="transaction_id"
                      id="transaction_id"
                      value={formData.transaction_id}
                      onChange={handleChange}
                      placeholder="Enter Transaction ID"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800
                              focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Add
                </button>
              </form>
            </div>
          </Modal>
          <Modal
            isVisible={showModalUpdate}
            onClose={() => setShowModalUpdate(false)}
          >
            <div className="py-6 px-5 lg:px-8 text-left">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                View Auction
              </h3>
              <form className="space-y-6" onSubmit={() => {}}>
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="email"
                  >
                    Group
                  </label>
                  <input
                    type="text"
                    name="group_id"
                    value={currentUpdateGroup?.group_id?.group_name}
                    onChange={() => {}}
                    id="name"
                    placeholder="Enter the Group Name"
                    readOnly
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                </div>
                <div className="flex flex-row justify-between space-x-4">
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_value"
                    >
                      Group Value
                    </label>
                    <input
                      type="text"
                      name="group_value"
                      value={currentUpdateGroup?.group_id?.group_value}
                      id="group_value"
                      placeholder="select group to check"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_install"
                    >
                      Group Installment
                    </label>
                    <input
                      type="text"
                      name="group_install"
                      value={currentUpdateGroup?.group_id?.group_install}
                      id="group_install"
                      placeholder="select group to check"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="email"
                  >
                    User
                  </label>
                  <input
                    type="text"
                    name="group_id"
                    value={`${currentUpdateGroup?.user_id?.full_name} | ${currentUpdateGroup?.ticket}`}
                    onChange={() => {}}
                    id="name"
                    placeholder="Enter the User Name"
                    readOnly
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                </div>

                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="email"
                  >
                    Bid Amount
                  </label>
                  <input
                    type="number"
                    name="bid_amount"
                    value={
                      currentUpdateGroup?.group_id?.group_value -
                      currentUpdateGroup?.win_amount
                    }
                    onChange={() => {}}
                    id="name"
                    placeholder="Enter the Bid Amount"
                    readOnly
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                  />
                </div>
                <div className="flex flex-row justify-between space-x-4">
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_value"
                    >
                      Commission
                    </label>
                    <input
                      type="text"
                      name="commission"
                      value={currentUpdateGroup?.commission}
                      id="commission"
                      placeholder=""
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_install"
                    >
                      Winning Amount
                    </label>
                    <input
                      type="text"
                      name="win_amount"
                      value={currentUpdateGroup?.win_amount}
                      id="win_amount"
                      placeholder=""
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-between space-x-4">
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_value"
                    >
                      Divident
                    </label>
                    <input
                      type="text"
                      name="divident"
                      value={currentUpdateGroup?.divident}
                      id="divident"
                      placeholder=""
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_install"
                    >
                      Divident per Head
                    </label>
                    <input
                      type="text"
                      name="divident_head"
                      value={currentUpdateGroup?.divident_head}
                      id="divident_head"
                      placeholder=""
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="group_install"
                    >
                      Next Payable
                    </label>
                    <input
                      type="text"
                      name="payable"
                      value={currentUpdateGroup?.payable}
                      id="payable"
                      placeholder=""
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-between space-x-4">
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="date"
                    >
                      Auction Date
                    </label>
                    <input
                      type="date"
                      name="auction_date"
                      value={currentUpdateGroup?.auction_date}
                      onChange={() => {}}
                      id="date"
                      placeholder="Enter the Date"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="date"
                    >
                      Next Date
                    </label>
                    <input
                      type="date"
                      name="next_date"
                      value={currentUpdateGroup?.next_date}
                      onChange={() => {}}
                      id="date"
                      placeholder="Enter the Date"
                      readOnly
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    />
                  </div>
                </div>
              </form>
            </div>
          </Modal>
          <Modal
            isVisible={showModalDelete}
            onClose={() => {
              setShowModalDelete(false);
              setCurrentGroup(null);
            }}
          >
            <div className="py-6 px-5 lg:px-8 text-left">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Sure want to delete this Payment ?
              </h3>
              {currentGroup && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleDeleteAuction();
                  }}
                  className="space-y-6"
                >
                  <button
                    type="submit"
                    className="w-full text-white bg-red-700 hover:bg-red-800
                    focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Delete
                  </button>
                </form>
              )}
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Receipt;
