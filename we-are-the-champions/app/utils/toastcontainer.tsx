"use client";

import { Toaster } from "react-hot-toast";
import { useColorMode } from "@chakra-ui/react";

export const ToastContainer = () => {
    const { colorMode } = useColorMode();

    return (
        <Toaster
            position="top-right"    
            toastOptions={{
                success: {
                    duration: 4000,
                    style: {
                        background: colorMode === "dark" ? "#2D3748" : "#F0FFF4",
                        color: colorMode === "dark" ? "#68D391" : "#2F855A",
                    },
                },
                error: {
                    duration: 4000,
                    style: {
                        background: colorMode === "dark" ? "#742A2A" : "#FFF5F5",
                        color: colorMode === "dark" ? "#FEB2B2" : "#E53E3E",
                    },
                },
                
            }}
        />
    );
};

