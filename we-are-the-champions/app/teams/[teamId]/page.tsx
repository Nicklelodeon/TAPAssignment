import { TeamOutput } from "@/app/api/team/route";
import { Table, Thead, Tbody, Tr, Th, Td, Box, Heading, Text, Stack, Grid, GridItem, Divider, TableContainer} from "@chakra-ui/react";

const Page = async ({ params }: { params: { teamId: string } }) => {
  const teamId = params.teamId;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team?teamId=${teamId}`, {
    method: "GET",
  });
  const teamData: TeamOutput = await response.json();
  return (
    <Box p={6} maxWidth="1200px" mx="auto">

      {teamData ? (
        <Box>
          <Heading as="h2" size="md" mb={4} textDecoration="underline">
            Team Details
          </Heading>

          <Grid templateColumns="1fr 1px 1fr" gap={4} alignItems="center" mb={6}>
            <GridItem>
              <Stack spacing={2}>
                <Text>
                  <strong>Team Name:</strong> {teamData.TeamName}
                </Text>
                <Text>
                  <strong>Goals Scored:</strong> {teamData.GoalsScored}
                </Text>
                <Text>
                  <strong>Group Number:</strong> {teamData.GroupNumber}
                </Text>
              </Stack>
            </GridItem>

            <GridItem>
              <Divider orientation="vertical" height="100%" />
            </GridItem>

            <GridItem>
              <Stack spacing={2}>
                <Text>
                  <strong>Normal Points:</strong> {teamData.NormalPoints}
                </Text>
                <Text>
                  <strong>Registration Date:</strong> {new Date(teamData.RegistrationDate).toLocaleDateString()}
                </Text>
                <Text>
                  <strong>Tie Breaker Points:</strong> {teamData.TieBreakerPoints}
                </Text>
              </Stack>
            </GridItem>
          </Grid>

          <Heading as="h2" size="md" mb={4}>
            Home Matches
          </Heading>
          <TableContainer mb={6}>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>Match ID</Th>
                  <Th>Home Team</Th>
                  <Th>Away Team</Th>
                  <Th>Home Goals</Th>
                  <Th>Away Goals</Th>
                </Tr>
              </Thead>
              <Tbody>
                {teamData.HomeMatches.length > 0 ? (
                  teamData.HomeMatches.map((match: any) => (
                    <Tr key={match.id}>
                      <Td>{match.id}</Td>
                      <Td>{match.HomeTeam.TeamName}</Td>
                      <Td>{match.AwayTeam.TeamName}</Td>
                      <Td>{match.HomeGoals}</Td>
                      <Td>{match.AwayGoals}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={5} textAlign="center">
                      No Home Matches
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>

          <Heading as="h2" size="md" mb={4}>
            Away Matches
          </Heading>
          <TableContainer mb={6}>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>Match ID</Th>
                  <Th>Home Team</Th>
                  <Th>Away Team</Th>
                  <Th>Home Goals</Th>
                  <Th>Away Goals</Th>
                </Tr>
              </Thead>
              <Tbody>
                {teamData.AwayMatches.length > 0 ? (
                  teamData.AwayMatches.map((match: any) => (
                    <Tr key={match.id}>
                      <Td>{match.id}</Td>
                      <Td>{match.HomeTeam.TeamName}</Td>
                      <Td>{match.AwayTeam.TeamName}</Td>
                      <Td>{match.HomeGoals}</Td>
                      <Td>{match.AwayGoals}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={5} textAlign="center">
                      No Away Matches
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Text>Loading team data...</Text>
      )}
    </Box>
  );
};

export default Page;
