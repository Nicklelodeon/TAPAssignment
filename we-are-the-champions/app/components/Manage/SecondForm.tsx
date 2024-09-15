import { zodResolver } from "@hookform/resolvers/zod";
import { AllInput, FormMatch, FormTeam } from "./constants";
import {
  Controller,
  FieldError,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  Text,
  Flex,
} from "@chakra-ui/react";
import { Match, Team } from "@prisma/client";

export interface Form {
  objectArray: FormTeam[] | FormMatch[];
  setIsFirstForm: (value: boolean) => void;
  refetch: () => void;
  schema: Zod.AnyZodObject;
  defaultValue: FormTeam | FormMatch;
  checkGroupSize?: boolean;
  data?: Team[] | Match[];
  onSubmitSecondForm: (results: { [x: string]: any }) => void;
}

export const SecondForm: React.FC<Form> = ({
  objectArray,
  setIsFirstForm,
  data,
  schema,
  defaultValue,
  checkGroupSize,
  onSubmitSecondForm,
}) => {
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      teams: objectArray,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "teams",
  });

  const onBack = () => {
    setIsFirstForm(true);
  };

  const onSubmit = async (results: z.infer<typeof schema>) => {
    if (checkGroupSize) {
      const teamData = data as Team[];
      const groupOneCount =
        teamData.filter((x) => x.GroupNumber === 1).length +
        results.teams.filter((x: Team) => x.GroupNumber === 1).length;
      const groupTwoCount =
        teamData.filter((x) => x.GroupNumber === 2).length +
        results.teams.filter((x: Team) => x.GroupNumber === 2).length;

      if (groupOneCount > 6) {
        setError("teams", {
          type: "manual",
          message: `Group 1 will have more than 6 teams (${groupOneCount} total)`,
        });
        return;
      }

      if (groupTwoCount > 6) {
        setError("teams", {
          type: "manual",
          message: `Group 2 will have more than 6 teams (${groupTwoCount} total)`,
        });
        return;
      }
      clearErrors("teams");
    }
    await onSubmitSecondForm(results);
  };

  return (
    <Box>
      <Box
        maxH="400px"
        overflowY="auto"
        mt={4}
        borderWidth="1px"
        borderRadius="lg"
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              {Object.keys(objectArray[0]).map((key, index) => (
                <Th key={index}>{key}</Th>
              ))}
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {fields.map((field, index) => (
              <Tr key={field.id}>
                {Object.keys(objectArray[0]).map(
                  (key, index) => {
                    return (
                      <Td key={index}>
                        <Controller
                          name={`teams.${index}.${key}`}
                          control={control}
                          render={({ field }) => {
                            const output = AllInput(key, field);
                            return <Input {...field} {...output} />;
                          }}
                        />

                        <Box minH="24px">
                          {errors.teams && (errors.teams[index as keyof typeof errors.team]?.[key] as FieldError) && (
                            <Text color="red.500">
                                  {(errors.teams[index as keyof typeof errors.team]?.[key] as FieldError)?.message ?? ""}

                            </Text>
                          )}
                        </Box>
                      </Td>
                    );
                  }
                )}
                <Td>
                  <Button colorScheme="red" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Box minH="24px" ml={2}>
        {errors.teams && (
          <Text color="red.500">{errors.teams.message as keyof FieldError ?? ""}</Text>
        )}
      </Box>

      <Flex justifyContent="flex-end" mt={2}>
        <Button mr={2} type="button" onClick={onBack}>
          Back
        </Button>

        <Button mr={2} type="button" onClick={() => append(defaultValue)}>
          Add Team
        </Button>

        <Button mr={2} colorScheme="teal" onClick={handleSubmit(onSubmit)}>
          Submit
        </Button>
      </Flex>
    </Box>
  );
};
