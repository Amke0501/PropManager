import {Header} from "../components/Header/Header.jsx";
//import {DashboardAdmin} from "../components/dashboard-admin/dashboard-admin.jsx";
// should DashboardAdmin be in the landing page?

export const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50">  {/*Haven't decided on the colour scheme yet*/}
        <Header />
        {/*<DashboardAdmin/>*/}

        {/*HERO SECTION*/}
        <section className="bg-gradient-to-r from-blue-800 text-white py-20">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h1 className="text-5xl font-bold mb-6">
                    Prop.Manger
                </h1>
                <p className="text-xl mb-8 text-blue-100">
                    We manage properties, liase with tenants and attend to all related maintenance request so that that you can focus on what matters most.
                </p>

                {/*BUTTONS*/}
                <div className="flex gap-4 justify-center">

                  {/*SIGN UP BUTTON*/}  
                  <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                    Sign Up
                  </button>

                  {/*LOGIN BUTTON*/}  
                  <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                    Login
                  </button>

                </div>
            </div>
        </section>

        {/*FUNCTIONS/FEATURES SECTION*/}
        <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">

                {/*FUNCTIONS/FEATURES */}
                <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
                    All things property related 
                </h2>
                <p className="text-center text-gray-600 mb-12">
                    Our services are built to assist with property management from start to finish.
                </p>

                {/*FUNCTIONS/FEATURES GRID*/}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/*FEATURE 1*/}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <div className="text-5xl mb-4">🏢</div> {/*used windows key and . to get emoji*/}
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                            Properties
                        </h3>
                        <p className="text-gray-600">
                            We manage all your properties in one place, making it easy
                        </p>
                    </div>

                    {/*FEATURE 2*/}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <div className="text-5xl mb-4">👥</div> {/*used windows key and . to get emoji*/}
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                            Tenants
                        </h3>
                        <p className="text-gray-600">
                            We verify and manage your tenants to ensure a smooth rental experience.
                        </p>
                    </div>

                    {/*FEATURE 3*/}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <div className="text-5xl mb-4">💸</div> {/*used windows key and . to get emoji*/}
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                            Rent Payments
                        </h3>
                        <p className="text-gray-600">
                            We ensure timely rent collection and provide detailed financial reports.
                        </p>
                    </div>

                    {/*FEATURE 4*/}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                        <div className="text-5xl mb-4">⛏️</div> {/*used windows key and . to get emoji*/}
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                            Maintenance
                        </h3>
                        <p className="text-gray-600">
                            We maintain your properties report and keep record of all maintenance activities.
                        </p>
                    </div>

                </div>

            </div>
        </section>

        {/*CALL TO ACTION SECTION*/}
        <section className="bg-blue-600 text-hitr py-16 px-6">
            <div className="max-w-4xl mx-autto text-center">
                <h2 className="text-3xl font-bold mb-4">
                 Ready to simplify your property management and maximize on your returns?
                </h2>
                <p className="text-xl mb-8 text-blue-100">
                    Get started with Join Prop.Manager and get started today!
                </p>
                
            </div>
        </section>



        </div>
    )
}