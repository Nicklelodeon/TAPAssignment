"use client"

import { useTeamContext } from "@/app/utils/context";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Box,
  Input,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Match } from "@prisma/client";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { singleMatchSchema } from "../constants";

interface IMatchTableProps {
  data: Match[];
  refetchMatch: () => void;
}

export const MatchTable: React.FC<IMatchTableProps> = ({
  data,
  refetchMatch,
}) => {
  const { teamNames, teamIdToName, teamNameToId, refetch, teamNameToGroup } =
    useTeamContext();
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const schema = singleMatchSchema(teamNames, teamNameToGroup);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      HomeTeam: "",
      AwayTeam: "",
      HomeTeamGoal: 0,
      AwayTeamGoal: 0,
    },
  });

  const handleEdit = (item: Match) => {
    // Store the original match being edited
    setEditingMatch(item);

    // Set form values for the edited match
    // Convert id to name
    setValue("HomeTeam", teamIdToName.get(item.HomeTeamId) ?? "");
    setValue("AwayTeam", teamIdToName.get(item.AwayTeamId) ?? "");
    setValue("HomeTeamGoal", item.HomeGoals);
    setValue("AwayTeamGoal", item.AwayGoals);
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    console.log("here");
    const updatedData = {
      ...editingMatch,
      // Convert team name back to ID
      NewHomeTeamId: teamNameToId.get(data.HomeTeam) ?? 0, 
      NewAwayTeamId: teamNameToId.get(data.AwayTeam) ?? 0, 
      NewHomeGoals: data.HomeTeamGoal,
      NewAwayGoals: data.AwayTeamGoal,
    };
    console.log(updatedData);
    const response = await fetch("/api/update-match", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      setEditingMatch(null);
      refetch();
      refetchMatch();
    }
  };
  console.log(errors);
  const handleCancel = () => {
    setEditingMatch(null);
  };

  const handleDelete = async (item: Match) => {
    const response = await fetch("/api/delete-match", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      refetch();
      refetchMatch();
    }
  };

  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Home Team</Th>
            <Th>Away Team</Th>
            <Th>Home Goals</Th>
            <Th>Away Goals</Th>
            <Th>Edit</Th>
            <Th>Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item: Match) => (
            <Tr key={item.id}>
              <Td>
                {editingMatch?.id === item.id ? (
                  <Controller
                    name="HomeTeam"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="string" placeholder="Home Team" />
                    )}
                  />
                ) : (
                  teamIdToName.get(item.HomeTeamId) ?? "Unknown"
                )}
                {editingMatch?.id === item.id && errors.HomeTeam && (
                  <p className="text-red-500">{errors.HomeTeam.message}</p>
                )}
              </Td>

              <Td>
                {editingMatch?.id === item.id ? (
                  <Controller
                    name="AwayTeam"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="string" placeholder="Away Team" />
                    )}
                  />
                ) : (
                  teamIdToName.get(item.AwayTeamId) ?? "Unknown"
                )}
                {editingMatch?.id === item.id && errors.AwayTeam && (
                  <p className="text-red-500">{errors.AwayTeam.message}</p>
                )}
              </Td>

              <Td>
                {editingMatch?.id === item.id ? (
                  <Controller
                    name="HomeTeamGoal"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="string"
                        placeholder="Home Goals"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />
                ) : (
                  item.HomeGoals
                )}
              </Td>

              <Td>
                {editingMatch?.id === item.id ? (
                  <Controller
                    name="AwayTeamGoal"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="string"
                        placeholder="Away Goals"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />
                ) : (
                  item.AwayGoals
                )}
              </Td>

              <Td>
                {editingMatch?.id === item.id ? (
                  <>
                    <Button
                      colorScheme="blue"
                      onClick={() => {
                        console.log("Button clicked"); 
                        handleSubmit((data) => {
                          console.log("Form is being submitted", data); 
                          onSubmit(data);
                        })();
                      }}
                    >
                      Save
                    </Button>
                    <Button colorScheme="red" onClick={handleCancel} ml={2}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button colorScheme="blue" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>
                )}
              </Td>

              <Td>
                <Button colorScheme="red" onClick={() => handleDelete(item)}>
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
