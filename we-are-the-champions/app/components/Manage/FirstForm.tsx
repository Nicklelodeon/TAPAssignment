import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Box, Button, Flex, Text, Textarea } from "@chakra-ui/react";

interface IFirstFormProps {
  onSubmit: (formData: { inputText: string }) => void;
  textPlaceholder: string;
}

export const FirstForm: React.FC<IFirstFormProps> = ({ onSubmit, textPlaceholder }) => {
  const schema = z.object({
    inputText: z.string().min(1, "Input is required"),
  });

  type FormData = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.inputText.message}
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
        onClick={handleSubmit(onSubmit)}
      >
        Submit
      </Button>
    </Flex>
  );
};
