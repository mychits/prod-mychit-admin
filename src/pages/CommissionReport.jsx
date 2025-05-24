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
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchEmployees = async () => {
    setInitialLoading(true);
    try {
      const res = await api.get("/agent/get-agent");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchCommissionReport = async (employeeId) => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const url =
        employeeId === "all"
          ? "enroll/get-All-detailed-commission/all"
          : `enroll/get-detailed-commission/${employeeId}`;
      const res = await api.get(url);
      setEmployeeCustomerData(res.data?.commission_data);
      setCommissionTotalDetails(res.data?.summary);
    } catch (err) {
      console.error("Error fetching employee report:", err);
      setEmployeeCustomerData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (value) => {
    setSelectedEmployeeId(value);
    if (value === "all") {
      setSelectedEmployeeDetails(null);
    } else {
      const selectedEmp = employees.find((emp) => emp._id === value);
      setSelectedEmployeeDetails(selectedEmp || null);
    }
    fetchCommissionReport(value);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const totalBusiness = employeeCustomerData.reduce(
    (acc, curr) => acc + parseFloat(curr.group_value_digits || 0),
    0
  );

  const processedTableData = employeeCustomerData.map((item, index) => ({
    ...item,
    sl_no: index + 1,
    ...(selectedEmployeeId === "all"
      ? {
          employeeName: item.agent_name || "-",
          employeePhone: item.agent_phone || "-",
        }
      : {}),
  }));

  const columns = [
    { key: "sl_no", header: "SL. NO" },
    ...(selectedEmployeeId === "all"
      ? [
          { key: "employeeName", header: "Agent Name" },
          { key: "employeePhone", header: "Agent Phone" },
        ]
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

  if (initialLoading) {
    return (
      <div className="w-screen h-screen relative">
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
          <CircularLoader isLoading={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen">
      <div className="flex mt-30">
        <Navbar visibility={true} />

        <div className="flex-grow p-7">
          <h1 className="text-2xl font-bold text-center mb-6">
            Reports - Commission
          </h1>

          <div className="mt-6 mb-8">
            <div className="flex justify-center items-center w-full gap-4 bg-blue-50 rounded-md shadow-md p-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Select Employee
                </label>
                <Select
                  value={selectedEmployeeId || undefined}
                  onChange={handleEmployeeChange}
                  showSearch
                  popupMatchSelectWidth={false}
                  placeholder="Search or Select Employee"
                  filterOption={(input, option) =>
                    option.children
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  style={{ height: "50px", width: "400px" }}
                >
                  <Select.Option value="all">All Employees</Select.Option>
                  {employees.map((emp) => (
                    <Select.Option key={emp._id} value={emp._id}>
                      {emp.name} - {emp.phone_number}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {selectedEmployeeDetails && (
            <div className="mb-8 bg-gray-50 rounded-md shadow-md p-6 space-y-4">
             
            </div>
          )}

          {loading ? (
            <div className="flex justify-center pt-10">
              <CircularLoader isLoading={true} />
            </div>
          ) : employeeCustomerData.length > 0 ? (
            <>
              <DataTable
                data={processedTableData}
                columns={columns}
                exportedFileName={`EmployeeReport-${
                  selectedEmployeeId === "all" ? "AllEmployees" : selectedEmployeeId
                }.csv`}
              />

              <div className="mt-6 pr-10 text-right flex justify-end gap-12">
                <div className="text-lg font-semibold text-green-700">
                  Total Business: ₹
                  {totalBusiness.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            </>
          ) : (
            selectedEmployeeId && (
              <p className="text-center mt-10">No Commission Data found.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CommissionReport;
