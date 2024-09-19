"use client"

import { Box, Button, Table, Thead, Tr, Th, Tbody, Td, Flex, Tooltip, Text } from "@chakra-ui/react";
import { Team } from "@prisma/client";
import moment from "moment";
import Link from "next/link";
import { useState, useEffect } from "react";
import { teamKeys } from "../../manage/team/constants";

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
            {data.length > 0 ? <Box>
                <Flex justifyContent="space-between" alignItems="center">
                    <Flex flexDirection="column" alignItems="flex-start">
                        <Box textDecoration="underline" m={4}>Teams</Box>
                        <Box m={4} >Group Number: {groupNumber}</Box>

                    </Flex>
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
                        {filteredTeams.map((item: Team, teamIndex) => (
                            <Tooltip
                                key={item.id}
                                label="Teams below the red line will be eliminated"
                                isDisabled={teamIndex !== 3}
                                placement="top"
                            >
                                <Tr key={item.id} borderBottom={teamIndex === 3 ? "4px solid red" : "1px solid"}
                                    borderColor={teamIndex === 3 ? "red.500" : "inherit"}>
                                    <Td>{teamIndex + 1}</Td>
                                    <Td>
                                        <Link href={`/teams/${item.id}`} passHref>
                                            <Text
                                                as="a"
                                                _hover={{
                                                    textDecoration: "underline",
                                                    color: "teal.500",
                                                }}
                                                cursor="pointer"
                                            >
                                                {item.TeamName}
                                            </Text>
                                        </Link>
                                    </Td>
                                    <Td>
                                        {moment(item.RegistrationDate).format("DD/MM")}
                                    </Td>
                                    <Td>{item.GroupNumber}</Td>
                                    <Td>{item.NormalPoints}</Td>
                                    <Td>{item.GoalsScored}</Td>
                                    <Td>{item.TieBreakerPoints}</Td>

                                </Tr>
                            </Tooltip>
                        ))}
                    </Tbody>
                </Table>
            </Box> : <Flex pt={4} alignContent="center" justifyContent="center"><Text>
                No Teams Found
            </Text></Flex>}
        </Box>
    );
};
