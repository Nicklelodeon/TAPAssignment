import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, FieldError } from "react-hook-form";
import { z } from "zod";
import { Box, Button, Flex, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { IInitialFormProps } from "./constants";

export const InitialForm: React.FC<IInitialFormProps> = ({ onSubmit, textPlaceholder, schema }) => {

  const [isSubmitting, setIsSubmitting] = useState(false);



  type FormData = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleFormSubmit = async (data: { inputText: string }) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success("Processed form");
    } catch (error) {
      toast.error("Failed to process form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <Box mb={4} mt={2} w="50%">
        <Controller
          name="inputText"
          control={control}
          render={({ field }) => (
            <Box position="relative">
              <Textarea
                {...field}
                rows={10}
                resize="none"
                overflow="auto"
                placeholder={textPlaceholder}
                borderColor="gray.300"
                focusBorderColor="blue.500"
              />
              {errors.inputText && (
                <Text color="red.500">
                  {(errors.inputText as FieldError)?.message ?? ""}
                </Text>
              )}
            </Box>
          )}
        />
      </Box>
      <Button
        type="submit"
        colorScheme="blue"
        px={4}
        py={2}
        rounded="lg"
        onClick={handleSubmit(handleFormSubmit)}
        disabled={isSubmitting}
        isLoading={isSubmitting}
      >
        Process Form
      </Button>
    </Flex>
  );
};
