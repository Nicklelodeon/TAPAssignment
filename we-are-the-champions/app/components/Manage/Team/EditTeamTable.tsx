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
} from "@chakra-ui/react";
import moment from "moment";
import { z } from "zod";
import { Team } from "@prisma/client";
import { useTeamContext } from "@/app/utils/context";
import Link from "next/link";
import toast from "react-hot-toast";
import { singleTeamSchemaWithoutGroupNumber, teamKeys } from "./constants";


export const EditTeamTable = () => {
  const { data, teamNames, refetch } = useTeamContext();

  const [currTeamNames, setCurrentTeamNames] = useState(teamNames);
  const [groupNumber, setGroupNumber] = useState(1);
  const [filteredTeams, setFilteredTeams] = useState(
    data.filter((team) => team.GroupNumber === 1)
  );
  const [editingId, setEditingId] = useState<number>(-1);

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


  const handleEdit = (item: Team) => {
    setEditingId(item.id);
    currTeamNames.delete(item.TeamName);
    setCurrentTeamNames(currTeamNames);

    setValue("TeamName", item.TeamName);
    setValue("RegistrationDate", moment(item.RegistrationDate).format("DD/MM"));
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
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
      toast.error("Error updating team");
      return;
    }
    toast.success("Successfully updated team");
    setEditingId(-1);
    refetch();
  };

  const handleCancel = () => {
    setEditingId(-1);
  };

  const handleDelete = async (item: Team) => {
    const response = await fetch("/api/delete-team", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item.id),
    });
    if (response.ok) {
      refetch();
    }
  }

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
            <Th>Edit</Th>
            <Th>Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredTeams.map((item: Team) => (
            <Tr key={item.id}>
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
                  <Link href={`/teams/${item.id}`}>{item.TeamName}</Link>
                )}
                {editingId === item.id && errors.TeamName && (
                  <p className="text-red-500">{errors.TeamName.message}</p>
                )}
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
                {editingId === item.id && errors.RegistrationDate && (
                  <p className="text-red-500">
                    {errors.RegistrationDate.message}
                  </p>
                )}
              </Td>
              <Td>{item.GroupNumber}</Td>
              <Td>{item.GoalsScored}</Td>

              <Td>{item.NormalPoints}</Td>
              <Td>{item.TieBreakerPoints}</Td>
              <Td>
                <Flex justifyContent="center" alignItems="center">
                  {editingId === item.id ? (
                    <VStack spacing={2} align="center">
                      <Button colorScheme="blue" onClick={handleSubmit(onSubmit)} width="100%">
                        Save
                      </Button>
                      <Button colorScheme="red" onClick={handleCancel} width="100%">
                        Cancel
                      </Button>
                    </VStack>
                  ) : (
                    <Button colorScheme="blue" onClick={() => handleEdit(item)}>
                      Edit
                    </Button>
                  )}
                </Flex>
              </Td>
              <Td>
                <Button
                  colorScheme="red"
                  onClick={() => handleDelete(item)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
