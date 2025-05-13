import React, { useState, useEffect } from "react";
import Sidebar from "../components/layouts/Sidebar";
import Navbar from "../components/layouts/Navbar";
import CustomAlert from "../components/alerts/CustomAlert";
import CircularLoader from "../components/loaders/CircularLoader";
import Modal from "../components/modals/Modal";
import api from "../instance/TokenInstance";
import { Dropdown } from "antd";
import { IoMdMore } from "react-icons/io";
import DataTable from "../components/layouts/Datatable";
import filterOption from "../helpers/filterOption";
import { Select } from "antd";

const CollectionArea = () => {
  const [currentCollectionArea, setCurrentCollectionArea] = useState(null);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [currentUpdateCollectionArea, setCurrentUpdateCollectionArea] =
    useState(null);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [TableCollectionArea, setTableCollectionArea] = useState([]);
  const [collectionArea, setCollectionArea] = useState([]);
  const [agentOption, setAgentOptions] = useState([]);
  const [collectionAreaData, setCollectionAreaData] = useState({
    route_name: "",
    route_description: "",
    agent_id: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 
  const [updateCollectionAreaData, setUpdateCollectionAreaData] = useState({
    route_name: "",
    route_description: "",
    agent_id: [],
  });

  const [alertConfig, setAlertConfig] = useState({
    visibility: false,
    message: "Something went wrong!",
    type: "info",
  });

  const [searchText, setSearchText] = useState("");
  const GlobalSearchChangeHandler = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCollectionAreaData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // const handleSelect = (name, arr) => {
  //   setCollectionAreaData((prev) => ({
  //     ...prev,
  //     [name]: arr,
  //   }));
  // };
  // const handleInputSelect = (name, arr) => {
  //   setUpdateCollectionAreaData((prev) => ({ ...prev, [name]: arr }));
  // };

 const handleSelect = (name, arr) => {
  // Convert array to only values if needed
  const values = arr.map((item) => (typeof item === "object" ? item.value : item));
  setCollectionAreaData((prev) => ({
    ...prev,
    [name]: Array.isArray(arr) ? arr : [],
  }));
};

const handleInputSelect = (name, arr) => {
  const values = arr.map((item) => (typeof item === "object" ? item.value : item));
  setUpdateCollectionAreaData((prev) => ({ ...prev, [name]: values }));
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateCollectionAreaData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/collection-area-request/add-collection-area-data",
        collectionAreaData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // window.location.reload();
      // alert("User Added Successfully");
      setAlertConfig({
        type: "success",
        message: "Collection Area Added Successfully",
        visibility: true,
      });

      setShowModal(false);
      // setErrors({});
      setCollectionAreaData({
        route_name: "",
        route_description: "",
        agent_id: "",
      });
    } catch (error) {
      console.error("Error adding user:", error);
      // if (
      //   error.response &&
      //   error.response.data &&
      //   error.response.data.message
      // ) {
      //   setAlertConfig({
      //     type: "error",
      //     message: `${error?.response?.data?.message}`,
      //     visibility: true,
      //   });
      // } else {
      //   setAlertConfig({
      //     type: "error",
      //     message: "An unexpected error occurred. Please try again.",
      //     visibility: true,
      //   });
      // }
    }
  };
  // useEffect(() => {
  //   const fetchAgents = async () => {
  //     try {
  //       const response = await api.get("/agent/get-agent");
  //       if (response.data) {
  //         const options = response.data.map((agent) => {
  //           return { value: agent?._id, label: agent?.name };
  //         });
  //         setAgentOptions(options);
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch agents");
  //     }
  //   };
  //   fetchAgents();
  // }, []);


  useEffect(() => {
  const fetchAgents = async () => {
    try {
      const response = await api.get("/agent/get-agent");
      if (response.data) {
        // Map to value-label pairs for the Select component
        const options = response.data.map((agent) => ({
          value: agent._id,
          label: agent.name,
        }));
        setAgentOptions(options);
      }
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    }
  };

  fetchAgents();
}, []);

  useEffect(() => {
    const fetchAreaCollection = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(
          "/collection-area-request/get-collection-area-data"
        );

        setCollectionArea(response.data);
        const collectionAreaData = response?.data.map(
          (collectionArea, index) => {
            return {
              _id: collectionArea?._id,
              id: index + 1,
              name: collectionArea?.route_name,
              description: collectionArea?.route_description,
              Agent: collectionArea?.agent_id
                ?.map((agent) => agent.name)
                .join(),
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
                              onClick={() =>
                                handleUpdateModalOpen(collectionArea?._id)
                              }
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
                              onClick={() =>
                                handleDeleteModalOpen(collectionArea?._id)
                              }
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
            };
          }
        );
        // let AreaData = AreaCollectionData.map((ele) => {
        //   if (
        //     ele?.address &&
        //     typeof ele.address === "string" &&
        //     ele?.address?.includes(",")
        //   )
        //     ele.address = ele.address.replaceAll(",", " ");
        //   return ele;
        // });
        // if (!AreaData) setTableCollectionArea(AreaCollectionData);
        setTableCollectionArea(collectionAreaData);
      } catch (error) {
        console.error("Error fetching collection area data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAreaCollection();
  }, []);

  const columns = [
    { key: "id", header: "SL. NO" },
    { key: "name", header: "Collection Area Name" },
    { key: "description", header: "Collection Area Description" },
    { key: "Agent", header: "Agent" },
    { key: "action", header: "Action" },
  ];

  const handleDeleteModalOpen = async (Id) => {
    try {
      const response = await api.get(
        `/collection-area-request/get-collection-area-data-by-id/${Id}`
      );
      setCurrentCollectionArea(response.data);
      setShowModalDelete(true);
    } catch (error) {
      console.error("Error fetching Collection area Data :", error);
    }
  };

  const handleUpdateModalOpen = async (Id) => {
    try {
      const response = await api.get(
        `/collection-area-request/get-collection-area-data-by-id/${Id}`
      );
      setCurrentUpdateCollectionArea(response?.data);
      setUpdateCollectionAreaData({
        route_name: response?.data?.route_name,
        route_description: response?.data?.route_description,
        agent_id: response?.data?.agent_id?.map((agent) => ({
          value: agent?._id,
          label: agent?.name,
        })),
      });
      setShowModalUpdate(true);
    } catch (error) {
      console.error("Error fetching collection area data:", error);
    }
  };

  // const filteredUsers = collectionArea.filter((area) =>
  //   area.route_name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const handleDeleteCollectionArea = async () => {
    if (currentCollectionArea) {
      try {
        await api.delete(
          `/collection-area-request/delete-collection-area-data-by-id/${currentCollectionArea._id}`
        );
        setAlertConfig({
          visibility: true,
          message: "User deleted successfully",
          type: "success",
        });
        setShowModalDelete(false);
        setCurrentCollectionArea(null);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(
        `/collection-area-request/update-collection-area-data-by-id/${currentUpdateCollectionArea._id}`,
        updateCollectionAreaData
      );
      setShowModalUpdate(false);
console.info(updateCollectionAreaData,"testing")

      // setAlertConfig({
      //   visibility: true,
      //   message: "Collection Area Updated Successfully",
      //   type: "success",
      // });
    } catch (error) {
      console.error("Error updating Collection Area:", error);
      //   if (
      //     error.response &&
      //     error.response.data &&
      //     error.response.data.message
      //   ) {
      //     setAlertConfig({
      //       visibility: true,
      //       message: `${error?.response?.data?.message}`,
      //       type: "error",
      //     });
      //   } else {
      //     setAlertConfig({
      //       visibility: true,
      //       message: "An unexpected error occurred. Please try again.",
      //       type: "error",
      //     });
      //   }
    }
  };

  return (
    <>
      <div>
        <div className="flex mt-20">
          <Sidebar />
          <Navbar
            onGlobalSearchChangeHandler={GlobalSearchChangeHandler}
            visibility={true}
          />
          <CustomAlert
            type={alertConfig.type}
            isVisible={alertConfig.visibility}
            message={alertConfig.message}
          />

          <div className="flex-grow p-7">
            <div className="mt-6 mb-8">
              <div className="flex justify-between items-center w-full">
                <h1 className="text-2xl font-semibold">Collection Area</h1>

                <button
                  onClick={() => {
                    setShowModal(true);
                  }}
                  className="ml-4 bg-blue-950 text-white px-4 py-2 rounded shadow-md hover:bg-blue-800 transition duration-200"
                >
                  + Add Collection Area
                </button>
              </div>
            </div>
            {TableCollectionArea?.length > 0 ? (
              <DataTable
                catcher="_id"
                updateHandler={handleUpdateModalOpen}
                data={filterOption(TableCollectionArea, searchText)}
                columns={columns}
              />
            ) : (
              <CircularLoader
                isLoading={isLoading}
                failure={TableCollectionArea.length <= 0}
                data=" Collection Area Data"
              />
            )}
          </div>
        </div>
        <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Add Collection Area
            </h3>
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="email"
                >
                  Collection Area Name
                </label>
                <input
                  type="text"
                  name="route_name"
                  value={collectionAreaData?.route_name}
                  onChange={handleChange}
                  id="name"
                  placeholder="Enter the Full Name"
                  //required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="desc"
                >
                  Collection Area Description
                </label>
                <input
                  type="text"
                  name="route_description"
                  value={collectionAreaData?.route_description}
                  onChange={handleChange}
                  id="desc"
                  placeholder="Enter the Collection Area Description"
                  //required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="agent_select"
                >
                  Collection Area Agent
                </label>
                <Select
                  mode="tags"
                  value={collectionAreaData?.agent_id || []}
                  onChange={(value) => handleSelect("agent_id", value)}
                  id="agent_select"
                  placeholder="Please select"
                  options={agentOption}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="aselect"
                  ></label>
                </div>

                <div className="w-1/2">
                  {/* <label
                    className="block mb-2 text-sm font-medium text-gray-900"
                    htmlFor="desc"
                  >
                    Collection Area Agent
                  </label>
                  <Select
                    className="w-full"
                    mode="tags"
                    placeholder="Please select"
                    // defaultValue={["a10", "c12"]}
                    // value={collectionAreaData?.agent_id}
                    // onChange={handleChange}
                    options={agentOption}
                  /> */}
                </div>
              </div>

              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2"></div>
                <div className="w-1/2"></div>
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2"></div>
                <div className="w-1/2"></div>
              </div>
              <div></div>
              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  className="w-1/4 text-white bg-blue-700 hover:bg-blue-800 border-2 border-black
              focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Save Collection Area
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
              Update Collection Area
            </h3>
            <form className="space-y-6" onSubmit={handleUpdate} noValidate>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="rname"
                >
                  Collection Area Name
                </label>
                <input
                  type="text"
                  name="route_name"
                  value={updateCollectionAreaData?.route_name}
                  onChange={handleInputChange}
                  id="rname"
                  placeholder="Enter the Collection Area Name"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="desc"
                >
                  Collection Area Description
                </label>
                <input
                  type="text"
                  name="route_description"
                  value={updateCollectionAreaData?.route_description}
                  onChange={handleChange}
                  id="desc"
                  placeholder="Enter the Collection Area Description"
                  //required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor="agent_select"
                >
                  Collection Area Agent
                </label>
                <Select
                  mode="tags"
                  onChange={(value) => handleInputSelect("agent_id", value)}
                  value={updateCollectionAreaData?.agent_id}
                  id="agent_select"
                  name="agent_id"
                  placeholder="Please select"
                  options={agentOption}
                  //required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
              </div>

              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2"></div>
                <div className="w-1/2"></div>
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="w-full"></div>
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="w-1/2"></div>
                <div className="w-1/2"></div>
              </div>
              <div></div>
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
            setCurrentCollectionArea(null);
          }}
        >
          <div className="py-6 px-5 lg:px-8 text-left">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Delete Collection Area
            </h3>
            {collectionAreaData && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDeleteCollectionArea();
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
                      {collectionAreaData?.route_name}
                    </span>{" "}
                    to confirm deletion.
                  </label>
                  <input
                    type="text"
                    id="routeName"
                    placeholder="Enter the Collection Area Name"
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
export default CollectionArea;
