import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "inspector";

export interface Product {
    productId: string;
    name: string;
    price: number;
    rating?: number;
    stockQuantity: number;
}

export interface NewProduct {
    name: string;
    price: number;
    rating?: number;
    stockQuantity: number;
}

export interface SalesSummary {
    salesSummaryId: string;
    totalValue: number;
    changePercentage?: number;
    date: string;
}

export interface PurchaseSummary {
    purchaseSummaryId: string;
    totalPurchased: number;
    changePercentage?: number;
    date: string;
}

export interface ExpenseSummary {
    expenseSummaryId: string;
    totalExpenses: number;
    date: string;
}

export interface ExpenseByCategorySummary {
    expenseByCategorySummaryId: string;
    category: string;
    amount: string;
    date: string;
}

export interface DashboardMetrics {
    popularProducts: Product[];
    salesSummary: SalesSummary[];
    purchaseSummary: PurchaseSummary[];
    expenseSummary: ExpenseSummary[];
    expenseByCategorySummary: ExpenseByCategorySummary[];
}

export interface User {
    userId: string;
    name: string;
    email: string;
}

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    }),
    reducerPath: "api",
    tagTypes: ["DashboardMetrics", "GetProducts", "GetUsers", "GetExpenses"],
    endpoints: (build) => (
        {
            getDashboardMetrics: build.query<DashboardMetrics, void>({
                query: () => "/dashboard",
                providesTags: ["DashboardMetrics"],
            }),
            getProducts: build.query<Product[], string | void>({
                query: (search) => ({
                    url: "/products",
                    params: search ? { search } : {},
                }),
                providesTags: ["GetProducts"],
            }),
            createProduct: build.mutation<Product, NewProduct>({
                query: (newProduct) => ({
                    url: "/products",
                    method: "POST",
                    body: newProduct,
                }),
                invalidatesTags: ["GetProducts"],
            }),
            getUsers: build.query<User[], void>({
                query: () => "/users",
                providesTags: ["GetUsers"],
            }),
            getExpensesByCategory: build.query<
                ExpenseByCategorySummary[],
                void
            >({
                query: () => "/expenses",
                providesTags: ["GetExpenses"],
            }),
        }
    ),
});

export const {
    useGetDashboardMetricsQuery,
    useGetProductsQuery,
    useCreateProductMutation,
    useGetUsersQuery,
    useGetExpensesByCategoryQuery,
} = api;
