import { Box } from "@chakra-ui/react";
import { LogsWithForeignKey } from "../components/view/logs/constants";
import { ViewLogsTable } from "../components/view/logs/ViewLogsTable";



const Page = async () => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-logs`, { method: "GET", cache: "no-store" });
    const data: LogsWithForeignKey[] = await response.json();
    return (
        <Box>
            <ViewLogsTable data={data ?? []} />
        </Box>
    );
}

export default Page;