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
  Flex,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Match } from "@prisma/client";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { MatchWithForeignKey } from "@/app/utils/constants";
import toast from "react-hot-toast";
import { matchKeys, singleMatchSchema } from "./constants";

interface IEditMatchTableProps {
  data: MatchWithForeignKey[];
  refetchMatch: () => void;
}

export const EditMatchTable: React.FC<IEditMatchTableProps> = ({
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
    const updatedData = {
      ...editingMatch,
      // Convert team name back to ID
      NewHomeTeamId: teamNameToId.get(data.HomeTeam) ?? 0,
      NewAwayTeamId: teamNameToId.get(data.AwayTeam) ?? 0,
      NewHomeGoals: data.HomeTeamGoal,
      NewAwayGoals: data.AwayTeamGoal,
    };

    const response = await fetch("/api/update-match", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      toast.error("Error updating match");
      return;
    }
    toast.success("Match successfully updated");
    setEditingMatch(null);
    refetch();
    refetchMatch();
  };
  const handleCancel = () => {
    setEditingMatch(null);
  };

  const handleDelete = async (item: Match) => {
    const response = await fetch("/api/delete-match", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      toast.error("Error deleting match");
      return;
    }
    toast.success("Successfully deleted match");
    refetch();
    refetchMatch();
  };

  return (
    <Box>
      <Box m={4} textDecoration="underline">
        Matches
      </Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            {matchKeys.map((key, index) => <Th key={index}>{key}</Th>)}
            <Th>Edit</Th>
            <Th>Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item: MatchWithForeignKey) => (
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
                ) :
                  (item.HomeTeam.TeamName
                  )
                }
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
                  item.AwayTeam.TeamName
                )
                }
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
                        type="number"
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
                        type="number"
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
                  <Flex justifyContent="center" alignItems="center">
                    <VStack spacing={2} align="center">
                      <Button colorScheme="blue" onClick={handleSubmit(onSubmit)} width="100%">
                        Save
                      </Button>
                      <Button colorScheme="red" onClick={handleCancel} width="100%">
                        Cancel
                      </Button>
                    </VStack>

                  </Flex>
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
