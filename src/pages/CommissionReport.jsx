import React, { useEffect, useState } from "react";
import { Select } from "antd";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import CircularLoader from "../components/loaders/CircularLoader";
import Navbar from "../components/layouts/Navbar";

const CommissionReport = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const [employeeCustomerData, setEmployeeCustomerData] = useState([]);
  const [commissionTotalDetails, setCommissionTotalDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const formatDate = (date) => date.toISOString().split("T")[0];
const today = formatDate(new Date());
const [fromDate, setFromDate] = useState( );
const [toDate, setToDate] = useState( );


  const fetchEmployees = async () => {
    try {
      const res = await api.get("/agent/get-agent");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const fetchCommissionReport = async (employeeId) => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const res = await api.get(`enroll/get-detailed-commission/${employeeId}`, {
      params: { from_date: fromDate, to_date: toDate }
    });
      setEmployeeCustomerData(res.data?.commission_data);
      setCommissionTotalDetails(res.data?.summary);
    } catch (err) {
      console.error("Error fetching employee report:", err);
      setEmployeeCustomerData([]);
      setCommissionTotalDetails({});
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCommissionReport = async () => {
    setLoading(true);
    try {
      const res = await api.get("enroll/get-detailed-commission-all", {
      params: { from_date: fromDate, to_date: toDate }
    });
      setEmployeeCustomerData(res.data?.commission_data);
      setCommissionTotalDetails(res.data?.summary);
    } catch (err) {
      console.error("Error fetching all commission report:", err);
      setEmployeeCustomerData([]);
      setCommissionTotalDetails({});
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (value) => {
    setSelectedEmployeeId(value);
    if (value === "ALL") {
      setSelectedEmployeeDetails(null);
      fetchAllCommissionReport();
    } else {
      const selectedEmp = employees.find((emp) => emp._id === value);
      setSelectedEmployeeDetails(selectedEmp || null);
      fetchCommissionReport(value);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

   useEffect(() => {
    if (selectedEmployeeId === "ALL") {
      fetchAllCommissionReport();
    } else if (selectedEmployeeId) {
      fetchCommissionReport(selectedEmployeeId);
    }
  }, [fromDate, toDate]);


  const processedTableData = employeeCustomerData.map((item, index) => ({
    ...item,
  }));

  const columns = [
     ...(selectedEmployeeId === "ALL"
    ? [{ key: "agent_name", header: "Agent Name" }]
    : []),
    { key: "user_name", header: "Customer Name" },
    { key: "phone_number", header: "Phone Number" },
    { key: "group_name", header: "Group Name" },
    { key: "group_value_digits", header: "Group Value" },
    { key: "commission_rate", header: "Commission Rate" },
    { key: "start_date", header: "Start Date" },
    { key: "estimated_commission_digits", header: "Estimated Commission" },
    { key: "actual_commission_digits", header: "Actual Commission" },
    { key: "total_paid_digits", header: "Total Paid" },
    { key: "required_installment_digits", header: "Required Installment" },
    { key: "commission_released", header: "Commission Released" },
  ];

  return (
    <div className="w-screen min-h-screen">
      <div className="flex mt-30">
        <Navbar visibility={true} />
        <div className="flex-grow p-7">
          <h1 className="text-2xl font-bold text-center ">Reports - Commission</h1>

          <div className="mt-6 mb-8">
            <div className="mb-2">
            <div className="flex justify-center items-center w-full gap-4 bg-blue-50 p-2 w-30 h-40 rounded-3xl border   space-x-2">
              <div className="mb-2">
                <label className="block text-lg text-gray-500 text-center font-semibold mb-2">
                  Employee
                </label>
                <Select
                  value={selectedEmployeeId || undefined}
                  onChange={handleEmployeeChange}
                  showSearch
                  popupMatchSelectWidth={false}
                  placeholder="Search or Select Employee"
                  filterOption={(input, option) =>
                    option.children.toString().toLowerCase().includes(input.toLowerCase())
                  }
                  style={{ height: "50px", width: "600px" }}
                >
                  <Select.Option value="ALL">All</Select.Option>
                  {employees.map((emp) => (
                    <Select.Option key={emp._id} value={emp._id}>
                      {emp.name} - {emp.phone_number}
                    </Select.Option>
                  ))}
                </Select>
              </div>
               <div className="mb-2">
    <label className="block text-lg text-gray-500 text-center font-semibold mb-2">
      From Date
    </label>
    <input
      type="date"
      value={fromDate}
      max={today}
      onChange={(e) => {
        const newFrom = e.target.value;
        if (toDate < newFrom) setToDate(newFrom);
        setFromDate(newFrom);
      }}
      className="border border-gray-300 rounded px-4 py-2 w-[200px]"
    />
  </div>

  {/* To Date */}
  <div className="mb-2">
    <label className="block text-lg text-gray-500 text-center font-semibold mb-2">
      To Date
    </label>
    <input
      type="date"
      value={toDate}
      min={fromDate}
      max={today}
      onChange={(e) => setToDate(e.target.value)}
      className="border border-gray-300 rounded px-4 py-2 w-[200px]"
    />
  </div>
            </div>
          </div>
          </div>

          {/* Employee Info */}
        {(selectedEmployeeId === "ALL" || selectedEmployeeDetails) && (
  <div className="mb-8 bg-gray-50 rounded-md shadow-md p-6 space-y-4">
    
    {selectedEmployeeId !== "ALL" && selectedEmployeeDetails && (
      <>
        <div className="flex gap-4">
          <div className="flex flex-col flex-1">
            <label className="text-sm font-medium mb-1">Name</label>
            <input
              value={selectedEmployeeDetails.name || "-"}
              readOnly
              className="border border-gray-300 rounded px-4 py-2 bg-white"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-sm font-medium mb-1">Email</label>
            <input
              value={selectedEmployeeDetails.email || "-"}
              readOnly
              className="border border-gray-300 rounded px-4 py-2 bg-white"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-sm font-medium mb-1">Phone Number</label>
            <input
              value={selectedEmployeeDetails.phone_number || "-"}
              readOnly
              className="border border-gray-300 rounded px-4 py-2 bg-white"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col flex-1">
            <label className="text-sm font-medium mb-1">Adhaar Number</label>
            <input
              value={selectedEmployeeDetails.adhaar_no || "-"}
              readOnly
              className="border border-gray-300 rounded px-4 py-2 bg-white"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-sm font-medium mb-1">PAN Number</label>
            <input
              value={selectedEmployeeDetails.pan_no || "-"}
              readOnly
              className="border border-gray-300 rounded px-4 py-2 bg-white"
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-sm font-medium mb-1">Pincode</label>
            <input
              value={selectedEmployeeDetails.pincode || "-"}
              readOnly
              className="border border-gray-300 rounded px-4 py-2 bg-white"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Address</label>
          <input
            value={selectedEmployeeDetails.address || "-"}
            readOnly
            className="border border-gray-300 rounded px-4 py-2 bg-white"
          />
        </div>
      </>
    )}

    {/* Summary always shown */}
    <div className="flex gap-4">
      <div className="flex flex-col flex-1">
        <label className="text-sm font-medium mb-1">Actual Business</label>
        <input
          value={commissionTotalDetails?.actual_business || "-"}
          readOnly
          className="border border-gray-300 rounded px-4 py-2 bg-white text-green-700 font-bold"
        />
      </div>
      <div className="flex flex-col flex-1">
        <label className="text-sm font-medium mb-1">Expected Business</label>
        <input
          value={commissionTotalDetails?.expected_business || "-"}
          readOnly
          className="border border-gray-300 rounded px-4 py-2 bg-white"
        />
      </div>
      <div className="flex flex-col flex-1">
        <label className="text-sm font-medium mb-1">Estimated Commission</label>
        <input
          value={commissionTotalDetails?.total_estimated || "-"}
          readOnly
          className="border border-gray-300 rounded px-4 py-2 bg-white"
        />
      </div>
    </div>

    <div className="flex gap-4">
      <div className="flex flex-col flex-1">
        <label className="text-sm font-medium mb-1">Actual Commission</label>
        <input
          value={commissionTotalDetails?.total_actual || "-"}
          readOnly
          className="border border-gray-300 rounded px-4 py-2 bg-white font-bold"
        />
      </div>
      <div className="flex flex-col flex-1">
        <label className="text-sm font-medium mb-1">Total Customers</label>
        <input
          value={commissionTotalDetails?.total_customers || "-"}
          readOnly
          className="border border-gray-300 rounded px-4 py-2 bg-white"
        />
      </div>
      <div className="flex flex-col flex-1">
        <label className="text-sm font-medium mb-1">Total Groups</label>
        <input
          value={commissionTotalDetails?.total_groups || "-"}
          readOnly
          className="border border-gray-300 rounded px-4 py-2 bg-white"
        />
      </div>
    </div>
  </div>
)}


          {/* Table Section */}
          {loading ? (
            <CircularLoader isLoading={true} />
          ) : employeeCustomerData.length > 0 ? (
            <>
              <DataTable
                data={processedTableData}
                columns={columns}
                exportedFileName={`CommissionReport-${selectedEmployeeId || "all"}.csv`}
              />
            </>
          ) : (
            selectedEmployeeId && (
              <p className="text-center font-bold text-lg">No Commission Data found.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CommissionReport;
