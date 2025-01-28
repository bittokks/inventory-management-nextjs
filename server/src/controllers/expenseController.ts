import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getExpensesByCategory = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const expensesByCategorySummaryRaw = await prisma.expenseByCategory
            .findMany({
                orderBy: {
                    date: "desc",
                },
            });

        const expenseByCategorySummary = expensesByCategorySummaryRaw.map((
            expense,
        ) => ({
            ...expense,
            amount: expense.amount.toString(),
        }));

        res.json(expenseByCategorySummary);
    } catch (e) {
        res.status(500).json({ message: "Error fetching expenses summary" });
    }
};
