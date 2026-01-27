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
            </div>
        </section>

        </div>
    )
}