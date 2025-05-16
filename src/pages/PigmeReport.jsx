import { useEffect, useState } from "react";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import CircularLoader from "../components/loaders/CircularLoader";
import Navbar from "../components/layouts/Navbar";
import filterOption from "../helpers/filterOption";

const PigmeReport = () => {
  const [searchText, setSearchText] = useState("");
  const [screenLoading, setScreenLoading] = useState(true);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchPigmeData = async () => {
      try {
        const response = await api.get("/pigme/get-all-pigme-customers");
        const formattedData = response.data.map((entry, index) => ({
          sl_no: index + 1,
          pigme_id: entry?.pigme_id,
          customer_name: entry?.customer?.full_name || "N/A",
          phone: entry?.customer?.phone_number || "N/A",
          maturity_period: entry?.maturity_period,
          maturity_interest: entry?.maturity_interest,
          payable_amount: entry?.payable_amount,
          start_date: entry?.start_date?.split("T")[0],
          end_date: entry?.end_date?.split("T")[0],
          note: entry?.note || "-",
        }));
        setReportData(formattedData);
      } catch (error) {
        console.error("Error fetching Pigme data:", error);
      } finally {
        setScreenLoading(false);
      }
    };

    fetchPigmeData();
  }, []);

  const totalPayableAmount = reportData.reduce(
    (sum, entry) => sum + (parseFloat(entry.payable_amount) || 0),
    0
  );

  const pigmeColumns = [
    { key: "sl_no", header: "SL. NO" },
    { key: "pigme_id", header: "Pigme ID" },
    { key: "customer_name", header: "Customer Name" },
    { key: "phone", header: "Phone Number" },
    { key: "maturity_period", header: "Maturity Period" },
    { key: "maturity_interest", header: "Maturity Interest" },
    { key: "payable_amount", header: "Payable Amount" },
    { key: "start_date", header: "Start Date" },
    { key: "end_date", header: "End Date" },
    { key: "note", header: "Note" },
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
            <h1 className="text-2xl font-semibold text-center">Pigme Report</h1>
            <div className="mt-10">
              <DataTable
                data={filterOption(reportData, searchText)}
                columns={pigmeColumns}
                exportedFileName="PigmeCustomerReport.csv"
              />
                 <div className="mt-6 bg-white p-6 rounded-lg shadow text-center">
                <h4 className="text-lg font-semibold text-gray-700">Total Payable Amount</h4>
                <p className="text-2xl font-bold text-blue-700">
                  ₹{totalPayableAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PigmeReport;
