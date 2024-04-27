import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AuthorDashboard from "./author/authordashboard";
import MeasurerDashboard from "./measurer/measurerdashboard";
import AdminDashboard from "./admin/admindashboard";


export default async function Dashboard() {

    const session = await getServerSession(authOptions);

    return (
        <>
            {session?.user.role === 0 ? (
                <AuthorDashboard />
            ) : session?.user.role === 1 ? (
                <MeasurerDashboard />
            ) : session?.user.role === 2 ? (
                <AdminDashboard />
            ) : null}

        </>
    )
}
