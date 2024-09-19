"use client";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { extendTheme, ColorModeScript, ChakraProvider } from "@chakra-ui/react";
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from "next-auth/react";



const config = {
  initialColorMode: "dark",
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // render dark background when page is refreshing
  if (!mounted) {
    return <div style={{ backgroundColor: '#1a202c', width: '100vw', height: '100vh' }} />;
  }

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
