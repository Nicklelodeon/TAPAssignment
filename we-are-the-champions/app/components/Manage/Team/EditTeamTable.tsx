import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  Box,
  Flex,
  VStack,
  Tooltip,
  Text
} from "@chakra-ui/react";
import moment from "moment";
import { z } from "zod";
import { useTeamContext } from "@/app/utils/context";
import Link from "next/link";
import toast from "react-hot-toast";
import { singleTeamSchemaWithoutGroupNumber, teamKeys, TeamMessage } from "./constants";
import { CustomisedLoader } from "../../ui/CustomisedLoader";
import { TeamWithForeignKey } from "@/app/utils/constants";


export const EditTeamTable = () => {
  const { data, teamNames, refetch: refetchTeam, isTeamFetching } = useTeamContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currTeamNames, setCurrentTeamNames] = useState(teamNames);
  const [groupNumber, setGroupNumber] = useState(1);
  const [filteredTeams, setFilteredTeams] = useState(
    data.filter((team) => team.GroupNumber === 1)
  );
  const [editingId, setEditingId] = useState(-1);
  const [deletingId, setDeletingId] = useState(-1);

  useEffect(() => {
    setCurrentTeamNames(teamNames);
  }, [teamNames]);

  useEffect(() => {
    setFilteredTeams(data.filter((team) => team.GroupNumber === groupNumber));
  }, [groupNumber, setGroupNumber, data]);
  const schema = singleTeamSchemaWithoutGroupNumber(currTeamNames);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      TeamName: "",
      RegistrationDate: "21/02",
    },
  });


  const handleEdit = (item: TeamWithForeignKey) => {
    setEditingId(item.id);
    currTeamNames.delete(item.TeamName);
    setCurrentTeamNames(currTeamNames);

    setValue("TeamName", item.TeamName);
    setValue("RegistrationDate", moment(item.RegistrationDate).format("DD/MM"));
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsSubmitting(true);
    try {
      const updatedData = {
        ...data,
        id: editingId,
        RegistrationDate: moment(data.RegistrationDate, "DD/MM").toDate(),
      };

      const response = await fetch("/api/update-team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        toast.error(TeamMessage.UPDATE_TEAM_FAILURE);
        return;
      }
      toast.success(TeamMessage.UPDATE_TEAM_SUCCESS);
      refetchTeam();
    } catch {
      toast.error(TeamMessage.UPDATE_TEAM_FAILURE);
    } finally {
      setIsSubmitting(false);
      setEditingId(-1);
    }
  };

  const handleCancel = () => {
    setEditingId(-1);
  };

  const handleDelete = async (item: TeamWithForeignKey) => {
    setDeletingId(item.id);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/delete-team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.id),
      });
      if (!response.ok) {
        toast.error(TeamMessage.DELETE_TEAM_FAILURE);
        return;
      }
      toast.success(TeamMessage.DELETE_TEAM_SUCCESS);
      refetchTeam();
    } catch {
      toast.error(TeamMessage.DELETE_TEAM_FAILURE);
    } finally {
      setIsSubmitting(false);
      setDeletingId(-1);
    }
  }

  return (

    <Box>
      <Box>
        <Flex justifyContent="space-between" alignItems="center">
          <Box m={4} textDecoration="underline">
            Group Number: {groupNumber}
          </Box>
          <Flex>
            <Button
              colorScheme="teal"
              m={4}
              onClick={() => setGroupNumber(groupNumber === 1 ? 2 : 1)}
            >
              Switch to Group {groupNumber === 1 ? 2 : 1}
            </Button>
            <Button
              colorScheme="blue"
              m={4}
              onClick={refetchTeam}
            >
              Refetch
            </Button>
          </Flex>
        </Flex>
        {isTeamFetching ? <CustomisedLoader /> :
          filteredTeams.length > 0 ?
            <Table variant="simple">
              <Thead>
                <Tr>
                  {teamKeys.map((key, index) => <Th key={index}>{key}</Th>)}
                  <Th>Edit</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTeams.map((item: TeamWithForeignKey, teamIndex) => (
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
                        {editingId === item.id ? (
                          <Controller
                            name="TeamName"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} type="string" placeholder="Team Name" />
                            )}
                          />

                        ) : (
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
                        )}
                        <Box minH="24px">
                          {editingId === item.id && errors.TeamName && (
                            <Text className="text-red-500">{errors.TeamName.message}</Text>
                          )}
                        </Box>
                      </Td>

                      <Td>
                        {editingId === item.id ? (
                          <Controller
                            name="RegistrationDate"
                            control={control}
                            render={({ field }) => (
                              <Input {...field} type="string" placeholder="DD/MM" />
                            )}
                          />
                        ) : (
                          moment(item.RegistrationDate).format("DD/MM")
                        )}
                        <Box minH="24px">
                        {editingId === item.id && errors.RegistrationDate && (
                          <Text className="text-red-500">
                            {errors.RegistrationDate.message}
                          </Text>
                        )}
                        </Box>
                      </Td>
                      <Td>{item.GroupNumber}</Td>
                      <Td>{item.NormalPoints}</Td>
                      <Td>{item.GoalsScored}</Td>
                      <Td>{item.TieBreakerPoints}</Td>
                      <Td>
                        {editingId === item.id ? (
                          <Flex justifyContent="center" alignItems="center">
                            <VStack spacing={2} align="center">
                              <Button colorScheme="blue" onClick={handleSubmit(onSubmit)} width="100%" isLoading={isSubmitting && editingId === item.id} disabled={isSubmitting && editingId === item.id}>
                                Save
                              </Button>
                              <Button colorScheme="red" onClick={handleCancel} width="100%" isLoading={isSubmitting && editingId === item.id} disabled={isSubmitting && editingId === item.id}>
                                Cancel
                              </Button>
                            </VStack>

                          </Flex>
                        ) : (
                          <Button colorScheme="blue" onClick={() => handleEdit(item)} isLoading={isSubmitting && (deletingId === item.id)} disabled={isSubmitting && deletingId === item.id}>
                            Edit
                          </Button>
                        )}
                      </Td>

                      <Td>
                        <Tooltip
                          label="Cannot delete team with associated matches"
                          isDisabled={!(item.HomeMatches && item.HomeMatches.length > 0 || item.AwayMatches && item.AwayMatches.length > 0)}
                          hasArrow
                          placement="top"
                        >
                          <Button colorScheme="red" isDisabled={item.HomeMatches && item.HomeMatches.length > 0 || item.AwayMatches && item.AwayMatches.length > 0} onClick={() => handleDelete(item)} isLoading={isSubmitting && (deletingId === item.id || editingId === item.id)} disabled={isSubmitting && deletingId === item.id || editingId === item.id}>
                            Delete
                          </Button>
                        </Tooltip>
                      </Td>
                    </Tr>
                  </Tooltip>
                ))}
              </Tbody>
            </Table> :
            <Flex pt={4} alignContent="center" justifyContent="center"><Text>
              No Teams Found
            </Text></Flex>
        }
      </Box>
    </Box>

  );
};
