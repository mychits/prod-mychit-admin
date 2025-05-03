/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import Modal from "../components/modals/Modal";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import CustomAlert from "../components/alerts/CustomAlert";
import { Dropdown } from "antd";
import { IoMdMore } from "react-icons/io";
import Navbar from "../components/layouts/Navbar";
import filterOption from "../helpers/filterOption";
import CircularLoader from "../components/loaders/CircularLoader";
import handleEnrollmentRequestPrint from "../components/printFormats/enrollmentRequestPrint";
const EnrollmentRequest = () => {
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [TableEnrollmentRequests, setTableEnrollmentRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [currentEnrollmentRequest, setCurrentEnrollmentRequest] =
    useState(null);
  const [currentUpdateEnrollmentRequest, setCurrentUpdateEnrollmentRequest] =
    useState(null);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState({});
  const [loading, setLoading] = useState(false);
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
    customer_title: "",
    customer_first_name: "",
    customer_last_name: "",
    customer_id: "",
    customer_gender: "",
    customer_marital_status: "",
    customer_dateofbirth: "",
    customer_nationality: "",
    customer_village: "",
    customer_taluk: "",
    customer_father_name: "",
    customer_district: "",
    customer_state: "",
    customer_mobile_no: "",
    customer_alternate_number: "",
    customer_referral_name: "",
    customer_address: "",
    customer_mail_id: "",
    customer_pincode: "",
    customer_add_nominee: "",
    customer_nominee_name: "",
    customer_nominee_dateofbirth: "",
    customer_nominee_phone_number: "",
    customer_nominee_relationship: "",
    customer_aadhar_no: "",
    customer_pan_no: "",
    customer_aadhar_frontphoto: "null",
    customer_aadhar_backphoto: "null",
    customer_pan_frontphoto: "null",
    customer_pan_backphoto: "null",
    customer_profilephoto: "null",
    customer_bank_name: "",
    customer_bank_branch_name: "",
    customer_bank_account_number: "",
    customer_bank_IFSC_code: "",
    selectedPlan: "",
  });
  const handleGroup = async (e) => {
    try {
      const { value } = e.target;
      const response = await api.get(`/group/get-by-id-group/${value}`);
      setSelectedGroup(response.data);
    } catch (err) {
      console.error("failed to fetch group");
    }
  };

  const [updateFormData, setUpdateFormData] = useState({
    customer_title: "",
    customer_first_name: "",
    customer_last_name: "",
    customer_id: "",
    customer_gender: "",
    customer_marital_status: "",
    customer_dateofbirth: "",
    customer_nationality: "",
    customer_village: "",
    customer_taluk: "",
    customer_father_name: "",
    customer_district: "",
    customer_state: "",
    customer_mobile_no: "",
    customer_alternate_number: "",
    customer_referral_name: "",
    customer_address: "",
    customer_mail_id: "",
    customer_pincode: "",
    customer_add_nominee: "",
    customer_nominee_name: "",
    customer_nominee_dateofbirth: "",
    customer_nominee_phone_number: "",
    customer_nominee_relationship: "",
    customer_aadhar_no: "",
    customer_pan_no: "",
    customer_aadhar_frontphoto: "null",
    customer_aadhar_backphoto: "null",
    customer_pan_frontphoto: "null",
    customer_pan_backphoto: "null",
    customer_profilephoto: "null",
    customer_bank_name: "",
    customer_bank_branch_name: "",
    customer_bank_account_number: "",
    customer_bank_IFSC_code: "",
    selectedPlan: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // apply validation here
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGroupChange = (e) => {};

  useEffect(() => {
    const fetchEnrollmentRequests = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(
          "/enrollment-request/get-enrollment-request-data"
        );
        console.info(response.data, "response data");
        setEnrollmentRequests(response.data);
        const formattedData = response.data.map((data, index) => ({
          sl_no: index + 1,
          customer_title: data?.customer_title,
          customer_id: data?.customer_id,
          customer_first_name: data?.customer_first_name,
          customer_last_name: data?.customer_last_name,
          customer_father_name: data?.customer_father_name,
          customer_gender: data?.customer_gender,
          customer_marital_status: data?.customer_marital_status,
          customer_dateofbirth: data?.customer_dateofbirth?.split("T")[0],
          customer_nationality: data?.customer_nationality,
          customer_village: data?.customer_village,
          customer_taluk: data?.customer_taluk,
          customer_district: data?.customer_district,
          customer_state: data?.customer_state,
          customer_phone_number: data?.customer_phone_number,
          customer_alternate_number: data?.customer_alternate_number,
          customer_referral_name: data?.customer_referral_name,
          customer_address: data?.customer_address,
          customer_mail_id: data?.customer_mail_id,
          customer_pincode: data?.customer_pincode,
          customer_nominee_name: data?.customer_nominee_name,
          customer_nominee_dateofbirth:
            data?.customer_nominee_dateofbirth?.split("T")[0],
          customer_nominee_relationship: data?.customer_nominee_relationship,
          customer_nominee_phone_number: data?.customer_nominee_phone_number,
          customer_aadhar_no: data?.customer_aadhar_no,
          customer_pan_no: data?.customer_pan_no,
          customer_bank_name: data?.customer_bank_name,
          customer_bank_branch_name: data?.customer_bank_branch_name,
          customer_bank_account_number: data?.customer_bank_account_number,
          customer_bank_IFSC_code: data?.customer_bank_IFSC_code,
          customer_aadhar_frontphoto: data?.customer_aadhar_frontphoto, // file uploads
          customer_aadhar_backphoto: data?.customer_aadhar_backphoto,
          customer_pan_frontphoto: data?.customer_pan_frontphoto,
          customer_pan_backphoto: data?.customer_pan_backphoto,
          customer_profilephoto: data?.customer_profilephoto,
          selectedPlan: data?.selectedPlan,
          action: (
            <div className="flex justify-center gap-2">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "1",
                      label: (
                        <div
                          className="text-green-600"
                          onClick={() => {
                            handleUpdateModalOpen(data?._id);
                          }}
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
                          onClick={() => handleDeleteModalOpen(data?._id)}
                        >
                          Delete
                        </div>
                      ),
                    },
                    {
                      key: "3", //kiran chages
                      label: (
                        <div
                          onClick={() =>
                            handleEnrollmentRequestPrint(data?._id)
                          }
                          className=" text-blue-600 "
                        >
                          Print
                        </div>
                      ),
                    },
                    {
                      key: "4", //kiran chages
                      label: (
                        <div
                          onClick={() => handleConvertToCustomer(data?._id)}
                          className=" text-blue-600 "
                        >
                          Convert
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
        setTableEnrollmentRequests(formattedData);
      } catch (error) {
        console.error("Error fetching group data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnrollmentRequests();
  }, []);

  // const filteredGroups = groups.filter((group) =>
  //   group.group_name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const res = await api.get("group/get-group");
        setGroups(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchGroupData();
  }, []);

  const handleConvertToCustomer = async (id) => {
    console.info(id, "this is id");
    let enrollData = {};
    try {
      async function getEnrollmentData() {
        try {
          const enrollmentRequestData = await api.get(
            `/enrollment-request/get-enrollment-request-data-by-id/${id}`
          );

          enrollData.full_name = `${ enrollmentRequestData?.data?.customer_first_name} ${ enrollmentRequestData?.data?.customer_last_name}`;
          enrollData.email = enrollmentRequestData?.data?.customer_mail_id;
          enrollData.phone_number =
          enrollmentRequestData?.data?.customer_phone_number;
          enrollData.password = "123456";
          enrollData.address = enrollmentRequestData?.data?.customer_address;
          enrollData.pincode = enrollmentRequestData?.data?.customer_pincode;
          enrollData.adhaar_no = enrollmentRequestData?.data?.customer_aadhar_no;
          enrollData.pan_no = enrollmentRequestData?.data?.customer_pan_no;
          enrollData.user_id = enrollData.user_id
          enrollData.group_id = enrollmentRequestData?.data?.selectedPlan?._id;
          enrollData.referred_type = "Self Joining"
          console.info(enrollData, " group id added data");
        } catch (err) {
          console.log("error");
        }
      }
      async function addCustomer() {
        console.info(enrollData, "this is enrollData");
        try {
          const response = await api.post("/user/add-user", enrollData);
          enrollData.user_id =response?.data?.user?._id
          console.info(enrollData,"done and dusted")
        
        console.info(enrollData.user_id, "customer created ")
        } catch (err) {
          console.info(err, err.message,);
        }
      }
   
      async function addEnrollment() {
        console.info(enrollData, "this is enrollData");
        try {
        const response =  await api.post("/enroll/add-enroll", enrollData);
        console.info(response?.data,"done and dusted")
        //enrollData.user_id = enrollData.user_id
        } catch (err) {
          console.info(err, err.message);
        }
      }

      Promise.all([
        await getEnrollmentData(),
        await addCustomer(),
        await addEnrollment(),
      ])
        .then(() => {
          console.info(enrollData,"enrollment")
        })
        .catch((err) => {
          console.log("something went wrong!!!");
        });
    } catch (err) {
      console.error("Something went wrong while converting enrollment");
    }
  };



  const handleDeleteModalOpen = async (enrollmentId) => {
    try {
      const response = await api.get(
        `/enrollment-request/get-enrollment-request-data-by-id/${enrollmentId}`
      );
      setCurrentEnrollmentRequest(response.data);
      setShowModalDelete(true);
    } catch (error) {
      console.error("Error fetching :", error);
    }
  };

  const handleUpdateModalOpen = async (enrollmentRequestId) => {
    try {
      const response = await api.get(
        `/enrollment-request/get-enrollment-request-data-by-id/${enrollmentRequestId}`
      );
      const data = response.data;
      setCurrentUpdateEnrollmentRequest(response.data);
      setSelectedGroup(response?.data?.selectedPlan);
      setUpdateFormData({
        selectedPlan: data?.selectedPlan,
        customer_title: data?.customer_title,
        customer_id: data?.customer_id,
        customer_first_name: data?.customer_first_name,
        customer_last_name: data?.customer_last_name,
        customer_father_name: data?.customer_father_name,
        customer_gender: data?.customer_gender,
        customer_marital_status: data?.customer_marital_status,
        customer_dateofbirth: data?.customer_dateofbirth?.split("T")[0],
        customer_nationality: data?.customer_nationality,
        customer_village: data?.customer_village,
        customer_taluk: data?.customer_taluk,
        customer_district: data?.customer_district,
        customer_state: data?.customer_state,
        customer_phone_number: data?.customer_phone_number,
        customer_alternate_number: data?.customer_alternate_number,
        customer_referral_name: data?.customer_referral_name,
        customer_address: data?.customer_address,
        customer_mail_id: data?.customer_mail_id,
        customer_pincode: data?.customer_pincode,
        customer_nominee_name: data?.customer_nominee_name,
        customer_nominee_dateofbirth: data?.customer_nominee_dateofbirth?.split("T")[0],
        customer_nominee_relationship: data?.customer_nominee_relationship,
        customer_nominee_phone_number: data?.customer_nominee_phone_number,
        customer_aadhar_no: data?.customer_aadhar_no,
        customer_pan_no: data?.customer_pan_no,
        customer_bank_name: data?.customer_bank_name,
        customer_bank_branch_name: data?.customer_bank_branch_name,
        customer_bank_account_number: data?.customer_bank_account_number,
        customer_bank_IFSC_code: data?.customer_bank_IFSC_code,
        customer_aadhar_frontphoto: data?.customer_aadhar_frontphoto, // file uploads
        customer_aadhar_backphoto: data?.customer_aadhar_backphoto,
        customer_pan_frontphoto: data?.customer_pan_frontphoto,
        customer_pan_backphoto: data?.customer_pan_backphoto,
        customer_profilephoto: data?.customer_profilephoto,
      });
      setShowModalUpdate(true);
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeleteEnrollmentRequest = async () => {
    if (currentEnrollmentRequest) {
      try {
        await api.delete(
          `/enrollment-request/delete-enrollment-request-data-by-id/${currentEnrollmentRequest._id}`
        );
        setAlertConfig({
          message: "Customer deleted successfully",
          type: "success",
          visibility: true,
        });
        setShowModalDelete(false);
        setCurrentEnrollmentRequest(null);
      } catch (error) {
        console.error("Error deleting User:", error);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `/enrollment-request/update-enrollment-request-by-id/${currentUpdateEnrollmentRequest._id}`,
        { ...updateFormData, selectedPlan: selectedGroup?._id }
      );
      setShowModalUpdate(false);
      // alert("Enrollment Updated Successfully");
      setAlertConfig({
        message: "User updated successfully",
        type: "success",
        visibility: true,
      });

      //
    } catch (error) {
      console.error("Error updating User:", error);
    }
  };

  const columns = [
    { key: "sl_no", header: "SL. NO" },

    { key: "customer_title", header: "Title" },
    { key: "customer_first_name", header: "First Name" },
    { key: "customer_last_name", header: "Last Name" },
    { key: "customer_father_name", header: "Father's Name" },
    { key: "customer_gender", header: "Gender" },
    { key: "customer_marital_status", header: "Marital Status" },
    { key: "customer_dateofbirth", header: "Date of Birth" },
    //{ key: "customer_nationality", header: "Nationality" },
    { key: "customer_village", header: "Village" },
    { key: "action", header: "Actions" },
  ];
  return (
    <>
      <div>
        <Navbar
          visibility={true}
          onGlobalSearchChangeHandler={onGlobalSearchChangeHandler}
        />
        <CustomAlert
          type={alertConfig.type}
          isVisible={alertConfig.visibility}
          message={alertConfig.message}
        />
        <div className="flex mt-20">
          <Sidebar />

          <div className="flex-grow p-7">
            <div className="mt-6 mb-8">
              <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-semibold">Enrollment Request</h1>
              </div>
            </div>

            {TableEnrollmentRequests.length > 0 ? (
              <DataTable
                catcher="_id"
                updateHandler={handleUpdateModalOpen}
                data={filterOption(TableEnrollmentRequests, searchText)}
                columns={columns}
                exportedFileName={`Enrollment Requests.csv`}
              />
            ) : (
              <CircularLoader
                isLoading={isLoading}
                failure={TableEnrollmentRequests.length <= 0}
                data={"Enrollment Request Data"}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"></div>
          </div>
        </div>

        <Modal
          isVisible={showModalUpdate}
          onClose={() => setShowModalUpdate(false)}
        >
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Update Customer
            </h3>

            <form className="space-y-6" onSubmit={handleUpdate} noValidate>
              <div className="w-full">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="group-plan"
                >
                  Change Group name
                </label>
                <select
                  name="selectedPlan"
                  value={selectedGroup._id}
                  onChange={handleGroup}
                  id="group-plan"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                  <option value="">Select Plan</option>
                  {groups.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.group_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor=""
                >
                  Group Type
                </label>
                <input
                  type="text"
                  value={selectedGroup?.group_type}
                  id="name"
                  placeholder="Group Type"
                  readOnly
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor=""
                >
                  Group Value
                </label>
                <input
                  type="text"
                  name=""
                  value={selectedGroup?.group_value}
                  id="name"
                  placeholder="Group Value"
                  required
                  readOnly
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor=""
                >
                  Group Installment
                </label>
                <input
                  type="text"
                  name=""
                  value={selectedGroup?.group_install}
                  onChange={handleInputChange}
                  id="name"
                  placeholder="Group Installment"
                  required
                  readOnly
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor=""
                >
                  Group Duration
                </label>
                <input
                  type="text"
                  name=""
                  value={selectedGroup?.group_duration}
                  onChange={handleInputChange}
                  id="name"
                  placeholder="Chit Period"
                  required
                  readOnly
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div className="w-full">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="title"
                >
                  Customer Title
                </label>
                <select
                  name="customer_title"
                  value={updateFormData?.customer_title || ""}
                  onChange={handleInputChange}
                  id="title"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                  <option value="">Select Title</option>
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Mrs">Mrs</option>
                  <option value="M/S">Mrs</option>
                  <option value="Dr">Dr</option>
                </select>
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="fname"
                >
                  Customer First Name
                </label>
                <input
                  type="text"
                  name="customer_first_name"
                  value={updateFormData?.customer_first_name || ""}
                  onChange={handleInputChange}
                  id="fname"
                  placeholder="Enter the Customer First Name"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="fname"
                >
                  Customer Last Name
                </label>
                <input
                  type="text"
                  name="customer_last_name"
                  value={updateFormData?.customer_last_name || "ULN"}
                  onChange={handleInputChange}
                  id="lname"
                  placeholder="Enter the Customer Last Name"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="date"
                >
                  Customer Date of Birth
                </label>
                <input
                  type="date"
                  name="customer_dateofbirth"
                  value={
                    updateFormData?.customer_dateofbirth
                      ? new Date(updateFormData?.customer_dateofbirth || "")
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleInputChange}
                  id="date"
                  placeholder="Enter the Date of Birth"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div className="w-full">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="gender"
                >
                  Customer Gender
                </label>
                <select
                  name="customer_gender"
                  value={updateFormData?.customer_gender || ""}
                  onChange={handleInputChange}
                  id="gender"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="phone-number"
                >
                  Customer Phone Number
                </label>
                <input
                  type="number"
                  name="customer_phone_number"
                  value={updateFormData?.customer_phone_number}
                  onChange={handleInputChange}
                  id="phone-number"
                  placeholder="Enter the Customer Phone number"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="email"
                >
                  Customer Email ID
                </label>
                <input
                  type="email"
                  name="customer_mail_id"
                  value={updateFormData?.customer_mail_id}
                  onChange={handleInputChange}
                  id="email"
                  placeholder="Enter the Customer Email"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div className="w-full">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="marital-status"
                >
                  Customer Marital Status
                </label>
                <select
                  name="customer_marital_status"
                  value={updateFormData?.customer_marital_status || ""}
                  onChange={handleInputChange}
                  id="marital-status"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                  <option value="">Select Marital Status</option>
                  <option value="Married">Married</option>
                  <option value="Unmarried">Unmarried</option>
                </select>
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="referral-name"
                >
                  Customer Referral Name
                </label>
                <input
                  type="text"
                  name="customer_referral_name"
                  value={updateFormData?.customer_referral_name}
                  onChange={handleInputChange}
                  id="referral-name"
                  placeholder="Enter the Referral Name"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div className="w-full">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="nationality"
                >
                  Customer Nationality
                </label>
                <select
                  name="customer_nationality"
                  value={updateFormData?.customer_nationality || ""}
                  onChange={handleInputChange}
                  id="nationality"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                  <option value="">Select Nationality</option>
                  <option value="Indian">Indian</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="alternate-number"
                >
                  Customer Alternate Phone Number
                </label>
                <input
                  type="number"
                  name="customer_alternate_number"
                  value={updateFormData?.customer_alternate_number}
                  onChange={handleInputChange}
                  id="alternate-number"
                  placeholder="Enter the Customer Alternate Phone number"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="village"
                >
                  Customer Village
                </label>
                <input
                  type="text"
                  name="customer_village"
                  value={updateFormData?.customer_village}
                  onChange={handleInputChange}
                  id="village"
                  placeholder="Enter the Customer Village"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="taluk"
                >
                  Customer Taluk
                </label>
                <input
                  type="text"
                  name="customer_taluk"
                  value={updateFormData?.customer_taluk}
                  onChange={handleInputChange}
                  id="taluk"
                  placeholder="Enter the Customer taluk"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="district"
                >
                  Customer District
                </label>
                <input
                  type="text"
                  name="customer_district"
                  value={updateFormData?.customer_district}
                  onChange={handleInputChange}
                  id="district"
                  placeholder="Enter the Customer district"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="state"
                >
                  Customer State
                </label>
                <input
                  type="text"
                  name="customer_state"
                  value={updateFormData?.customer_state}
                  onChange={handleInputChange}
                  id="state"
                  placeholder="Enter the Customer state"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="customer-address"
                >
                  Customer Address
                </label>
                <input
                  type="text"
                  name="customer_address"
                  value={updateFormData?.customer_address}
                  onChange={handleInputChange}
                  id="customer-address"
                  placeholder="Enter the Customer address"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="father-name"
                >
                  Customer Address
                </label>
                <input
                  type="text"
                  name="customer_father_name"
                  value={updateFormData?.customer_father_name}
                  onChange={handleInputChange}
                  id="father-name"
                  placeholder="Enter the Customer Father name"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="pincode"
                >
                  Customer Pincode
                </label>
                <input
                  type="number"
                  name="customer_pincode"
                  value={updateFormData?.customer_pincode}
                  onChange={handleInputChange}
                  id="pincode"
                  placeholder="Enter the Customer Pincode"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <label
                className="block mb-2 text-sm font-medium text-gray-900"
                htmlFor="nominee"
              >
                Nominee Details
              </label>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="nominee"
                >
                  Customer Nominee Name
                </label>
                <input
                  type="text"
                  name="customer_nominee_name"
                  value={updateFormData?.customer_nominee_name}
                  onChange={handleInputChange}
                  id="nominee"
                  placeholder="Enter the Customer Nominee Name"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="nominee-date"
                >
                  Customer Nominee Date of Birth
                </label>
                <input
                  type="date"
                  name="customer_nominee_dateofbirth"
                  value={
                    updateFormData?.customer_nominee_dateofbirth
                      ? new Date(updateFormData?.customer_nominee_dateofbirth)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleInputChange}
                  id="nominee-date"
                  placeholder="Enter the Nominee Date of Birth"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div className="w-full">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="nominee-relationship"
                >
                  Nominee Relationship
                </label>
                <select
                  name="customer_nominee_relationship"
                  value={updateFormData?.customer_nominee_relationship || ""}
                  onChange={handleInputChange}
                  id="nominee-relationship"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                >
                  <option value="">Select Relationship</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Brother/Sister">Brother/Sister</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Son/Daughter">Son/Daughter</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="nominee-phone-number"
                >
                  Customer Nominee Phone Number
                </label>
                <input
                  type="number"
                  name="customer_nominee_phone_number"
                  value={updateFormData?.customer_nominee_phone_number}
                  onChange={handleInputChange}
                  id="nominee-phone-number"
                  placeholder="Enter the Customer Nominee Phone number"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <label
                className="block mb-2 text-sm font-medium text-gray-900"
                htmlFor=""
              >
                Document Details
              </label>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="aadhar"
                >
                  Customer Adhaar Number
                </label>
                <input
                  type="number"
                  name="customer_aadhar_no"
                  value={updateFormData?.customer_aadhar_no}
                  onChange={handleInputChange}
                  id="aadhar"
                  placeholder="Enter the Customer  Adhaar Number"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="pan"
                >
                  Customer Pan Number
                </label>
                <input
                  type="text"
                  name="customer_pan_no"
                  value={updateFormData?.customer_pan_no}
                  onChange={handleInputChange}
                  id="pan"
                  placeholder="Enter the Customer  Pan Number"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="aadhar-photo"
                >
                  Customer Aadhaar Front Photo
                </label>
                <input
                  type="file"
                  name="customer_aadhar_frontphoto"
                  // value= {enrollData?.customer_aadhar_frontphoto}
                  onChange={handleInputChange}
                  id="aadhar-photo"
                  placeholder=" Upload Customer Aadhaar Front Photo"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
                <img
                  src={updateFormData?.customer_aadhar_frontphoto}
                  alt="Aadhar Front"
                  className="w-56 mx-2 my-4 h-56"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="aadhar-backphoto"
                >
                  Customer Aadhaar Back Photo
                </label>
                <input
                  type="file"
                  name="customer_aadhar_backphoto"
                  // value= {enrollData?.customer_aadhar_frontphoto}
                  onChange={handleInputChange}
                  id="aadhar-backphoto"
                  placeholder=" Upload Customer Aadhaar Back Photo"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
                <img
                  src={updateFormData?.customer_aadhar_backphoto}
                  alt="Aadhar Back"
                  className="w-56 mx-2 my-4 h-56"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="pan-photo"
                >
                  Customer Pan Front Photo
                </label>
                <input
                  type="file"
                  name="customer_pan_frontphoto"
                  // value= {enrollData?.customer_pan_frontphoto}
                  onChange={handleInputChange}
                  id="pan-photo"
                  placeholder=" Upload Customer Pan Front Photo"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
                <img
                  src={updateFormData?.customer_pan_frontphoto}
                  alt="Pan Front"
                  className="w-56 mx-2 my-4 h-56"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="pan-backphoto"
                >
                  Customer Pan Back Photo
                </label>
                <input
                  type="file"
                  name="customer_pan_backphoto"
                  // value= {enrollData?.customer_pan_backphoto}
                  onChange={handleInputChange}
                  id="pan-backphoto"
                  placeholder=" Upload Customer Pan Back Photo"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
                <img
                  src={updateFormData?.customer_pan_backphoto}
                  alt="Pan Back"
                  className="w-56 mx-2 my-4 h-56"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="profile-photo"
                >
                  Uploaded Profile Photo
                </label>
                <input
                  type="file"
                  name="customer_profilephoto"
                  // value= {enrollData?.customer_profilephoto}
                  onChange={handleInputChange}
                  id="profile-photo"
                  placeholder=" Upload Customer Profile Photo"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
                <img
                  src={updateFormData?.customer_profilephoto}
                  alt="Profile Photo"
                  className="w-56 mx-2 my-4 h-56"
                />
              </div>

              <label
                className="block mb-2 text-sm font-medium text-gray-900"
                htmlFor=""
              >
                Bank Details
              </label>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="bank-name"
                >
                  Customer Bank Name
                </label>
                <input
                  type="text"
                  name="customer_bank_name"
                  value={updateFormData?.customer_bank_name}
                  onChange={handleInputChange}
                  id="bank-name"
                  placeholder="Enter the Customer Bank Name"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="bank-branch-name"
                >
                  Customer Bank Branch Name
                </label>
                <input
                  type="text"
                  name="customer_bank_branch_name"
                  value={updateFormData?.customer_bank_branch_name}
                  onChange={handleInputChange}
                  id="bank-branch-name"
                  placeholder="Enter the Customer Bank Branch Name"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="account-number"
                >
                  Customer Bank Account Number
                </label>
                <input
                  type="text"
                  name="customer_bank_account_number"
                  value={updateFormData?.customer_bank_account_number}
                  onChange={handleInputChange}
                  id="account-number"
                  placeholder="Enter the Customer Bank Account Number"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="ifsc"
                >
                  Customer Bank IFSC Code
                </label>
                <input
                  type="text"
                  name="customer_bank_IFSC_code"
                  value={updateFormData?.customer_bank_IFSC_code}
                  onChange={handleInputChange}
                  id="ifsc"
                  placeholder="Enter the Customer Bank IFSC Code"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  className="w-1/4 text-white bg-blue-700 hover:bg-blue-800
              focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border-2 border-black"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </Modal>
        <Modal
          isVisible={showModalDelete}
          onClose={() => {
            setShowModalDelete(false);
            setCurrentEnrollmentRequest(null);
          }}
        >
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Delete Customer
            </h3>
            {currentEnrollmentRequest && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeleteEnrollmentRequest();
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
                      {currentEnrollmentRequest?.customer_first_name}
                    </span>{" "}
                    to confirm deletion.
                  </label>
                  <input
                    type="text"
                    id="groupName"
                    placeholder="Enter User Name"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
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

export default EnrollmentRequest;
