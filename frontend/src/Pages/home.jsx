import {Header} from "../components/Header/Header.jsx";
//import {DashboardAdmin} from "../components/dashboard-admin/dashboard-admin.jsx";
// should DashboardAdmin be in the landing page?

export const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50">  {/*Haven't decided on the colour scheme yet*/}
        <Header />
        {/*<DashboardAdmin/>*/}

        {/*HERO SECTION*/}
        <section>
            <div>
                <h1>Prop.Manger</h1>
                <p>We manage properties, liase with tenants and attend to all related maintenance request so that that you can focus on what matters most.</p>
            </div>
        </section>

        </div>
    )
}