

import { Box } from "@chakra-ui/react";
import { MatchWithForeignKey } from "../components/manage/match/constants";
import { ViewMatchTable } from "../components/view/match/ViewMatchTable";

const Page = async () => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-match`, { method: "GET", cache: "no-store"  });
    const data: MatchWithForeignKey[] = await response.json();
    return (
        <Box>
            <ViewMatchTable data={data ?? []} />
        </Box>
    );
};
export default Page
