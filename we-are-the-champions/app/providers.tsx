"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode } from "react";
import { extendTheme, ColorModeScript, ChakraProvider } from "@chakra-ui/react";
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from "next-auth/react";



const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {

  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;

}
interface ProvidersProps {
  children: ReactNode;
}



export default function Providers({ children }: ProvidersProps) {

  const queryClient = getQueryClient();

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Toaster position="top-right" reverseOrder={false} />
      <SessionProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </SessionProvider>
    </ChakraProvider>
  );
}
