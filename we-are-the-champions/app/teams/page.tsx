import { Team } from "@prisma/client";
import { ViewTeamTable } from "../components/view/team/ViewTeamTable";
import { Box } from "@chakra-ui/react";

const Page = async () => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-teams`, { method: "GET", cache: "no-store"  });
    const data: Team[] = await response.json();
    return (
        <Box>
            <ViewTeamTable data={data} />
        </Box>
    );
};
export default Page
