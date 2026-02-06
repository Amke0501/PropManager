import {Banknote} from "lucide-react";

const actoverviewstats = [
    {
        number: 0,
        description: "Tenants",
    },
    {
        number: 0,
        description: "Available Units",
    },
    {
        number: 0,
        description: "Units occupied",
    },
    {
        number: 0,
        description: "Pending Applications",
    },
]

const financeoverview = [
    {
      amount: 0,
      description: "Total Income",
    },
    {
      amount: 0,
      description: "Expenses",
    },
    {
      amount: 0,
      description: "Outstanding Payments",
    },
    {
      amount: 0,
      description: "Net Profit",
    },
]

export const Overview = () => {
    return (
        <div className="mt-6">
            <div className="overview-blocks aspect-video border-2 transition-all duration-200 hover:bg-[#e0e0e0] border-[#e0e0e0] bg-white rounded-2xl" >
                <div className="font-medium px-4 py-2 text-xl">Activity Overview</div>
                <div className="grid grid-cols-2 grid-flow-rows-2 content-center items-center justify-center align-middle">
                    {actoverviewstats.map((actoverviewstat, index) => (
                        <div key={index}>
                            <div className="">
                                <div className="flex flex-col px-4 py-3">
                                    <div className="font-semibold text-2xl">{actoverviewstat.number}</div>
                                    {actoverviewstat.description}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                <div className="overview-blocks aspect-video transition-all duration-200  hover:bg-[#e0e0e0] border-2 border-[#e0e0e0] bg-white rounded-2xl" >
                    <div className="font-medium px-4 py-2 text-xl flex items-center gap-2"><Banknote className="hover:stroke-emerald-600"/> <div>Finances</div></div>
                    <div className="grid grid-cols-2 grid-flow-rows-2 content-center items-center justify-center align-middle">
                        {financeoverview.map((financeoverview, index) => (
                            <div key={index}>
                                <div className="">
                                    <div className="flex flex-col px-4 py-3">
                                        <div className="font-semibold text-2xl">{financeoverview.amount}</div>
                                        {financeoverview.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}