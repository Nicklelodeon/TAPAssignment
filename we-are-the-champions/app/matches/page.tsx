

import { ViewMatchTable } from "../components/View/Match/ViewMatchTable";
import { MatchWithForeignKey } from "../utils/constants";

const Page = async () => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-match`, { method: "GET" });
    const data: MatchWithForeignKey[] = await response.json();
    return (
        <div>
            <ViewMatchTable data={data ?? []} />
        </div>
    );
};
export default Page
