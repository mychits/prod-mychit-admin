import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import Navbar from "../components/layouts/Navbar";
import Modal from "../components/modals/Modal";
import DataTable from "../components/layouts/Datatable";
import api from "../instance/TokenInstance";
import CustomAlert from "../components/alerts/CustomAlert";
import CircularLoader from "../components/loaders/CircularLoader";
import { Dropdown } from "antd";
import { IoMdMore } from "react-icons/io";

const Task = () => {
  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tableTasks, setTableTasks] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: "",
    taskTitle: "",
    taskDescription: "",
    startDate: "",
    endDate: "",
    status: "Pending",
    lead: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [alert, setAlert] = useState({ visibility: false, message: "", type: "" });
  const [currentTask, setCurrentTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [agentRes, leadRes, taskRes] = await Promise.all([
        api.get("/agent/get-agent"),
        api.get("/lead/get-lead"),
        api.get("/task/get-tasks"),
      ]);

      const agentData = agentRes.data;
      const leadData = leadRes.data;
      const taskData = taskRes.data;

      setAgents(agentData);
      setLeads(leadData);
      setTasks(taskData);

      const formatted = taskData.map((task, index) => {
        const emp = agentData.find((a) => a._id === task.employeeId);
        const leadObj = leadData.find((l) => l._id === task.lead);

        return {
          _id: task._id,
          id: index + 1,
          employeeName: emp?.name || "N/A",
          employeeCode: emp?.employeeCode || "N/A",
          taskTitle: task.taskTitle,
          status: task.status,
          lead: task.lead?.name && task.lead?.phone ? `${task.lead.name} (${task.lead.phone})` : "N/A",
  
          action: (
            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    label: (
                      <div className="text-green-600" onClick={() => openEdit(task)}>
                        Edit
                      </div>
                    ),
                  },
                  {
                    key: "2",
                    label: (
                      <div className="text-red-600" onClick={() => handleDelete(task._id)}>
                        Delete
                      </div>
                    ),
                  },
                ],
              }}
              placement="bottomLeft"
            >
              <IoMdMore className="cursor-pointer" />
            </Dropdown>
          ),
        };
      });

      setTableTasks(formatted);
    } catch (err) {
      console.error("Error fetching all data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    console.info(formData,"formData")
    e.preventDefault();
    try {
      // const selectedAgent = agents.find(a => a._id === formData.employeeId);
      // if (!selectedAgent || !selectedAgent.employeeCode) {
      //   setAlert({ visibility: true, message: "Invalid employee or missing employee code", type: "error" });
      //   return;
      // }
  
      // const selectedLead = leads.find(l => l._id === formData.lead);
      // if (!selectedLead) {
      //   setAlert({ visibility: true, message: "Invalid lead selected", type: "error" });
      //   return;
      // }
  
      const payload = {
        ...formData,
        // employeeCode: selectedAgent.employeeCode,
        // lead,
      };
  
      if (currentTask) {
        await api.put(`/task/update-task/${currentTask}`, payload);
        setAlert({ visibility: true, message: "Task updated successfully", type: "success" });
      } else {
        await api.post("/task/add-task", payload);
        setAlert({ visibility: true, message: "Task created successfully", type: "success" });
      }
  
      setModalVisible(false);
      setFormData({
        employeeId: "",
        taskTitle: "",
        taskDescription: "",
        startDate: "",
        endDate: "",
        status: "Pending",
        lead: "",
      });
      setCurrentTask(null);
      fetchAllData();
    } catch (err) {
      console.error("Task creation error:", err.response?.data || err.message);
      setAlert({ visibility: true, message: "Something went wrong", type: "error" });
    }
  };
  

  const openEdit = (task) => {
    setCurrentTask(task._id);
    setFormData({
      employeeId: task.employeeId,
      taskTitle: task.taskTitle,
      taskDescription: task.taskDescription,
      startDate: task.startDate?.slice(0, 16) || "",
      endDate: task.endDate?.slice(0, 16) || "",
      status: task.status || "Pending",
      lead: task.lead || "",
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/task/delete-task/${id}`);
      setAlert({ visibility: true, message: "Task deleted", type: "success" });
      fetchAllData();
    } catch (err) {
      setAlert({ visibility: true, message: "Delete failed", type: "error" });
    }
  };

  const columns = [
    { key: "employeeName", header: "Employee Name" },
    { key: "employeeCode", header: "Employee ID" },
    { key: "taskTitle", header: "Task Name" },
    { key: "status", header: "Task Status" },
    { key: "lead", header: "Lead" },
    { key: "action", header: "Action" },
  ];

  return (
    <>
      <div className="flex mt-20">
        <Navbar visibility={true} />
        <Sidebar />
        <CustomAlert {...alert} />
        <div className="flex-grow p-7">
          <div className="mt-6 mb-8">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-2xl font-semibold">Tasks</h1>
              <button
                onClick={() => {
                  setModalVisible(true);
                  setFormData({
                    employeeId: "",
                    taskTitle: "",
                    taskDescription: "",
                    startDate: "",
                    endDate: "",
                    status: "Pending",
                    lead: "",
                  });
                  setCurrentTask(null);
                }}
                className="ml-4 bg-blue-950 text-white px-4 py-2 rounded shadow-md hover:bg-blue-800 transition duration-200"
              >
                + Add Task
              </button>
            </div>
          </div>

          {tableTasks.length > 0 ? (
            <DataTable
              updateHandler={(id) => openEdit(tasks.find((t) => t._id === id))}
              data={tableTasks}
              columns={columns}
              exportedFileName="Tasks.csv"
            />
          ) : (
            <CircularLoader isLoading={isLoading} failure={!isLoading} data="Task Data" />
          )}
        </div>
      </div>

      <Modal isVisible={modalVisible} onClose={() => setModalVisible(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">{currentTask ? "Edit Task" : "Add Task"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Employee</label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInput}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Employee</option>
                {agents.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Lead</label>
              <select
                name="lead"
                value={formData.lead}
                onChange={handleInput}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Lead</option>
                {leads.map((lead) => (
                  <option key={lead._id} value={lead._id}>
                  { `${lead?.lead_name} - ${lead?.lead_phone}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Task Title</label>
              <input
                type="text"
                name="taskTitle"
                value={formData.taskTitle}
                onChange={handleInput}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Task Description</label>
              <textarea
                name="taskDescription"
                value={formData.taskDescription}
                onChange={handleInput}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Start Date & Time</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleInput}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">End Date & Time</label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleInput}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Task Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInput}
                className="w-full p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Task
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Task;
