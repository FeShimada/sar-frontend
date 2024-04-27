import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AuthorDashboard from "./author/authordashboard";
import MeasurerDashboard from "./measurer/measurerdashboard";


export default async function Dashboard() {

    const session = await getServerSession(authOptions);

    return (
        <>
            {session?.user.role === 0 ? (
                <AuthorDashboard />
            ) : session?.user.role === 1 ? (
                <MeasurerDashboard />
            ) : (
                null
            )}

        </>
    )
}
