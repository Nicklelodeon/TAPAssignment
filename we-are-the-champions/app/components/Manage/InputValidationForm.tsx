import { zodResolver } from "@hookform/resolvers/zod";
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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AllInput, FormStatus, IInputValidationFormProps } from "./constants";

export const InputValidationForm: React.FC<IInputValidationFormProps> = ({
  objectArray,
  setFormStatus,
  schema,
  defaultValue,
  onSubmitInputValidationForm,
  formName
}) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      teams: objectArray,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "teams",
  });

  const onBack = () => {
    setFormStatus(FormStatus.INITIAL_FORM);
  };

  useEffect(() => {
    if (errors.teams) {
      setIsSubmitting(false);
    }
  }, [errors]);

  

  const onSubmit = async (results: z.infer<typeof schema>) => {
    setIsSubmitting(true);
    try {
      await onSubmitInputValidationForm(results, setError);
    } catch {
      toast.error("Error submitting form");
    }
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
                {Object.keys(objectArray[0]).map((key, keyIndex) => {
                  return (
                    <Td key={keyIndex}>
                      <Controller
                        name={`teams.${index}.${key}`}
                        control={control}
                        render={({ field }) => {
                          const output = AllInput(key, field);
                          return <Input {...field} {...output} />;
                        }}
                      />

                      <Box minH="24px">
                        {errors.teams &&
                          (errors.teams[index as keyof typeof errors.team]?.[
                            key
                          ] as FieldError) && (
                            <Text color="red.500">
                              {(
                                errors.teams[
                                  index as keyof typeof errors.team
                                ]?.[key] as FieldError
                              )?.message ?? ""}
                            </Text>
                          )}
                      </Box>
                    </Td>
                  );
                })}
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
          <Text color="red.500">
            {(errors.teams.message as keyof FieldError) ?? ""}
          </Text>
        )}
      </Box>

      <Flex justifyContent="flex-end" mt={2}>
        <Button mr={2} type="button" onClick={onBack}>
          Back
        </Button>

        <Button mr={2} type="button" onClick={() => append(defaultValue)}>
          Add {formName}
        </Button>

        <Button
          mr={2}
          colorScheme="teal"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Submit
        </Button>
      </Flex>
    </Box>
  );
};
