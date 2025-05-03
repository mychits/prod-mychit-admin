import React, { useState, useEffect } from "react";
//import logo from "../pages/mychits.svg";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import api from "../instance/TokenInstance";

const EnrollmentRequestForm = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  //const [editId, setEditId] = useState(null);
  // const {group_id} = useSearchParams();
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  //  set new customer details empty
  const [enrollData, setEnrollData] = useState({
    selectedPlan: "",
    customer_title: "",
    customer_first_name: "",
    customer_last_name: "",
    customer_id: "",
    customer_gender: "",
    customer_marital_status: "",
    customer_dateofbirth: null,
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
    customer_nominee_dateofbirth: null,
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
  });

  useEffect(() => {
    const fetchSelectedGroup = async () => {
      try {
        const group_id = searchParams.get("group_id");
        const res = await api.get(`group/get-by-id-group/${group_id}`);
        const data = res.data;
        setSelectedGroup(data);
      } catch (err) {
        console.error("failed to fetch group", err);
      }
    };
    fetchSelectedGroup();
  }, []);

  // handling change in value all data fields from enrollment form
  const handleChange = (e) => {
    setEnrollData({ ...enrollData, [e.target.name]: e.target.value });
  };

  // handling change in value all file format fields from enrollment form
  const handleFileChange = (e) => {
    setEnrollData({ ...enrollData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = `enrollment-request/add-enrollment-request-data`;

      // Create a new FormData object
      const enrollDataObj = new FormData();

      // Exclude selectedPlan from enrollData (because we handle it separately)
      const { selectedPlan, ...restEnrollData } = enrollData;

      // Append the remaining fields (except selectedPlan)
      Object.entries(restEnrollData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          enrollDataObj.append(key, value);
        }
      });

      // Append selectedGroup fields manually
      if (
        selectedGroup &&
        selectedGroup._id &&
        selectedGroup.group_name &&
        selectedGroup.group_value &&
        selectedGroup.group_install &&
        selectedGroup.group_duration
      )
        enrollDataObj.append("selectedPlan", selectedGroup._id);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      // Make the API request
      const response = await api.post(url, enrollDataObj, config);

      setIsSubmitted(true);

      alert("Enrollment successful!");
    } catch (error) {
      console.error("Error submitting enrollment:", error);
      alert("Failed to submit enrollment. Please try again.");
    }
  };
  if (isSubmitted) {
    return (
      <div className="border-2  mx-auto bg-white rounded-lg shadow-md overflow-hidden">

        <div className="p-6 flex flex-col items-center space-y-4">



          <h2 className="text-2xl font-medium text-gray-900">Thank You!</h2>


          <p className="text-gray-600 text-center">
            Your enrollment was successful. We're excited to have you on board!
          </p>

          <Link to={"https://maps.app.goo.gl/X7FezFRPiTjuYoVt5"}>

            <button className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition">
              Our Location
            </button>
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-white p-4 rounded-md shadow-2xl sm:my-10 sm:mx-64">
        <form onSubmit={handleSubmit} >
          <div>
            {/* <img src={logo} alt="Logo" className="mx-auto mt-5 sm:w-[300px] w-[200px]" /> */}
          </div>

          <div className="m-3 mt-3 p-4 text-xl sm:text-4xl font-bold rounded-md text-amber-50 bg-blue-900">
            <h2> Chit Enrollment Form </h2>
          </div>

          <div className="m-4">
            <>
              <h1 className="text-left text-white sm:text-lg text-sm font-semibold mt-6">
                Change Chit Plan
              </h1>
              <h2 className="text-left  sm:text-lg text-sm font-semibold ">
                Group Name
              </h2>
              <select
                disabled
                className="w-full p-2 border border-gray-300 rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50  focus:ring-blue-500  focus:border-blue-500 cursor-not-allowed"
              >
                <option value={selectedGroup?._id} className="text-gray-600">
                  {selectedGroup?.group_name}
                </option>
              </select>

              <div className="sm:flex gap-4">
                <div className="sm:w-1/2 w-full">
                  <h2 className="text-left  sm:text-lg text-sm font-semibold ">
                    Group Type
                  </h2>
                  <input
                    className="w-full p-2 border border-gray-300 bg-gray-50 rounded-md mb-4 mt-1 sm:text-lg text-sm  text-gray-600 focus:ring-blue-500  focus:border-blue-500 cursor-not-allowed"
                    name=""
                    type="text"
                    placeholder=""
                    value={
                      `${selectedGroup?.group_type?.charAt(0)?.toUpperCase() +
                      selectedGroup?.group_type?.slice(1)
                      } Group` || ""
                    }
                    disabled
                  />
                </div>
                <div className="sm:w-1/2 w-full">
                  <h2 className="text-left sm:text-lg text-sm font-semibold">
                    Group Value
                  </h2>
                  <input
                    className="w-full p-2 border  border-gray-300 rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 text-gray-600 focus:ring-blue-500  focus:border-blue-500 hover:cursor-not-allowed"
                    name=""
                    type="text"
                    placeholder="50000 "
                    value={selectedGroup?.group_value || ""}
                    disabled
                  />
                </div>
              </div>

              <div className="sm:flex gap-4">
                <div className="sm:w-1/2 w-full">
                  <h2 className="text-left sm:text-lg text-sm font-semibold ">
                    Group Installment
                  </h2>
                  <input
                    className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-600 focus:ring-blue-500  focus:border-blue-500 hover:cursor-not-allowed"
                    name=""
                    type="text"
                    placeholder="400 "
                    value={selectedGroup?.group_install || ""}
                    disabled
                  />
                </div>
                <div className="sm:w-1/2 w-full">
                  <h2 className="text-left sm:text-lg text-sm font-semibold">
                    Group Duration
                  </h2>
                  <input
                    className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-600 focus:ring-blue-500  focus:border-blue-500 hover:cursor-not-allowed"
                    name=""
                    type="text"
                    placeholder="13.2 "
                    value={selectedGroup?.group_duration || ""}
                    disabled
                  />
                </div>
              </div>
            </>
          </div>

          <div>
            <div className="bg-[#17216D] rounded-md m-3 ">
              <h2 className="p-4 text-left text-white rounded-md font-bold text-xl bg-blue-900 ">
                {" "}
                Customer Details
              </h2>
            </div>

            <div className="m-4">
              <>
                {step === 1 && (
                  <div>
                    <div className="sm:flex  gap-4">
                      <div className="sm:w-1/6 w-full">
                        <h1 className="text-left sm:text-lg text-sm font-semibold ">
                          Title
                        </h1>
                        <select
                          name="customer_title"
                          value={enrollData?.customer_title}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                        >
                          <option value="">Select </option>
                          <option value="Mr">Mr</option>
                          <option value="Ms">Ms</option>
                          <option value="Mrs">Mrs</option>
                          <option value="M/S">Mrs</option>
                          <option value="Dr">Dr</option>
                        </select>
                      </div>
                      <div className="sm:w-1/2 w-full">
                        <h1 className="text-left sm:text-lg text-sm font-semibold ">
                          Customer First Name
                        </h1>
                        <input
                          className="bg-gray-50 w-full p-2 rounded-lg mb-4 mt-1 sm:text-lg text-sm  border border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                          name="customer_first_name"
                          type="text"
                          required
                          placeholder="Enter Customer First Name"
                          value={enrollData?.customer_first_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="sm:w-1/2 w-full">
                        <h1 className="text-left sm:text-lg text-sm font-semibold ">
                          Customer Last Name
                        </h1>
                        <input
                          className="bg-gray-50 w-full p-2 rounded-lg mb-4 mt-1 sm:text-lg text-sm  border border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                          name="customer_last_name"
                          type="text"
                          required
                          placeholder="Enter Customer Last Name"
                          value={enrollData?.customer_last_name || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:flex  gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold ">
                          Customer Date of Birth
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 placeholder:text-black bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                          name="customer_dateofbirth"
                          type="date"
                          placeholder="dd-mm-yyyy"
                          value={enrollData?.customer_dateofbirth || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h1 className="text-left sm:text-lg text-sm font-semibold  ">
                          Customer Gender
                        </h1>
                        <select
                          name="customer_gender"
                          value={enrollData?.customer_gender}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md mb-4 sm:text-lg text-sm  mt-1 bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold ">
                          Customer Phone Number
                        </h2>

                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                          name="customer_phone_number"
                          type="tel"
                          inputMode="numeric"
                          placeholder="Enter Phone Number"
                          value={enrollData?.customer_phone_number}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                          Customer Email ID
                        </h2>

                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                          name="customer_mail_id"
                          type="email"
                          placeholder="Enter Email ID"
                          value={enrollData?.customer_mail_id}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h1 className="text-left sm:text-lg text-sm font-semibold  ">
                          Customer Marital Status
                        </h1>
                        <select
                          name="customer_marital_status"
                          value={enrollData?.customer_marital_status}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md mb-4 sm:text-lg text-sm mt-1 bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                        >
                          <option value="">Select Marital Status</option>
                          <option value="Married">Married</option>
                          <option value="Unmarried">Unmarried</option>
                        </select>
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                          Customer Referral Name
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                          name="customer_referral_name"
                          type="text"
                          placeholder="Enter Customer Referral Name"
                          value={enrollData?.customer_referral_name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold ">
                          Customer Nationality
                        </h2>
                        <select
                          name="customer_nationality"
                          value={enrollData?.customer_nationality}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md mb-4 sm:text-lg text-sm mt-1 bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                        >
                          <option value="">Select Nationality</option>
                          <option value="Indian">Indian</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="w-full sm:w-1/2">
                        <h2 className="text-left sm:text-lg text-sm font-semibold ">
                          Alternate Number
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                          name="customer_alternate_number"
                          type="tel"
                          inputMode="numeric"
                          placeholder="Enter Alternate Number"
                          value={enrollData?.customer_alternate_number}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold ">
                          Customer Village
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                          name="customer_village"
                          type="text"
                          placeholder="Enter Village "
                          value={enrollData?.customer_village}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold">
                          Customer Taluk
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                          name="customer_taluk"
                          type="text"
                          placeholder="Enter Taluk "
                          value={enrollData?.customer_taluk}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold ">
                          Customer District
                        </h2>
                        <select
                          name="customer_district"
                          value={enrollData?.customer_district}
                          onChange={handleChange}

                          className="w-full p-2 border rounded-md  sm:text-lg text-sm mb-4 mt-1 bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                        >
                          <option value="">Select District</option>
                          <option value="Bengaluru North">Bengaluru North</option>
                          <option value="Bengaluru South">Bengaluru South</option>
                          <option value="Bengaluru Urban">Bengaluru Urban</option>
                          <option value="Bengaluru Rural">Bengaluru Rural</option>
                        </select>
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                          Customer State
                        </h2>
                        <select
                          name="customer_state"
                          value={enrollData?.customer_state}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md  sm:text-lg text-sm mb-4 mt-1 bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                        >
                          <option value="">Select State</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                        </select>
                      </div>
                    </div>

                    <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                      Customer Address
                    </h2>
                    <input
                      className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                      name="customer_address"
                      type="text"
                      placeholder="Address"
                      value={enrollData?.customer_address}
                      onChange={handleChange}
                    />

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                          Customer Father Name
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                          name="customer_father_name"
                          type="text"
                          placeholder="Enter Customer Father Name"
                          value={enrollData?.customer_father_name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                          Customer Pincode
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                          name="customer_pincode"
                          type="number"
                          placeholder="Enter Pincode"
                          inputMode="numeric"
                          value={enrollData?.customer_pincode}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:flex gap-3">
                      <button
                        type="button"
                        className="w-40 active:scale-95 font-semibold border-2 border-black shadow-md bg-blue-900 hover:bg-indigo-600 text-white p-2 rounded-md"
                        onClick={() => setStep(2)}
                      >
                        Add Nominee
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <div className="bg-[#17216D] rounded-md mb-3">
                      <h2 className="p-4 text-left font-bold rounded-md bg-blue-900 text-xl text-white">
                        {" "}
                        Nominee Details
                      </h2>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                          Customer Nominee Name
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                          name="customer_nominee_name"
                          type="text"
                          placeholder="Enter Nominee Name"
                          value={enrollData?.customer_nominee_name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                          Customer Nominee Date of Birth
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                          name="customer_nominee_dateofbirth"
                          type="date"
                          placeholder="dd-mm-yyyy"
                          value={enrollData?.customer_nominee_dateofbirth || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                          Nominee Relationship
                        </h2>
                        <select
                          name="customer_nominee_relationship"
                          value={enrollData?.customer_nominee_relationship}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md  sm:text-lg text-sm mb-4 mt-1 bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
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

                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                          Customer Nominee Phone Number
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                          name="customer_nominee_phone_number"
                          type="numeric"
                          placeholder="Enter Nominee Phone Number"
                          value={enrollData?.customer_nominee_phone_number}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="sm:flex gap-3">
                      <button
                        type="button"
                        className="w-40 active:scale-95 font-semibold border-2 border-black shadow-md bg-blue-900 hover:bg-indigo-600 text-white p-2 rounded-md"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </button>
                    
                      <button
                        type="button"
                        className="w-40 active:scale-95 font-semibold border-2 border-black shadow-md bg-blue-900 hover:bg-indigo-600 text-white p-2 rounded-md"
                        onClick={() => setStep(3)}
                      >
                        Add Documents
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                <div className="bg-[#17216D] rounded-md">
                  <h2 className="p-4 text-left font-bold rounded-md bg-blue-900 text-xl text-white mb-3">
                    {" "}
                    Document Details
                  </h2>
                </div>

                <div className="sm:flex gap-4">
                  <div className="sm:w-1/2 w-full">
                    <h1 className="text-left sm:text-lg text-sm font-semibold ">
                      Customer Adhaar Number
                    </h1>
                    <input
                      className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                      name="customer_aadhar_no"
                      type="numeric"
                      placeholder="Enter Adhaar Number"
                      value={enrollData?.customer_aadhar_no}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="sm:w-1/2 w-full">
                    <h1 className="text-left sm:text-lg text-sm font-semibold ">
                      Customer Pan Number
                    </h1>

                    <input
                      className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                      name="customer_pan_no"
                      type="text"
                      accept="image/*"
                      placeholder="Enter Pan Number"
                      value={enrollData?.customer_pan_no}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="sm:flex gap-4">
                  <div className="sm:w-1/2 w-full">
                    <h1 className="text-left sm:text-lg text-sm font-semibold ">
                      Customer Aadhaar Front Photo
                    </h1>
                    <img src="path/to/image.jpg" alt="" />
                    <input
                      className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                      name="customer_aadhar_frontphoto"
                      type="file"
                      accept="image/*"
                      placeholder="No file choosen"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="sm:w-1/2 w-full">
                    <h1 className="text-left sm:text-lg text-sm font-semibold ">
                      Customer Aadhaar Back photo
                    </h1>
                    <img src="path/to/image.jpg" alt="" />
                    <input
                      className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                      name="customer_aadhar_backphoto"
                      type="file"
                      accept="image/*"
                      placeholder="No file choosen"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className="sm:flex gap-4">
                  <div className="sm:w-1/2 w-full">
                    <h1 className="text-left sm:text-lg text-sm font-semibold ">
                      Customer Pan Front photo
                    </h1>
                    <img src="path/to/image.jpg" alt="" />
                    <input
                      className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                      name="customer_pan_frontphoto"
                      type="file"
                      accept="image/*"
                      placeholder="No file choosen"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="sm:w-1/2 w-full">
                    <h1 className="text-left sm:text-lg text-sm font-semibold ">
                      Customer Pan Back photo
                    </h1>
                    <img src="path/to/image.jpg" alt="" />
                    <input
                      className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                      name="customer_pan_backphoto"
                      type="file"
                      accept="image/*"
                      placeholder="No file choosen"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <h1 className="text-left sm:text-lg text-sm font-semibold ">
                  Upload Profile Photo
                </h1>
                <img src="path/to image" alt="" />
                <input
                  className="w-full p-4 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                  name="customer_profilephoto"
                  type="file"
                  accept="image/*"
                  placeholder="No file choosen"
                  onChange={handleFileChange}
                />
                     <div className="sm:flex gap-3">
                      <button
                        type="button"
                        className="w-40 active:scale-95 font-semibold border-2 border-black shadow-md bg-blue-900 hover:bg-indigo-600 text-white p-2 rounded-md"
                        onClick={() => setStep(2)}
                      >
                        Back
                      </button>
                    
                      <button
                        type="button"
                        className="w-40 active:scale-95 font-semibold border-2 border-black shadow-md bg-blue-900 hover:bg-indigo-600 text-white p-2 rounded-md"
                        onClick={() => setStep(4)}
                      >
                        Add Bank Details
                      </button>
                    </div>
                </div>
                )}
             
             {step === 4 && (
               <div>
                <div className="bg-[#17216D] rounded-md mb-3">
                  <h2 className="p-4 text-left font-bold rounded-md bg-blue-900 text-xl text-white">
                    {" "}
                    Bank Details
                  </h2>
                </div>

                <div className="sm:flex gap-4">
                  <div className="sm:w-1/2 w-full">
                    <h2 className="text-left sm:text-lg text-sm font-semibold ">
                      Customer Bank Name
                    </h2>
                    <input
                      className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                      name="customer_bank_name"
                      type="text"
                      placeholder="Enter Customer Bank Name "
                      value={enrollData?.customer_bank_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="sm:w-1/2 w-full">
                    <h2 className="text-left sm:text-lg text-sm font-semibold">
                      Customer Bank Branch Name
                    </h2>

                    <input
                      className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                      name="customer_bank_branch_name"
                      type="text"
                      placeholder="Enter Customer Bank Branch Name"
                      value={enrollData?.customer_bank_branch_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="sm:flex gap-4">
                  <div className="sm:w-1/2 w-full">
                    <h2 className="text-left sm:text-lg text-sm font-semibold ">
                      Customer Bank Account Number
                    </h2>
                    <input
                      className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                      name="customer_bank_account_number"
                      type="text"
                      placeholder="Enter Customer Bank Account Number "
                      value={enrollData?.customer_bank_account_number}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="sm:w-1/2 w-full">
                    <h2 className="text-left sm:text-lg text-sm font-semibold">
                      Customer Bank IFSC Code
                    </h2>

                    <input
                      className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500  focus:border-blue-500"
                      name="customer_bank_IFSC_code"
                      type="text"
                      placeholder="Enter Customer Bank IFSC Code"
                      value={enrollData?.customer_bank_IFSC_code}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="sm:flex gap-3">
                      <button
                        type="button"
                        className="w-40 active:scale-95 font-semibold border-2 border-black shadow-md bg-blue-900 hover:bg-indigo-600 text-white p-2 rounded-md"
                        onClick={() => setStep(3)}
                      >
                        Back
                      </button>
                  
                  <button
                    type="submit"
                    className="w-40 active:scale-95 font-semibold border-2 border-black shadow-md bg-blue-900 hover:bg-indigo-600 text-white p-2 rounded-md"
                  >
                    Submit
                  </button>
                </div>
                </div>
             )}
              </>
            </div>
          </div>
        </form>
      </div>
    );
  }
};
export default EnrollmentRequestForm;
