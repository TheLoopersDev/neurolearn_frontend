import React from "react";
import ReviewTable from '@/components/review-common/ReviewTable';
import ReviewTableRow from '@/components/review-common/ReviewTableRow';
import { Eye, Trash2 } from 'lucide-react';

const users = Array(10).fill({
  avatar: "/assets/images/avatar.png",
  name: "Dao Tuan Kiet",
  email: "kietdqt170088@gmail.com",
  companyName: "Academix",
  requestDate: "05 Jan, 2025",
});

const headers = [
  { label: 'User', className: 'col-span-3' },
  { label: 'Company Name', className: 'col-span-3' },
  { label: 'Request Date', className: 'col-span-3' },
  { label: 'Progress', className: 'col-span-2' },
  { label: '', className: 'col-span-1' },
];

const UserTable = () => {
  return (
    <ReviewTable headers={headers}>
      {users.map((user, idx) => (
        <ReviewTableRow key={idx} index={idx}>
          {/* User */}
          <div className="col-span-3 flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm" />
            <div>
              <div className="font-semibold text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
          {/* Company Name */}
          <div className="col-span-3 flex items-center">
            <span className="text-gray-700 font-medium">{user.companyName}</span>
          </div>
          {/* Request Date */}
          <div className="col-span-3 flex items-center">
            <span className="text-gray-700 font-medium">{user.requestDate}</span>
          </div>
          {/* Progress (Eye Icon) */}
          <div className="col-span-2 flex items-center justify-center">
            <button className="p-2 rounded-full hover:bg-blue-50 transition-colors group" title="View Details">
              <Eye className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
            </button>
          </div>
          {/* Actions (Delete Icon) */}
          <div className="col-span-1 flex items-center justify-center">
            <button className="p-2 rounded-full hover:bg-orange-50 transition-colors group" title="Delete Request">
              <Trash2 className="w-5 h-5 text-orange-400 group-hover:text-orange-500" />
            </button>
          </div>
        </ReviewTableRow>
      ))}
    </ReviewTable>
  );
};

export default UserTable; 