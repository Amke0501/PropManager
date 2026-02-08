/**
 * Admin Dashboard Overview Component
 * Displays two main cards:
 * 1. Activity Overview - Shows tenant and property statistics
 * 2. Finances - Shows revenue, expenses, and profit information
 * 
 * This component fetches real data from backend APIs and updates
 * automatically when component mounts
 */

import React, { useEffect, useState } from "react";
import { Banknote } from "lucide-react";
import { propertiesAPI, paymentsAPI } from "../../../Services/api";

export const Overview = () => {
    // Activity statistics state
    const [stats, setStats] = useState({
        tenants: 0,              // Unique count of tenants with properties
        availableUnits: 0,       // Properties without assigned tenants
        totalProperties: 0,      // Total number of properties
        pendingApplications: 0,  // Placeholder for future applications feature
    });

    // Finance statistics state
    const [finances, setFinances] = useState({
        totalIncome: 0,          // Sum of all rent collected
        expenses: 0,             // Placeholder for expenses feature
        outstanding: 0,          // Outstanding/overdue payments
        netProfit: 0             // Total Income - Expenses
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchStats = async (isMountedRef) => {
        setLoading(true);
        setError("");

        try {
            // Fetch properties and payments data in parallel
            const [propertiesResponse, paymentsResponse] = await Promise.all([
                propertiesAPI.getAll().catch(() => ({ data: [] })),
                paymentsAPI.getAll().catch(() => ({ data: [] }))
            ]);

            const properties = propertiesResponse?.data ?? propertiesResponse ?? [];
            const payments = paymentsResponse?.data ?? paymentsResponse ?? [];

            // Calculate activity statistics
            const availableUnits = properties.filter((p) => p.tenant_id == null).length;
            const totalProperties = properties.length;
            
            // Get unique tenant count using Set to avoid duplicates
            const tenantIds = new Set(
                properties
                    .filter((p) => p.tenant_id != null)
                    .map((p) => p.tenant_id)
            );

            // Calculate financial statistics
            const totalIncome = payments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
            const currentMonth = new Date().toISOString().slice(0, 7);
            const paidThisMonth = payments
                .filter((payment) => !payment.month || payment.month === currentMonth)
                .reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
            const totalDue = properties
                .filter((p) => p.tenant_id != null)
                .reduce((sum, p) => sum + (parseFloat(p.rent) || 0), 0);
            const outstanding = Math.max(totalDue - paidThisMonth, 0);
            const expenses = 0; // TODO: Add expenses table/feature
            const netProfit = totalIncome - expenses;

            if (isMountedRef.current) {
                setStats({
                    tenants: tenantIds.size,
                    availableUnits,
                    totalProperties,
                    pendingApplications: 0, // TODO: Add applications feature
                });

                setFinances({
                    totalIncome,
                    expenses,
                    outstanding,
                    netProfit
                });
            }
        } catch (err) {
            if (isMountedRef.current) {
                setError("Unable to load overview stats.");
                console.error("Overview fetch error:", err);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const isMountedRef = { current: true };

        fetchStats(isMountedRef);
        const intervalId = setInterval(() => fetchStats(isMountedRef), 30000);

        return () => {
            isMountedRef.current = false;
            clearInterval(intervalId);
        };
    }, []);

    // Activity overview card data
    const actoverviewstats = [
        {
            number: stats.tenants,
            description: "Tenants",
        },
        {
            number: stats.availableUnits,
            description: "Available Units",
        },
        {
            number: stats.totalProperties,
            description: "Total Properties",
        },
        {
            number: stats.pendingApplications,
            description: "Pending Applications",
        },
    ];

    // Finance card data - now displays real values
    const financeoverview = [
        {
            amount: `R${finances.totalIncome.toFixed(2)}`,
            description: "Total Income",
        },
        {
            amount: `R${finances.expenses.toFixed(2)}`,
            description: "Expenses",
        },
        {
            amount: `R${finances.outstanding.toFixed(2)}`,
            description: "Outstanding Payments",
        },
        {
            amount: `R${finances.netProfit.toFixed(2)}`,
            description: "Net Profit",
        },
    ];

    return (
        <div className="mt-6 w-full">
            <div className="w-full max-w-md lg:max-w-none border-2 transition-all duration-200 hover:bg-[#e0e0e0] border-[#e0e0e0] bg-white rounded-2xl">
                <div className="font-medium px-4 py-2 text-lg sm:text-xl flex items-center gap-2">
                    <span>Activity Overview</span>
                    {loading && <span className="text-xs text-gray-500">Loading...</span>}
                </div>
                {error && (
                    <div className="px-4 pb-2 text-xs text-red-600">{error}</div>
                )}
                <div className="grid grid-cols-2 grid-flow-rows-2 content-center items-center justify-center align-middle">
                    {actoverviewstats.map((actoverviewstat, index) => (
                        <div key={index}>
                            <div className="flex flex-col px-4 py-3">
                                <div className="font-semibold text-lg sm:text-2xl">
                                    {actoverviewstat.number}
                                </div>
                                <div className="text-xs sm:text-sm">{actoverviewstat.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                <div className="w-full max-w-md lg:max-w-none transition-all duration-200 hover:bg-[#e0e0e0] border-2 border-[#e0e0e0] bg-white rounded-2xl">
                    <div className="font-medium px-4 py-2 text-lg sm:text-xl flex items-center gap-2">
                        <Banknote className="hover:stroke-emerald-600" />
                        <div>Finances</div>
                    </div>
                    <div className="grid grid-cols-2 grid-flow-rows-2 content-center items-center justify-center align-middle">
                        {financeoverview.map((financeoverview, index) => (
                            <div key={index}>
                                <div className="flex flex-col px-4 py-3">
                                    <div className="font-semibold text-lg sm:text-2xl">
                                        {financeoverview.amount}
                                    </div>
                                    <div className="text-xs sm:text-sm">{financeoverview.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};