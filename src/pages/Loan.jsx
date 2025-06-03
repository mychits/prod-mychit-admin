/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import Modal from "../components/modals/Modal";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import CustomAlertDialog from "../components/alerts/CustomAlertDialog";
import { Input,Select,Dropdown } from "antd";
import { IoMdMore } from "react-icons/io";
import Navbar from "../components/layouts/Navbar";
import filterOption from "../helpers/filterOption";
import { FaCalculator } from "react-icons/fa";
import CircularLoader from "../components/loaders/CircularLoader";
import { fieldSize } from "../data/fieldSize";
const Loan = () => {
  const [users, setUsers] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [tableBorrowers, setTableBorrowers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [currentBorrower, setCurrentBorrower] = useState(null);
 const [reloadTrigger, setReloadTrigger] = useState(0);
  const [currentUpdateBorrower, setCurrentUpdateBorrower] = useState(null);
  const [searchText, setSearchText] = useState("");
const [isLoading,setIsLoading] = useState(false);
  const onGlobalSearchChangeHandler = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };

  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });

  const [formData, setFormData] = useState({
    borrower: "",
    loan_amount: "",
    tenure: "",
    service_charges: "",
    daily_payment_amount: "",
    start_date: "",
    end_date: "",
    note: "",
  });
  const [errors, setErrors] = useState({});

  const [updateFormData, setUpdateFormData] = useState({
    borrower: "",
    loan_amount: "",
    tenure: "",
    service_charges: "",
    daily_payment_amount: "",
    start_date: "",
    end_date: "",
    note: "",
  });


    useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get("/user/get-user");
        
        if (response.status >= 400)
          throw new Error("Failed to fetch borrowers");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching Loans Borrower Data:", error);
      }
    };
    fetchCustomers();
  }, [reloadTrigger]);
  useEffect(() => {
    const fetchBorrowers = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/loans/get-all-borrowers");
        setBorrowers(response.data);
        const formattedData = response.data.map((borrower, index) => ({
          _id: borrower._id,
          id: index + 1,
          loan_id: borrower?.loan_id,
          borrower_name: borrower?.borrower?.full_name,
          date: borrower?.createdAt,
          loan_amount: borrower?.loan_amount,
          tenure: borrower?.tenure,
          service_charges: borrower?.service_charges,
          daily_payment_amount: borrower?.daily_payment_amount,
          start_date: borrower?.start_date?.split("T")[0],
          end_date: borrower?.end_date?.split("T")[0],
          note: borrower?.note,
          action: (
            <div className="flex justify-center gap-2" key={borrower._id}>
              <Dropdown
              trigger={['click']}
                menu={{
                  items: [
                    {
                      key: "1",
                      label: (
                        <div
                          className="text-green-600"
                          onClick={() => handleUpdateModalOpen(borrower._id)}
                        >
                          Edit
                        </div>
                      ),
                    },
                    {
                      key: "2",
                      label: (
                        <div
                          className="text-red-600"
                          onClick={() => handleDeleteModalOpen(borrower._id)}
                        >
                          Delete
                        </div>
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
        setTableBorrowers(formattedData);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }finally{
        setIsLoading(false);
      }
    };
    fetchBorrowers();
  }, [reloadTrigger]);

    const handleAntDSelect = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
  };

  const handleAntInputDSelect = (field, value) => {
    setUpdateFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (type) => {
    const newErrors = {};

    const data = type === "addBorrower" ? formData : updateFormData;

    if (!data.borrower) {
      newErrors.borrower = "Borrower Name is required";
    }

    if (!data.loan_amount || isNaN(data.loan_amount) || data.loan_amount <= 0) {
      newErrors.loan_amount = "Loan Amount must be a positive number";
    }
    if (!data.tenure || isNaN(data.tenure) || data.tenure <= 0) {
      newErrors.tenure = "Tenure must be a positive number";
    }
    if (!data.service_charges) {
      newErrors.service_charges = "service charges is required";
    }
    if (!data.daily_payment_amount) {
      newErrors.daily_payment_amount = "Daily payment amount is required";
    }

    if (!data.start_date) {
      newErrors.start_date = "Start Date is required";
    }
    if (!data.end_date) {
      newErrors.end_date = "End Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm("addBorrower");
    try {
   
      if (isValid) {
        const response = await api.post("/loans/add-borrower", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      
        setReloadTrigger((prev) => prev + 1);
        setAlertConfig({
          visibility: true,
          message: "Borrower Added Successfully",
          type: "success",
        });

        setShowModal(false);
        setFormData({
          borrower: "",
          loan_amount: "",
          tenure: "",
          service_charges: "",
          daily_payment_amount: "",
          start_date: "",
          end_date: "",
          note: "",
        });
      } 
    } catch (error) {
      console.error("Error adding Borrower:", error);
    }
  };



  const handleDeleteModalOpen = async (borrowerId) => {
    try {
      const response = await api.get(`loans/get-borrower/${borrowerId}`);
      setCurrentBorrower(response.data);
      setShowModalDelete(true);
    } catch (error) {
      console.error("Error fetching Borrowers:", error);
    }
  };

  const handleUpdateModalOpen = async (borrowerId) => {
    try {
      const response = await api.get(`/loans/get-borrower/${borrowerId}`);
      const borrowerData = response.data;
      const formattedStartDate = borrowerData?.start_date?.split("T")[0];
      const formattedEndDate = borrowerData?.end_date?.split("T")[0];
      setCurrentUpdateBorrower(response.data);
      setUpdateFormData({
        borrower: response?.data?.borrower._id,
        loan_amount: response?.data?.loan_amount,
        tenure: response?.data?.tenure,
        service_charges: response?.data?.service_charges,
        daily_payment_amount: response?.data?.daily_payment_amount,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        note: response?.data?.note,
      });
      setShowModalUpdate(true);
      setErrors({});
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDeleteBorrower = async () => {
    if (currentBorrower) {
      try {
        await api.delete(`/loans/delete-borrower/${currentBorrower._id}`);
        setAlertConfig({
          message: "Borrower deleted successfully",
          type: "success",
          visibility: true,
        });
        setReloadTrigger((prev) => prev + 1);
        setShowModalDelete(false);
        setCurrentBorrower(null);
      } catch (error) {
        console.error("Error deleting Loan Borrower:", error);
      }
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    try {
      if (isValid) {
        await api.patch(
          `/loans/update-borrower/${currentUpdateBorrower._id}`,
          updateFormData
        );
        setShowModalUpdate(false);
        setReloadTrigger((prev) => prev + 1);
        setAlertConfig({
          message: "Borrower updated successfully",
          type: "success",
          visibility: true,
        });
      }
    } catch (error) {
      console.error("Error updating Borrower:", error);
    }
  };

  const columns = [
    { key: "id", header: "SL. NO" },
    { key: "borrower_name", header: "Borrower Name" },
    { key: "loan_id", header: "Loan Id" },
    { key: "loan_amount", header: "Loan Amount" },
    { key: "tenure", header: "Tenure" },
    { key: "service_charges", header: "Service Charges" },
    { key: "start_date", header: "Start Date" },
    { key: "end_date", header: "Due Date" },
    { key: "note", header: "Note" },
    { key: "action", header: "Action" },
  ];

  return (
    <>
      <div>
        <Navbar
          visibility={true}
          onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
        />
       <CustomAlertDialog
          type={alertConfig.type}
          isVisible={alertConfig.visibility}
          message={alertConfig.message}
          onClose={() =>
            setAlertConfig((prev) => ({ ...prev, visibility: false }))
          }
        />
        <div className="flex mt-20">
          <Sidebar />

          <div className="flex-grow p-7">
            <div className="mt-6 mb-8">
              <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-semibold">Loans</h1>
                <button
                  onClick={() => {
                    setShowModal(true);
                    setErrors({});
                  }}
                  className="ml-4 bg-blue-950 text-white px-4 py-2 rounded shadow-md hover:bg-blue-800 transition duration-200"
                >
                  + Add Loan
                </button>
              </div>
            </div>

           {(tableBorrowers.length>0 && !isLoading) ?(<DataTable
              catcher="_id"
              updateHandler={handleUpdateModalOpen}
              data={filterOption(tableBorrowers, searchText)}
              columns={columns}
              exportedFileName={`Groups-${
                tableBorrowers.length > 0
                  ? tableBorrowers[0].date +
                    " to " +
                    tableBorrowers[tableBorrowers.length - 1].date
                  : "empty"
              }.csv`}
            />):<CircularLoader isLoading={isLoading} data="Loan Data" failure={tableBorrowers?.length<=0}/>}
          </div>
        </div>
        <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">Add Loan</h3>
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="borrower_name"
                >
                  Borrower Name  <span className="text-red-500 ">*</span>
                </label>
                {/* <select
                  name="borrower"
                  id="borrower"
                  value={formData.borrower}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                  <option value="" selected hidden>
                    Select Borrower Name
                  </option>
                  {users.map((user) => (
                    <option value={user._id}>{user.full_name}</option>
                  ))}
                </select> */}
                 <Select
                      className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                      placeholder="Select Or Search  Borrower Name "
                      popupMatchSelectWidth={false}
                      showSearch
                      name="borrower"
                      filterOption={(input, option) =>
                        option.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      value={formData?.borrower || undefined}
                      onChange={(value) =>
                        handleAntDSelect("borrower", value)
                      }
                    >
                      {users.map((user) => (
                        <Select.Option key={user._id} value={user._id}>
                          {user.full_name}
                        </Select.Option>
                      ))}
                    </Select>
                {errors.borrower && (
                  <p className="text-red-500 text-sm mt-1">{errors.borrower}</p>
                )}
              </div>

              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="loan_amount"
                  >
                    Loan Amount  <span className="text-red-500 ">*</span> 
                  </label>
                  <Input
                    type="number"
                    name="loan_amount"
                    value={formData.loan_amount}
                    onChange={handleChange}
                    id="loan_amount"
                    placeholder="Enter Loan Amount"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.loan_amount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.loan_amount}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="tenure"
                  >
                    Tenure in Days <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    type="number"
                    name="tenure"
                    value={formData.tenure}
                    onChange={handleChange}
                    id="tenure"
                    placeholder="Enter Tenure in Days"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.tenure && (
                    <p className="text-red-500 text-sm mt-1">{errors.tenure}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="service_charges"
                  >
                    Service Charges <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    type="number"
                    name="service_charges"
                    value={formData.service_charges}
                    onChange={handleChange}
                    id="service_charges"
                    placeholder="Enter Service Charges"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.service_charges && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.service_charges}
                    </p>
                  )}
                </div>

                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="daily_payment_amount"
                  >
                    Daily Payment Amount  <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="Daily Payment Amount"
                    name="daily_payment_amount"
                    value={formData.daily_payment_amount}
                    onChange={handleChange}
                    id="daily_payment_amount"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.daily_payment_amount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.daily_payment_amount}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="start_date"
                  >
                    Start Date  <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    id="start_date"
                    placeholder="Enter the Date"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.start_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.start_date}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="end_date"
                  >
                    End Date <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    id="end_date"
                    placeholder="Enter End Date"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.end_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.end_date}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="note"
                >
                  Note
                </label>
                <div className="flex w-full gap-2">
                  <Input
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    id="note"
                    placeholder="Specify Note if any!"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  <div
                    className="bg-blue-700 hover:bg-blue-800 w-10 h-10 flex justify-center items-center rounded-md"
                    onClick={() => {
                      window.open("Calculator:///");
                    }}
                  >
                    <FaCalculator color="white" />
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  className="w-1/4 text-white bg-blue-700 hover:bg-blue-800
              focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border-2 border-black"
                >
                  Save Loan
                </button>
              </div>
            </form>
          </div>
        </Modal>
        <Modal
          isVisible={showModalUpdate}
          onClose={() => setShowModalUpdate(false)}
        >
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Update Loan
            </h3>
            <form className="space-y-6" onSubmit={handleUpdate} noValidate>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="borrower_name"
                >
                Borrower Name <span className="text-red-500 ">*</span>
                </label>
                {/* <select
                  name="borrower"
                  id="borrower"
                  value={updateFormData.borrower}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                  <option value="" selected hidden>
                    Select Borrower Name
                  </option>
                  {users.map((user) => (
                    <option value={user._id}>{user.full_name}</option>
                  ))}
                </select> */}
                 <Select
                      className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                      placeholder="Select Or Search Borrower Name"
                      popupMatchSelectWidth={false}
                      showSearch
                      name="borrower"
                      filterOption={(input, option) =>
                        option.children
                          .toString()
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      value={updateFormData?.borrower || undefined}
                      onChange={(value) =>
                        handleAntInputDSelect("borrower", value)
                      }
                    >
                      {users.map((user) => (
                        <Select.Option key={user._id} value={user._id}>
                          {user.full_name}
                        </Select.Option>
                      ))}
                    </Select>
                {errors.borrower && (
                  <p className="text-red-500 text-sm mt-1">{errors.borrower}</p>
                )}
              </div>

              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="loan_amount"
                  >
                    Loan Amount <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    type="number"
                    name="loan_amount"
                    value={updateFormData.loan_amount}
                    onChange={handleInputChange}
                    id="loan_amount"
                    placeholder="Enter Loan Amount"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.loan_amount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.loan_amount}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="tenure"
                  >
                    Tenure in Days <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    type="number"
                    name="tenure"
                    value={updateFormData.tenure}
                    onChange={handleInputChange}
                    id="tenure"
                    placeholder="Enter Tenure in Days"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.tenure && (
                    <p className="text-red-500 text-sm mt-1">{errors.tenure}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="service_charges"
                  >
                    Service Charges <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    type="number"
                    name="service_charges"
                    value={updateFormData.service_charges}
                    onChange={handleInputChange}
                    id="service_charges"
                    placeholder="Enter Service Charges"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.service_charges && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.service_charges}
                    </p>
                  )}
                </div>

                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="daily_payment_amount"
                  >
                    Daily Payment Amount <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="Daily Payment Amount"
                    name="daily_payment_amount"
                    value={updateFormData.daily_payment_amount}
                    onChange={handleInputChange}
                    id="daily_payment_amount"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.daily_payment_amount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.daily_payment_amount}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="start_date"
                  >
                    Start Date <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    type="date"
                    name="start_date"
                    value={updateFormData.start_date}
                    onChange={handleInputChange}
                    id="start_date"
                    placeholder="Enter the Date"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.start_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.start_date}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="end_date"
                  >
                    End Date <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    type="date"
                    name="end_date"
                    value={updateFormData.end_date}
                    onChange={handleInputChange}
                    id="end_date"
                    placeholder="Enter End Date"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  {errors.end_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.end_date}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="note"
                >
                  Note
                </label>
                <div className="flex w-full gap-2">
                  <Input
                    type="text"
                    name="note"
                    value={updateFormData.note}
                    onChange={handleInputChange}
                    id="note"
                    placeholder="Specify Note if any!"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                  <div
                    className="bg-blue-700 hover:bg-blue-800 w-10 h-10 flex justify-center items-center rounded-md"
                    onClick={() => {
                      window.open("Calculator:///");
                    }}
                  >
                    <FaCalculator color="white" />
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  className="w-1/4 text-white bg-blue-700 hover:bg-blue-800
              focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border-2 border-black"
                >
                  Update Loan
                </button>
              </div>
            </form>
          </div>
        </Modal>
        <Modal
          isVisible={showModalDelete}
          onClose={() => {
            setShowModalDelete(false);
            setCurrentBorrower(null);
          }}
        >
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Delete Borrower
            </h3>
            {currentBorrower && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeleteBorrower();
                }}
                className="space-y-6"
              >
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="groupName"
                  >
                    Please enter{" "}
                    <span className="text-primary font-bold">
                      {currentBorrower?.borrower?.full_name}
                    </span>{" "}
                    to confirm deletion. <span className="text-red-500 ">*</span>
                  </label>
                  <Input
                    type="text"
                    id="borrowerName"
                    placeholder="Enter the Borrower Name"
                    required
                    className={`bg-gray-50 border border-gray-300 ${fieldSize.height} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5`}
                  />
                </div>
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
    </>
  );
};

export default Loan;
