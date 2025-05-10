import React, { useEffect, useState } from "react";
import { Select } from "antd";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import CircularLoader from "../components/loaders/CircularLoader";

const EmployeeReport = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [employeeCustomerData, setEmployeeCustomerData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/agent/get-agent");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const fetchEmployeeReport = async (employeeId) => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const res = await api.get(`/agent/getemployeereport?agentId=${employeeId}`);
      setEmployeeCustomerData(res.data);
    } catch (err) {
      console.error("Error fetching employee report:", err);
      setEmployeeCustomerData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (value) => {
    setSelectedEmployeeId(value);
    fetchEmployeeReport(value);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const totalCommission = employeeCustomerData.reduce(
    (acc, curr) => acc + parseFloat(curr.commissionValue?.replace(/,/g, "") || 0),
    0
  );
  

  const columns = [
    { key: "customerName", header: "Customer Name" },
    { key: "customerId", header: "Customer ID" },
    { key: "userPhone", header: "Phone Number" },
    { key: "groupName", header: "Group" },
    {
      key: "enrollmentStartDate",
      header: "Enrollment Start Date",
      render: (row) => row.enrollmentStartDate?.split("T")[0] || "-",
    },
    
    { key: "ticket", header: "Ticket" },
    { key: "amountPaid", header: "Amount Paid" }, 
    { key: "toBePaidAmount", header: "To Be Paid" },  
    { key: "balance", header: "Balance" },
    { key: "commissionPercent", header: "Commission (%)" },
  { key: "commissionValue", header: "Commission (₹)" },
  { key: "incentives", header: "Incentives" },
  ];

  return (
    <div className="flex-grow p-7">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Employee Report
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
                option.children.toString().toLowerCase().includes(input.toLowerCase())
              }
              style={{ height: "50px", width: "400px" }}
            >
              {employees.map((emp) => (
                <Select.Option key={emp._id} value={emp._id}>
                  {emp.name} - {emp.phone_number}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="ml-6 text-md font-semibold text-blue-700">
  Total Commission: ₹{totalCommission.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
</div>

        </div>
      </div>

      {loading ? (
        <CircularLoader isLoading={true} />
      ) : employeeCustomerData.length > 0 ? (
        <DataTable
          data={employeeCustomerData}
          columns={columns}
          exportedFileName={`EmployeeReport-${selectedEmployeeId}.csv`}
        />
      ) : (
        selectedEmployeeId && <p>No data found for the selected employee.</p>
      )}    
    </div>
  );
};

export default EmployeeReport;
