import {Welcome} from "./dashboard-admin-components/Welcome.jsx";
import {Summary} from "./dashboard-admin-components/Summary section.jsx";


export const DashboardAdmin = () => {
    return (
        <div className="page-wrapper bg-[#e5e5e5] h-screen">
            <Welcome/>
            <Summary/>
        </div>
    )
}