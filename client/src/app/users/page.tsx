"use client";

import React from "react";

import Header from "@/app/(components)/Header";
import { useGetUsersQuery } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const Users = () => {
  const { data, isLoading, isError } = useGetUsersQuery();

  const columns: GridColDef[] = [
    {
      field: "userId",
      headerName: "ID",
      width: 200,
      valueFormatter: (value, row) => row.userId.toUpperCase(),
    },
    { field: "name", headerName: "Name", width: 100 },
    { field: "email", headerName: "E-mail", width: 200 },
  ];

  if (isLoading) {
    return (
      <div className="py-5">
        Loading...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center text-red-500 py-5">
        Failed to fetch users!
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header name="Users" />

      <DataGrid
        columns={columns}
        rows={data}
        getRowId={(row) => row.userId}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />
    </div>
  );
};

export default Users;
