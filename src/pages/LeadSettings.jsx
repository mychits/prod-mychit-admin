import { useEffect, useState } from 'react'
import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BsPersonCheck } from "react-icons/bs";
import { IoPeopleOutline } from "react-icons/io5";
import { RiAdminLine } from "react-icons/ri";
import { MdAppSettingsAlt } from "react-icons/md";

const data = [
    { title: 'Designation', color: 'bg-blue-200', path: '/designation', icon: <IoPeopleOutline size={35} />, },
    { title: 'Administrative Privileges', color: 'bg-red-200', path: '/administrative-privileges', icon: <RiAdminLine size={35} />, },
    { title: 'Admin Access Rights', color: 'bg-purple-200', path: '/admin-access-rights', icon: <BsPersonCheck size={35} />, },
    { title: 'Mobile Access', color: 'bg-green-200', path: 'app-settings/groups/mobile-access', icon: <MdAppSettingsAlt size={25} />, },
];

const LeadSettings = () => {
    const navigate = useNavigate();
    const [onload, setOnload] = useState(true)

useEffect(() => {
  const timer = setTimeout(() => {
    setOnload(false);
  }, 200);

  return () => {
    clearTimeout(timer); 
  };
}, []);
    const [clickedIndex, setClickedIndex] = useState(null);
    const handleCardClick = (index, path) => {
        setClickedIndex(index);
        setTimeout(() => {
            navigate(path);
        }, 200);
    };
    return (
        <div className="flex-grow p-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full ">
                {data.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleCardClick(index, item.path)}
                        className={`${onload ? "-translate-y-48" : "translate-y-10"}
          relative h-16 rounded-3xl text-white cursor-pointer
          flex items-center justify-center
          transform transition-all duration-500 ease-in-out
          ${item.color}
          ${clickedIndex === index ? 'scale-95 brightness-110' : 'hover:scale-105 '}
        transition duration-[${(index * 1) * 300}ms] ease-in-out `}
                    >

                        <Card
                            bordered={false}
                            className="bg-transparent w-full h-full flex items-center justify-center shadow-none  "
                        >
                            <h3 className="text-lg font-semibold flex items-center gap-3">
                                {item.icon}
                                {item.title}
                            </h3>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LeadSettings