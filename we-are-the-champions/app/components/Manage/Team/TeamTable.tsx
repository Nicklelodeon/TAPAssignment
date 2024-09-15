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
} from "@chakra-ui/react";
import moment from "moment";
import { z } from "zod";
import { singleTeamSchemaWithoutGroupNumber } from "../constants";
import { Team } from "@prisma/client";
import { useTeamContext } from "@/app/utils/context";


export const TeamTable = () => {
  const {data, teamNames, refetch} = useTeamContext();

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
    console.log("test");
    const updatedData = {
      ...data,
      id: editingId,
      RegistrationDate: moment(data.RegistrationDate, "DD/MM").toDate(),
    };
    console.log("test");

    const response = await fetch("/api/update-team", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      setEditingId(-1);
      refetch();
    } else {
    }
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
      console.log("test");
      refetch();
    }
  }

  return (
    <Box>
      <Button
        colorScheme="teal"
        mb={4}
        onClick={() => setGroupNumber(groupNumber === 1 ? 2 : 1)}
      >
        Switch to Group {groupNumber === 1 ? 2 : 1}
      </Button>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Registration Date</Th>
            <Th>Group</Th>
            <Th>Goals Scored</Th>
            <Th>Normal Points</Th>
            <Th>Tie Breaker Points</Th>
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
                  item.TeamName
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
                {editingId === item.id ? (
                  <>
                    <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
                      Save
                    </Button>
                    <Button colorScheme="red" onClick={handleCancel} ml={2}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    colorScheme="blue"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>
                )}
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
