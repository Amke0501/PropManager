import { Welcome } from "./dashboard-admin-components/Welcome.jsx";
import { Summary } from "./dashboard-admin-components/Summary section.jsx";
import { Overview } from "./dashboard-admin-components/overview.jsx";
import { UpcomingActivity } from "./dashboard-admin-components/upcomingActivity.jsx";
import { PropertiesManager } from "./dashboard-admin-components/PropertiesManager.jsx";

export const DashboardAdmin = () => {
    return (
        <div className="page-wrapper bg-[#e5e5e5] min-h-screen">
            <Welcome/>
            <Summary/>
            <div className="flex gap-6">
                <Overview/>
                <UpcomingActivity/>
            </div>
            <PropertiesManager/>
        </div>
    )
}