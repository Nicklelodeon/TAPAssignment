
"use client"

import { MatchWithForeignKey } from "@/app/utils/constants";
import {
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Box,
} from "@chakra-ui/react";
import { matchKeys } from "../../Manage/Match/constants";

interface IViewMatchTableProps {
    data: MatchWithForeignKey[];
}

export const ViewMatchTable: React.FC<IViewMatchTableProps> = ({
    data,
}) => {

    return (
        <Box>
            <Box m={4} textDecoration="underline">
                Matches
            </Box>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        {matchKeys.map((key, index) => <Th key={index}>{key}</Th>)}
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((item: MatchWithForeignKey) => (
                        <Tr key={item.id}>
                            <Td>
                                {item.HomeTeam.TeamName ?? ""}
                            </Td>

                            <Td>

                                {item.AwayTeam.TeamName ?? ""}

                            </Td>

                            <Td>

                                {item.HomeGoals}
                            </Td>

                            <Td>

                                {item.AwayGoals}
                            </Td>

                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};
