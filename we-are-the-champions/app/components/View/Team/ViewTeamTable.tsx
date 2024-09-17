"use client"

import { Box, Button, Table, Thead, Tr, Th, Tbody, Td, Flex } from "@chakra-ui/react";
import { Team } from "@prisma/client";
import moment from "moment";
import Link from "next/link";
import { useState, useEffect } from "react";
import { teamKeys } from "../../Manage/Team/constants";

interface ViewTeamTableProps {
    data: Team[]
}

export const ViewTeamTable: React.FC<ViewTeamTableProps> = ({ data }) => {


    const [groupNumber, setGroupNumber] = useState(1);
    const [filteredTeams, setFilteredTeams] = useState(
        data!.filter((team) => team.GroupNumber === 1)
    );


    useEffect(() => {
        if (data) {
            setFilteredTeams(data!.filter((team) => team.GroupNumber === groupNumber));
        } else {
            setFilteredTeams([]);
        }
    }, [groupNumber, setGroupNumber, data]);



    return (

        <Box>
            <Flex justifyContent="space-between" alignItems="center">
                <Box m={4} textDecoration="underline" >Group Number: {groupNumber}</Box>
                <Button
                    colorScheme="teal"
                    m={4}
                    onClick={() => setGroupNumber(groupNumber === 1 ? 2 : 1)}
                >
                    Switch to Group {groupNumber === 1 ? 2 : 1}
                </Button>
            </Flex>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        {teamKeys.map((key, index) => <Th key={index}>{key}</Th>)}

                    </Tr>
                </Thead>
                <Tbody>
                    {filteredTeams.map((item: Team) => (
                        <Tr key={item.id}>
                            <Td>
                                <Link href={`/teams/${item.id}`}>{item.TeamName}</Link>
                            </Td>
                            <Td>
                                {moment(item.RegistrationDate).format("DD/MM")}
                            </Td>
                            <Td>{item.GroupNumber}</Td>
                            <Td>{item.GoalsScored}</Td>

                            <Td>{item.NormalPoints}</Td>
                            <Td>{item.TieBreakerPoints}</Td>

                        </Tr>
                    ))}
                </Tbody>
            </Table>

        </Box>
    );
};
