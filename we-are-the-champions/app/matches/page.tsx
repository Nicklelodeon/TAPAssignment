

import { MatchWithForeignKey } from "../components/manage/match/constants";
import { ViewMatchTable } from "../components/view/match/ViewMatchTable";

const Page = async () => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-match`, { method: "GET", cache: "no-store"  });
    const data: MatchWithForeignKey[] = await response.json();
    return (
        <div>
            <ViewMatchTable data={data ?? []} />
        </div>
    );
};
export default Page
