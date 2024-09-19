import { Team } from "@prisma/client";
import { ViewTeamTable } from "../components/view/team/ViewTeamTable";

const Page = async () => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-teams`, { method: "GET", cache: "no-store"  });
    const data: Team[] = await response.json();
    return (
        <div>
            <ViewTeamTable data={data} />
        </div>
    );
};
export default Page
