import React from "react";
import Header from "./_components/Header";
import UserTable from "./_components/UserTable";
import Pagination from "./_components/Pagination";

const ReviewInstructorPage = () => {
  return (
    <div className="p-6">
      <Header />
      <h2 className="text-2xl font-semibold mb-4 mt-2">Browse The User</h2>
      <UserTable />
      <Pagination />
    </div>
  );
};

export default ReviewInstructorPage;
