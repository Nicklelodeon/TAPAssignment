import { LogsWithForeignKey } from "../components/view/logs/constants";
import { ViewLogsTable } from "../components/view/logs/ViewLogsTable";



const Page = async () => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-logs`, { method: "GET", cache: "no-store" });
    const data: LogsWithForeignKey[] = await response.json();
    return (
        <div>
            <ViewLogsTable data={data ?? []} />
        </div>
    );
}

export default Page;