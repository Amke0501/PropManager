import {Header} from "../components/Header/Header.jsx";
//import {DashboardAdmin} from "../components/dashboard-admin/dashboard-admin.jsx";
// should DashboardAdmin be in the landing page?
import {Link} from "react-router-dom";

export const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50">  {/*Haven't decided on the colour scheme yet*/}
        <Header />
        {/*<DashboardAdmin/>*/}

        {/*HERO SECTION*/}
        <section className="bg-[#e5e5e5] text-white py-20">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h1 className="text-5xl font-bold mb-6 text-black">
                    Prop.Manger
                </h1>
                <p className="text-xl mb-8 text-black">
                    We manage properties, liase with tenants and attend to all related maintenance request so that that you can focus on what matters most.
                </p>

                {/*BUTTONS*/}
                <div className="flex gap-4 justify-center">

                  {/*SIGN UP BUTTON*/}
                  <Link to="/signup">  
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                    Sign Up
                  </button>
                   </Link>
                  {/*LOGIN BUTTON*/} 
                  <Link to="/login">
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                    Login
                  </button>
                  </Link>

                </div>
            </div>
        </section>

        {/*FUNCTIONS/FEATURES SECTION*/}
        <section className="py-20 px-6 bg-blue-600">
            <div className="max-w-7xl mx-auto">

                {/*FUNCTIONS/FEATURES */}
                <h2 className="text-4xl font-bold text-center mb-4 text-black">
                    Property management made easy. Manage smater and rent better. 
                </h2>
                <p className="text-center text-black mb-12">
                    Smart tools for managing properties with ease, all on one platform.
                </p>

                {/*FUNCTIONS/FEATURES GRID*/}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/*FEATURE 1*/}
                    <div className="bg-[#e5e5e5] p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <div className="text-5xl mb-4">🏢</div> {/*used windows key and . to get emoji*/}
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                            Properties
                        </h3>
                        <p className="text-gray-600">
                            Manage all your properties from a single dashboard with ease. 
                        </p>
                    </div>

                    {/*FEATURE 2*/}
                    <div className="bg-[#e5e5e5] p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <div className="text-5xl mb-4">👥</div> {/*used windows key and . to get emoji*/}
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                            Tenants
                        </h3>
                        <p className="text-gray-600">
                            Ensure a smooth rental experience by tracking and verifying tenants and leases all in one place.
                        </p>
                    </div>

                    {/*FEATURE 3*/}
                    <div className="bg-[#e5e5e5] p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <div className="text-5xl mb-4">💸</div> {/*used windows key and . to get emoji*/}
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                            Rent Payments
                        </h3>
                        <p className="text-gray-600">
                            Ensure simple, transparent rent tracking and payments; and provide detailed financial reports.
                        </p>
                    </div>

                    {/*FEATURE 4*/}
                    <div className="bg-[#e5e5e5] p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <div className="text-5xl mb-4">⛏️</div> {/*used windows key and . to get emoji*/}
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
                    Get started with Join Prop.Manager and get started today!
                </p>
                
            </div>
        </section>

        {/*FOOTER SECTION*/}
        <footer className="bg-gray-800 text-white py-8 px-6">
            <div className="max-w-7xl mx-autto text-center">
                <p className="text-gray-400">
                    Prop.Manager. Built for property management 
                </p>
                
            </div>
        </footer>


        </div>
    )
}