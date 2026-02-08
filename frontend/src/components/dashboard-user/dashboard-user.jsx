import {Welcome} from "./dashboard-user-components/Welcome.jsx";
import {Summary} from "./dashboard-user-components/Summary section.jsx";
import {Options} from "./dashboard-user-components/options.jsx";
import {UpcomingActivity} from "./dashboard-user-components/upcomingActivity.jsx";
import {UserProfile} from "./dashboard-user-components/UserProfile.jsx";


export const DashboardUser = () => {
    return (
        <div className="page-wrapper bg-[#0D1B2A] min-h-screen px-4 sm:px-6 lg:px-8 py-4">
            <div className="space-y-4 sm:space-y-6">
                <Welcome/>
                <Summary/>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="lg:col-span-1">
                        <Options/>
                    </div>
                    <div className="lg:col-span-2">
                        <UpcomingActivity/>
                    </div>
                </div>
                <div className="p-4 sm:p-6">
                    <UserProfile/>
                </div>

            </div>
        </div>
    )
}