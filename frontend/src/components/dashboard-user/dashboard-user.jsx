import {Welcome} from "./dashboard-user-components/Welcome.jsx";
import {Summary} from "./dashboard-user-components/Summary section.jsx";
import {Options} from "./dashboard-user-components/options.jsx";
import {UpcomingActivity} from "./dashboard-user-components/upcomingActivity.jsx";


export const DashboardUser = () => {
    return (
        <div className="page-wrapper bg-[#e5e5e5] min-h-screen">
            <Welcome/>
            <Summary/>
            <div className="dash-user-op-upcoming">
                <Options/>
                <UpcomingActivity/>
            </div>

        </div>
    )
}