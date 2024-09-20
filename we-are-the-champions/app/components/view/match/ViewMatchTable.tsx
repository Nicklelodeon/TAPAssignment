
"use client"

import {
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Box,
    Flex,
    Text
} from "@chakra-ui/react";
import { matchKeys, MatchWithForeignKey } from "../../manage/match/constants";

interface IViewMatchTableProps {
    data: MatchWithForeignKey[];
}

export const ViewMatchTable: React.FC<IViewMatchTableProps> = ({
    data,
}) => {
    return (
        <Box>
            {data.length > 0 ?
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
                </Box> : <Flex pt={4} alignContent="center" justifyContent="center"><Text>
                    No Matches Found
                </Text></Flex>}
        </Box>
    );
};
