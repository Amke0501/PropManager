
//import {DashboardAdmin} from "../components/dashboard-admin/dashboard-admin.jsx";
// should DashboardAdmin be in the landing page?
import {Link} from "react-router-dom";
import {HomeHeader} from "../components/Header/homeheader.jsx";
import {ArrowDown, Banknote, Building2, Users, WrenchIcon} from "lucide-react";
import {Footer} from "../components/Footer/footer.jsx";

export const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50">  {/*Haven't decided on the colour scheme yet*/}
        <HomeHeader />
        {/*<DashboardAdmin/>*/}

        {/*HERO SECTION*/}
            <section id="hero" className="relative min-h-screen bg-img text-white overflow-hidden">
                {/* blur + dark overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                {/* content */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 min-h-screen flex flex-col items-center justify-center text-center pt-24">

                    <p className="text-xl max-w-2xl mb-10 text-[#E1E2E1]">
                        Property management made easy so that you can focus on what matters most
                    </p>

                    {/* buttons */}
                    <div className="flex gap-4">
                        <Link to="/signup">
                            <button className="bg-[#1B3B6F] text-[#E1E2E1] px-8 py-3 rounded-lg font-semibold hover:bg-[#E1E2E1] hover:text-black transition">
                                Sign Up
                            </button>
                        </Link>

                        <Link to="/login">
                            <button className="bg-[#1B3B6F] text-[#E1E2E1] px-8 py-3 rounded-lg font-semibold hover:bg-[#E1E2E1] hover:text-black transition">
                                Login
                            </button>
                        </Link>
                    </div>

                    {/* arrow pinned to bottom */}
                    <div className="absolute bottom-10 flex flex-col items-center animate-bounce text-[#E1E2E1]">
                        <span className="text-sm mb-2">view more</span>
                        <ArrowDown />
                    </div>
                </div>
            </section>


            {/*FUNCTIONS/FEATURES SECTION*/}
        <section className="py-20 px-6 bg-[#E1E2E1]">
            <div className="max-w-7xl mx-auto">

                {/*FUNCTIONS/FEATURES */}
                <h2 className="text-4xl font-bold text-center mb-4 text-black">
                    Property management made easy. Manage smarter and rent better.
                </h2>
                <p className="text-center text-black mb-12">
                    Smart tools for managing properties with ease, all on one platform.
                </p>

                {/*FUNCTIONS/FEATURES GRID*/}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/*FEATURE 1*/}
                    <div className="bg-[#e5e5e5] p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <div className="text-5xl mb-4"><Building2 className="size-12"/></div> {/*🏢used windows key and . to get emoji*/}
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                            Properties
                        </h3>
                        <p className="text-gray-600">
                            Manage all your properties from a single dashboard with ease. 
                        </p>
                    </div>

                    {/*FEATURE 2*/}
                    <div className="bg-[#e5e5e5] p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <div className="text-5xl mb-4"><Users className="size-12"/></div> {/*👥used windows key and . to get emoji*/}
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                            Tenants
                        </h3>
                        <p className="text-gray-600">
                            Ensure a smooth rental experience by tracking and verifying tenants and leases all in one place.
                        </p>
                    </div>

                    {/*FEATURE 3*/}
                    <div className="bg-[#e5e5e5] p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <div className="text-5xl mb-4"><Banknote className="size-12"/></div> {/*💸used windows key and . to get emoji*/}
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                            Rent Payments
                        </h3>
                        <p className="text-gray-600">
                            Ensure simple, transparent rent tracking and payments; and provide detailed financial reports.
                        </p>
                    </div>

                    {/*FEATURE 4*/}
                    <div className="bg-[#e5e5e5] p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <div className="text-5xl mb-4"><WrenchIcon className="size-12"/></div> {/*⛏️used windows key and . to get emoji*/}
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                            Maintenance
                        </h3>
                        <p className="text-gray-600">
                            Report, track and resolve issues faster through maintenance requests.
                        </p>
                    </div>

                </div>

            </div>
        </section>

        {/*CALL TO ACTION SECTION*/}
        <section className="bg-[#e5e5e5] text-white py-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4 text-black">
                 Ready to simplify your property management and maximize on your returns?
                </h2>
                <p className="text-xl mb-8 text-black">
                    Get started and join Prop.Manager today!
                </p>
                
            </div>
        </section>

        {/*FOOTER SECTION*/}
        <div>
            <Footer/>
        </div>
        </div>
    )
}