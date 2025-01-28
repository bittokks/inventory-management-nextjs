"use client";

import React from "react";

import Header from "@/app/(components)/Header";
import { useGetProductsQuery } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { createTheme } from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation";

const theme = createTheme({
  mixins: {
    MuiDataGrid: {
      // Pinned columns sections
      pinnedBackground: "#340606",
      // Headers, and top & bottom fixed rows
      containerBackground: "#343434",
    },
  },
});

const Inventory = () => {
  const { data, isLoading, isError } = useGetProductsQuery();

  const columns: GridColDef[] = [
    {
      field: "productId",
      headerName: "ID",
      width: 100,
      valueFormatter: (value, row) => row.productId.toUpperCase(),
    },
    {
      field: "name",
      headerName: "Product Name",
      width: 200,
    },
    {
      field: "price",
      headerName: "Price",
      width: 110,
      type: "number",
      valueGetter: (value, row) => `$${row.price}`,
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 110,
      type: "number",
      valueGetter: (value, row) => row.rating ? row.rating : "N/A",
    },
    {
      field: "stockQuantity",
      headerName: "Stock Quantity",
      width: 150,
      type: "number",
      //headerClassName: "bg-white !text-gray-700",
    },
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
        Failed to fetch products!
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header name="Inventory" />
      <DataGrid
        columns={columns}
        rows={data}
        getRowId={(row) => row.productId}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />
    </div>
  );
};

export default Inventory;
