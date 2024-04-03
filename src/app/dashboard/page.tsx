import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AuthorDashboard from "./author/authordashboard";


export default async function Dashboard() {

    const session = await getServerSession(authOptions);
    
    return (
        <>
            {session?.user.role === 0 ? (
                <AuthorDashboard/>
            ) : (null)}
        </>
    )
}
