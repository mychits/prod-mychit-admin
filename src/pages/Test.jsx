import React, { useEffect, useState } from 'react'
import Datatable from '../components/layouts/Datatable'
import api from '../instance/TokenInstance';

const Test = () => {
    const [groups, setGroups] = useState([]);
    const data = [
        {
            id: 1,
            name: "John Doe",
            type: 30,
            value: "New York",
            installment: 2000,
            members: 50,
            action: ""
        },
    ];

    const columns = [
        { key: 'id', header: 'SL. NO' },
        { key: 'name', header: 'Group Name' },
        { key: 'type', header: 'Group Type' },
        { key: 'value', header: 'Group Value' },
        { key: 'installment', header: 'Group Installment' },
        { key: 'members', header: 'Group Members' },
        { key: 'action', header: 'Action' },
    ];

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await api.get("/group/get-group-admin");
                const formattedData = response.data.map((group, index) => ({
                    id: index + 1,
                    name: group.group_name,
                    type: group.group_type,
                    value: group.group_value,
                    installment: group.group_install,
                    members: group.group_members,
                    action: ""
                }));
                setGroups(formattedData);
            } catch (error) {
                console.error("Error fetching group data:", error);
            }
        };
        fetchGroups();
    }, []);

    return (
        <>
            <div className='mt-20 m-10'>
                <Datatable data={groups} columns={columns} />
            </div>
        </>
    )
}

export default Test