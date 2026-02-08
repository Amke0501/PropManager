import { Welcome } from "./dashboard-admin-components/Welcome.jsx";
import { Summary } from "./dashboard-admin-components/Summary section.jsx";
import { Overview } from "./dashboard-admin-components/overview.jsx";
import { UpcomingActivity } from "./dashboard-admin-components/upcomingActivity.jsx";
import { PropertiesManager } from "./dashboard-admin-components/PropertiesManager.jsx";

export const DashboardAdmin = () => {
    return (
        <div className="page-wrapper bg-[#0D1B2A] min-h-screen px-4 sm:px-6 lg:px-8 py-4">
            <div className="space-y-4 sm:space-y-6">
                <Welcome/>
                <Summary/>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="lg:col-span-1">
                        <Overview/>
                    </div>
                    <div className="lg:col-span-2">
                        <UpcomingActivity/>
                    </div>
                </div>
                <PropertiesManager/>
            </div>
        </div>
    )
}