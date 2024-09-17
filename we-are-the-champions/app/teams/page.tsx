import { Team } from "@prisma/client";
import { ViewTeamTable } from "../components/View/Team/ViewTeamTable";

const Page = async () => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-teams`, { method: "GET" });
    const data: Team[] = await response.json();
    return (
        <div>
            <ViewTeamTable data={data} />
        </div>
    );
};
export default Page
