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
  Text,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  matchKeys,
  MatchMessage,
  MatchWithForeignKey,
  singleMatchSchema,
} from "./constants";
import { CustomisedLoader } from "../../ui/CustomisedLoader";
import { IAPIDeleteMatchInput } from "@/app/types/api/delete-match";
import {
  IAPIUpdateMatchInput,
  IUpdateMatch,
} from "@/app/types/api/update-match";

interface IEditMatchTableProps {
  data: MatchWithForeignKey[];
  refetchMatch: () => void;
  isMatchFetching: boolean;
  matchesPlayed: Map<string, Set<string>>;
}

export const EditMatchTable: React.FC<IEditMatchTableProps> = ({
  data,
  refetchMatch,
  isMatchFetching,
  matchesPlayed,
}) => {
  const {
    teamNames,
    teamIdToName,
    teamNameToId,
    teamNameToGroup,
    refetch: refetchTeam,
    isTeamFetching,
  } = useTeamContext();
  const [deletingId, setDeletingId] = useState(-1);
  const [editingMatch, setEditingMatch] = useState<MatchWithForeignKey | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = singleMatchSchema(teamNames, teamNameToGroup, matchesPlayed);

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

  const handleEdit = (item: MatchWithForeignKey) => {
    // Store the original match being edited
    setEditingMatch(item);

    // ensure validation errors for existing matches do not affect currently edited match
    if (matchesPlayed.has(item.HomeTeam.TeamName)) {
      matchesPlayed.get(item.HomeTeam.TeamName)?.delete(item.AwayTeam.TeamName);
    }
    if (matchesPlayed.has(item.AwayTeam.TeamName)) {
      matchesPlayed.get(item.AwayTeam.TeamName)?.delete(item.HomeTeam.TeamName);
    }
    // Set form values for the edited match
    // Convert id to name
    setValue("HomeTeam", teamIdToName.get(item.HomeTeamId) ?? "");
    setValue("AwayTeam", teamIdToName.get(item.AwayTeamId) ?? "");
    setValue("HomeTeamGoal", item.HomeGoals);
    setValue("AwayTeamGoal", item.AwayGoals);
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsSubmitting(true);
    try {
      const updatedData: IUpdateMatch = {
        id: editingMatch?.id ?? -1,
        HomeTeamId: editingMatch?.HomeTeamId ?? -1,
        HomeGoals: editingMatch?.HomeGoals ?? -1,
        AwayTeamId: editingMatch?.AwayTeamId ?? -1,
        AwayGoals: editingMatch?.AwayGoals ?? -1,
        // Convert team name back to ID
        NewHomeTeamId: teamNameToId.get(data.HomeTeam) ?? -1,
        NewAwayTeamId: teamNameToId.get(data.AwayTeam) ?? -1,
        NewHomeGoals: data.HomeTeamGoal,
        NewAwayGoals: data.AwayTeamGoal,
      };
      const payload: IAPIUpdateMatchInput = {
        match: updatedData,
      };
      const response = await fetch("/api/update-match", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || MatchMessage.UPDATE_MATCH_FAILURE);
        return;
      }
      toast.success(MatchMessage.UPDATE_MATCH_SUCCESS);
      setEditingMatch(null);
      refetchMatch();
      // matches will affect team statistics
      refetchTeam();
    } catch {
      toast.error(MatchMessage.UPDATE_MATCH_FAILURE);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCancel = () => {
    setEditingMatch(null);
  };

  const handleDelete = async (item: MatchWithForeignKey) => {
    setIsSubmitting(true);
    setDeletingId(item.id);
    const payload: IAPIDeleteMatchInput = {
      match: item,
    };
    try {
      const response = await fetch("/api/delete-match", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message || MatchMessage.DELETE_MATCH_FAILURE);
        return;
      }
      toast.success(MatchMessage.DELETE_MATCH_SUCCESS);
      refetchMatch();
      // matches will affect team statistics
      refetchTeam();
    } catch {
      toast.error(MatchMessage.DELETE_MATCH_FAILURE);
    } finally {
      setIsSubmitting(false);
      setDeletingId(-1);
    }
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center">
        <Box m={4} textDecoration="underline">
          Matches
        </Box>
        <Button colorScheme="blue" m={4} onClick={refetchMatch}>
          Refetch
        </Button>
      </Flex>
      {isMatchFetching || isTeamFetching ? (
        <CustomisedLoader />
      ) : data.length > 0 ? (
        <Table variant="simple">
          <Thead>
            <Tr>
              {matchKeys.map((key, index) => (
                <Th key={index}>{key}</Th>
              ))}
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
                        <Input
                          {...field}
                          type="number"
                          placeholder="Home Team"
                          value={field.value === undefined ? "" : field.value}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const value = e.target.value;
                            const parsedValue =
                              value === "" ? "" : Number(value);
                            field.onChange(parsedValue);
                          }}
                        />
                      )}
                    />
                  ) : (
                    item.HomeTeam.TeamName
                  )}
                  <Box minH="24px">
                    {editingMatch?.id === item.id && errors.HomeTeam && (
                      <Text className="text-red-500">
                        {errors.HomeTeam.message}
                      </Text>
                    )}
                  </Box>
                </Td>

                <Td>
                  {editingMatch?.id === item.id ? (
                    <Controller
                      name="AwayTeam"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          placeholder="Away Team"
                          value={field.value === undefined ? "" : field.value}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const value = e.target.value;
                            const parsedValue =
                              value === "" ? "" : Number(value);
                            field.onChange(parsedValue);
                          }}
                        />
                      )}
                    />
                  ) : (
                    item.AwayTeam.TeamName
                  )}
                  <Box minH="24px">
                    {editingMatch?.id === item.id && errors.AwayTeam && (
                      <Text className="text-red-500">
                        {errors.AwayTeam.message}
                      </Text>
                    )}
                  </Box>
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
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      )}
                    />
                  ) : (
                    item.HomeGoals
                  )}
                  <Box minH="24px">
                    {editingMatch?.id === item.id && errors.HomeTeamGoal && (
                      <Text className="text-red-500">
                        {errors.HomeTeamGoal.message}
                      </Text>
                    )}
                  </Box>
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
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      )}
                    />
                  ) : (
                    item.AwayGoals
                  )}
                  <Box minH="24px">
                    {editingMatch?.id === item.id && errors.AwayTeamGoal && (
                      <Text className="text-red-500">
                        {errors.AwayTeamGoal.message}
                      </Text>
                    )}
                  </Box>
                </Td>

                <Td>
                  {editingMatch?.id === item.id ? (
                    <Flex justifyContent="center" alignItems="center">
                      <VStack spacing={2} align="center">
                        <Button
                          colorScheme="blue"
                          onClick={handleSubmit(onSubmit)}
                          width="100%"
                          isLoading={
                            isSubmitting && editingMatch?.id === item.id
                          }
                          disabled={
                            isSubmitting && editingMatch?.id === item.id
                          }
                        >
                          Save
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={handleCancel}
                          width="100%"
                          isLoading={
                            isSubmitting && editingMatch?.id === item.id
                          }
                          disabled={
                            isSubmitting && editingMatch?.id === item.id
                          }
                        >
                          Cancel
                        </Button>
                      </VStack>
                    </Flex>
                  ) : (
                    <Button
                      colorScheme="blue"
                      onClick={() => handleEdit(item)}
                      isLoading={isSubmitting && deletingId === item.id}
                      disabled={isSubmitting && deletingId === item.id}
                    >
                      Edit
                    </Button>
                  )}
                </Td>

                <Td>
                  <Button
                    colorScheme="red"
                    onClick={() => handleDelete(item)}
                    isLoading={
                      isSubmitting &&
                      (deletingId === item.id || editingMatch?.id === item.id)
                    }
                    disabled={
                      (isSubmitting && deletingId === item.id) ||
                      editingMatch?.id === item.id
                    }
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Flex pt={4} alignContent="center" justifyContent="center">
          <Text>No Matches Found</Text>
        </Flex>
      )}
    </Box>
  );
};
