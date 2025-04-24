/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Sidebar from "../components/layouts/Sidebar";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { IoMdMore } from "react-icons/io";
import { Dropdown } from "antd";
import Modal from "../components/modals/Modal";
import axios from "axios";
import api from "../instance/TokenInstance";
import DataTable from "../components/layouts/Datatable";
import CustomAlert from "../components/alerts/CustomAlert";
import Navbar from "../components/layouts/Navbar";
import filterOption from "../helpers/filterOption";
import CircularLoader from "../components/loaders/CircularLoader";

const Manager = () => {
    const [users, setUsers] = useState([]);
    const [TableAgents, setTableAgents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUpdateUser, setCurrentUpdateUser] = useState(null);
    const [errors, setErrors] = useState({});
    const [searchText, setSearchText] = useState("");
    const [isLoading,setIsLoading] = useState(false);

    const onGlobalSearchChangeHandler = (e) => {
        const { value } = e.target
        setSearchText(value)
    }

    const [alertConfig, setAlertConfig] = useState({
        visibility: false,
        message: "Something went wrong!",
        type: "info",
    });

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone_number: "",
        type: "",
    });

    const [updateFormData, setUpdateFormData] = useState({
        name: "",
        email: "",
        phone_number: "",
        type: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors((prevData) => ({
            ...prevData,
            [name]: "",
        }));
    };

    const validateForm = (type) => {
        const newErrors = {};
        const data = type === "addManager" ? formData : updateFormData;
        const regex = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[6-9]\d{9}$/,
        };

        if (!data.name.trim()) {
            newErrors.name = "Full Name is required";
        }

        if (!data.email) {
            newErrors.email = "Email is required";
        } else if (!regex.email.test(data.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!data.phone_number) {
            newErrors.phone_number = "Phone number is required";
        } else if (!regex.phone.test(data.phone_number)) {
            newErrors.phone_number = "Invalid  phone number";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValidate = validateForm("addManager");

        try {
            if (isValidate) {
                const response = await api.post("/manager/add-manager", formData, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                setShowModal(false);
                setFormData({
                    name: "",
                    email: "",
                    phone_number: "",
                    type: ""
                });
                setAlertConfig({
                    visibility: true,
                    message: "Manager Added Successfully",
                    type: "success",
                });
            }
        } catch (error) {
            console.error("Error adding manager:", error);
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setAlertConfig({
                    visibility: true,
                    message: `${error.response.data.message}`,
                    type: "error",
                });
            } else {
                setAlertConfig({
                    visibility: true,
                    message: "An unexpected error occurred. Please try again.",
                    type: "error",
                });
            }
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const response = await api.get("/manager/get-manager");
                setUsers(response.data);
                const formattedData = response.data.map((group, index) => ({
                    _id: group._id,
                    id: index + 1,
                    name: group.name,
                    phone_number: group.phone_number,
                    action: (
                        <div className="flex justify-center  gap-2">
                            {/* <button
                onClick={() => handleUpdateModalOpen(group._id)}
                className="border border-green-400 text-white px-4 py-2 rounded-md shadow hover:border-green-700 transition duration-200"
              >
                <CiEdit color="green" />
              </button> */}
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: "1",
                                            label: (
                                                <div
                                                    className="text-green-600"
                                                    onClick={() => handleUpdateModalOpen(group._id)}
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
                                                    onClick={() => handleDeleteModalOpen(group._id)}
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
                setTableAgents(formattedData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }finally{
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const columns = [
        { key: "id", header: "SL. NO" },
        { key: "name", header: "Manager Name" },
        { key: "phone_number", header: "Manager Phone Number" },
        { key: "action", header: "Action" },
    ];

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteModalOpen = async (userId) => {
        try {
            const response = await api.get(`/manager/get-manager-by-id/${userId}`);
            setCurrentUser(response.data);
            setShowModalDelete(true);
            setErrors({});
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const handleUpdateModalOpen = async (userId) => {
        try {
            const response = await api.get(`/manager/get-manager-by-id/${userId}`);
            setCurrentUpdateUser(response.data);
            setUpdateFormData({
                name: response.data.name,
                email: response.data.email,
                phone_number: response.data.phone_number,
                type: response.data.type,
            });
            setShowModalUpdate(true);
            setErrors({});
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDeleteUser = async () => {
        if (currentUser) {
            try {
                await api.delete(`/manager/delete-manager/${currentUser._id}`);
                setShowModalDelete(false);
                setCurrentUser(null);
                setAlertConfig({
                    visibility: true,
                    message: "Manager deleted successfully",
                    type: "success",
                });
            } catch (error) {
                console.error("Error deleting manager:", error);
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const isValid = validateForm();
        try {
            if (isValid) {
                const response = await api.put(
                    `/manager/update-manager/${currentUpdateUser._id}`,
                    updateFormData
                );
                setShowModalUpdate(false);
                setAlertConfig({
                    visibility: true,
                    message: "Manager Updated Successfully",
                    type: "success",
                });
            }
        } catch (error) {
            console.error("Error updating manager:", error);
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setAlertConfig({
                    visibility: true,
                    message: `${error.response.data.message}`,
                    type: "error",
                });
            } else {
                setAlertConfig({
                    visibility: true,
                    message: "An unexpected error occurred. Please try again.",
                    type: "error",
                });
            }
        }
    };

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const response = await api.get("/manager/get-manager");
                setManagers(response.data);
            } catch (error) {
                console.error("Error fetching group data:", error);
            }
        };
        fetchManagers();
    }, []);

    return (
        <>
            <div>
                <div className="flex mt-20">
                    <Navbar onGlobalSearchChangeHandler={onGlobalSearchChangeHandler} visibility={true} />
                    <Sidebar />
                    <CustomAlert
                        type={alertConfig.type}
                        isVisible={alertConfig.visibility}
                        message={alertConfig.message}
                    />

                    <div className="flex-grow p-7">
                        <div className="mt-6 mb-8">
                            <div className="flex justify-between items-center w-full">
                                <h1 className="text-2xl font-semibold">Managers</h1>
                                <button
                                    onClick={() => {
                                        setShowModal(true);
                                        setErrors({});
                                    }}
                                    className="ml-4 bg-blue-950 text-white px-4 py-2 rounded shadow-md hover:bg-blue-800 transition duration-200"
                                >
                                    + Add Manager
                                </button>
                            </div>
                        </div>
                        {TableAgents.length > 0 ? (<DataTable
                            updateHandler={handleUpdateModalOpen}
                            data={filterOption(TableAgents, searchText)}
                            columns={columns}
                            exportedFileName={`Employees-${TableAgents.length > 0
                                ? TableAgents[0].name +
                                " to " +
                                TableAgents[TableAgents.length - 1].name
                                : "empty"
                                }.csv`}
                        />) : <CircularLoader isLoading={isLoading} failure={TableAgents.length <= 0 } data="Managers Data"/>}
                    </div>
                </div>

                <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
                    <div className="py-6 px-5 lg:px-8 text-left">
                        <h3 className="mb-4 text-xl font-bold text-gray-900">
                            Add Manager
                        </h3>
                        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                            <div>
                                <label
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                    htmlFor="email"
                                >
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    id="name"
                                    placeholder="Enter the Full Name"
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>
                            <div className="flex flex-row justify-between space-x-4">
                                <div className="w-1/2">
                                    <label
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                        htmlFor="date"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        id="text"
                                        placeholder="Enter Email"
                                        required
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>
                                <div className="w-1/2">
                                    <label
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                        htmlFor="date"
                                    >
                                        Phone Number
                                    </label>
                                    <input
                                        type="number"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        id="text"
                                        placeholder="Enter Phone Number"
                                        required
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                                    />
                                    {errors.phone_number && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.phone_number}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="w-full">
                                <label
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                    htmlFor="category"
                                >
                                    Select manager type
                                </label>
                                <select
                                    name="type"
                                    id="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                                >
                                    <option value="">Select manager type</option>
                                    <option value="reporting">Reporting Manager</option>
                                </select>
                            </div>
                            <div className="w-full flex justify-end">
                                <button
                                    type="submit"
                                    className="w-1/4 text-white bg-blue-700 hover:bg-blue-800
              focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border-2 border-black"
                                >
                                    Save Manager
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
                            Update manager
                        </h3>
                        <form className="space-y-6" onSubmit={handleUpdate} noValidate>
                            <div>
                                <label
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                    htmlFor="email"
                                >
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={updateFormData.name}
                                    onChange={handleInputChange}
                                    id="name"
                                    placeholder="Enter the Full Name"
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>
                            <div className="flex flex-row justify-between space-x-4">
                                <div className="w-1/2">
                                    <label
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                        htmlFor="date"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={updateFormData.email}
                                        onChange={handleInputChange}
                                        id="text"
                                        placeholder="Enter Email"
                                        required
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>
                                <div className="w-1/2">
                                    <label
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                        htmlFor="date"
                                    >
                                        Phone Number
                                    </label>
                                    <input
                                        type="number"
                                        name="phone_number"
                                        value={updateFormData.phone_number}
                                        onChange={handleInputChange}
                                        id="text"
                                        placeholder="Enter Phone Number"
                                        required
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                                    />
                                    {errors.phone_number && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.phone_number}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="w-full">
                                <label
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                    htmlFor="category"
                                >
                                    Select manager type
                                </label>
                                <select
                                    name="type"
                                    id="type"
                                    value={updateFormData.type}
                                    onChange={handleInputChange}
                                    required
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                                >
                                    <option value="">Select Group</option>
                                    <option value="reporting">Reporting Manager</option>
                                </select>
                            </div>
                            <div className="w-full flex justify-end">
                                <button
                                    type="submit"
                                    className="w-1/4 text-white bg-blue-700 hover:bg-blue-800 border-2 border-black
              focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
                        setCurrentUser(null);
                    }}
                >
                    <div className="py-6 px-5 lg:px-8 text-left">
                        <h3 className="mb-4 text-xl font-bold text-gray-900">
                            Delete Manager
                        </h3>
                        {currentUser && (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleDeleteUser();
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
                                            {currentUser.name}
                                        </span>{" "}
                                        to confirm deletion.
                                    </label>
                                    <input
                                        type="text"
                                        id="groupName"
                                        placeholder="Enter the manager Full Name"
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

export default Manager;
