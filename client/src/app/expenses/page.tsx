"use client";

import {
  ExpenseByCategorySummary,
  useGetExpensesByCategoryQuery,
} from "@/state/api";
import React, { useMemo, useState } from "react";
import Header from "../(components)/Header";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type AggregatedDataItem = {
  name: string;
  colour?: string;
  amount: number;
};

type AggregatedData = {
  [category: string]: AggregatedDataItem;
};

const Expenses = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data, isLoading, isError } = useGetExpensesByCategoryQuery();

  const expenses = useMemo(() => data ?? [], [data]);

  const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const aggregatedDate: AggregatedDataItem[] = useMemo(() => {
    const filtered: AggregatedData = expenses.filter(
      (data: ExpenseByCategorySummary) => {
        const matchesCategory = selectedCategory === "All" ||
          data.category === selectedCategory;
        const dataDate = parseDate(data.date);
        const matchesDate = !startDate || !endDate ||
          (dataDate >= startDate && dataDate <= endDate);
        return matchesCategory && matchesDate;
      },
    ).reduce((acc: AggregatedData, data: ExpenseByCategorySummary) => {
      const amount = parseInt(data.amount);
      if (!acc[data.category]) {
        acc[data.category] = { name: data.category, amount: 0 };
        acc[data.category].colour = `#${
          Math.floor(Math.random() * 16777215).toString(16)
        }`;
        acc[data.category].amount += amount;
      }
      return acc;
    }, {});
    return Object.values(filtered);
  }, [expenses, selectedCategory, startDate, endDate]);

  const classNames = {
    label: "block text-sm font-medium !text-gray-700",
    selectInput:
      "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white !text-gray-700",
  };

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
    <div>
      {/* HEADER */}
      <div className="mb-5">
        <Header name="Expenses" />
        <p className="text-sm text-gray-500">
          A visual representation of expenses of over time
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full md:w-1/3 bg-white shadow rounded-lg p-6 ">
          <h3 className="text-lg font-semibold mb-4">
            Filter By Category and Date
          </h3>
          <div className="space-y-4">
            {/* CATEGORY */}
            <div>
              <label htmlFor="category" className={classNames.label}>
                Category
              </label>
              <select
                name="category"
                id="category"
                className={classNames.selectInput}
                defaultValue="All"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>All</option>
                <option>Office</option>
                <option>Professional</option>
                <option>Salaries</option>
              </select>
            </div>
            {/* START DATE */}
            <div>
              <label htmlFor="start-date" className={classNames.label}>
                Start Date
              </label>
              <input
                type="date"
                name="start-date"
                id="start-date"
                className={classNames.selectInput}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            {/* END DATE */}
            <div>
              <label htmlFor="end-date" className={classNames.label}>
                End Date
              </label>
              <input
                type="date"
                name="end-date"
                id="end-date"
                className={classNames.selectInput}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* CHART */}
        <div className="flex-grow bg-white shadow rounded-lg p-4 md:p-6">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={aggregatedDate}
                cx="50%"
                cy="50%"
                label
                outerRadius={150}
                fill="#8884d8"
                dataKey="amount"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {aggregatedDate.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === activeIndex
                      ? "rgb(29, 18, 216"
                      : entry.colour}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
