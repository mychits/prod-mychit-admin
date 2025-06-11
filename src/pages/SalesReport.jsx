import { useEffect, useState } from "react";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import Navbar from "../components/layouts/Navbar";
import CircularLoader from "../components/loaders/CircularLoader";

const formatDate = (date) => date.toISOString().split("T")[0];

const SalesReport = () => {
  const [formattedAgents, setFormattedAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState("all");
  const [tableReportData, setTableReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const today = formatDate(new Date());
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/agent/get-agent");
        const agents = response?.data;

        if (!Array.isArray(agents)) {
          console.error(" 'agent' is not an array!");
          setFormattedAgents([]);
          return;
        }

        const formatted = agents.map((agent, index) => {
          const label = `${agent.name} (${agent.phone_number})`;
          return {
            _id: agent._id,
            id: index + 1,
            name: agent.name,
            phone: agent.phone_number,
            label,
          };
        });

        if (formatted.length === 0) {
      
          setFormattedAgents(dummy);
        } else {
          setFormattedAgents(formatted);
        }
      } catch (err) {
        console.error(" Fetch failed:", err);
        setFormattedAgents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    fetchSalesReport();
  }, [selectedAgentId, fromDate, toDate]);

const fetchSalesReport = async () => {
  try {
    setIsLoading(true);

    const params = {
      from_date: fromDate,
      to_date: toDate,
      agentId: selectedAgentId && selectedAgentId !== "all" ? selectedAgentId : "all",
    };

    const response = await api.get("/report/sales-report", { params });

    if (response.status >= 400) throw new Error("Failed to fetch report");

    const res = response.data;

    let formatted;

    if (params.agentId === "all") {
     
      formatted = res.data.map((item, idx) => ({
        id: idx + 1,
        name: item.name,
        phone: item.phone,
        leads: typeof item.leads === "number" ? item.leads : 0,
        customers: typeof item.customers === "number" ? item.customers : 0,
        date: item.date || fromDate,
        groupName: item.groupName || "-",
        groupValue: item.groupValue || "-",
      }));
    } else {

      formatted = res.data.map((item, idx) => ({
        id: idx + 1,
        name: item.name,
        phone: item.phone,
        leads: typeof item.leads === "number" ? item.leads : 0,
        customers: typeof item.customers === "number" ? item.customers : 0,
        date: item.date || fromDate,
        groupName: item.groupName || "-",
        groupValue: item.groupValue || "-",
      }));
    }

    setTableReportData(formatted);
  } catch (error) {
    console.error("Error fetching sales report:", error);
    setTableReportData([]);
  } finally {
    setIsLoading(false);
  }
};


const columns = [
  { key: "id", header: "SL. NO" },
  { key: "name", header: "Agent" },
  { key: "phone", header: "Phone Number" },
  { key: "leads", header: "Leads" },
  { key: "customers", header: "Customers" },
  { key: "date", header: "Date" },
  { key: "groupName", header: "Group" },
  { key: "groupValue", header: "Sales" },
];


  return (
    <div className="w-full">
      <Navbar />
      <div className="p-6">
        <h1 className="text-4xl font-semibold mb-4 text-center">Reports-Sales</h1>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
         
          <div>
            <label className="block mb-1 font-semibold">Select Agent</label>
            <select
              className="border px-4 py-2 rounded w-full"
              value={selectedAgentId}
              onChange={(e) => {
                setSelectedAgentId(e.target.value);
              }}
            >
              <option value="all">-- All Agents --</option>
              {formattedAgents.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.label}
                </option>
              ))}
            </select>
           
          </div>

       

         <div>
            <label className="block mb-1 font-semibold">From Date</label>
            <input
              type="date"
              value={fromDate}
              max={today} 
              onChange={(e) => {
                const selectedFromDate = e.target.value;
               
                if (toDate < selectedFromDate) {
                  setToDate(selectedFromDate);
                }
                setFromDate(selectedFromDate);
              }}
              className="border px-4 py-2 rounded w-full"
            />
          </div>

          
          <div>
            <label className="block mb-1 font-semibold">To Date</label>
            <input
              type="date"
              value={toDate}
              min={fromDate} 
              max={today} 
              onChange={(e) => setToDate(e.target.value)}
              className="border px-4 py-2 rounded w-full"
            />
          </div>
        </div>

        

        {isLoading ? (
          <div className="flex justify-center items-center">
            <CircularLoader />
          </div>
        ) : (
          <DataTable
            data={tableReportData}
            columns={columns}
            exportedFileName="SalesReport.csv"
          />
        )}
      </div>
    </div>
  );
};

export default SalesReport;
