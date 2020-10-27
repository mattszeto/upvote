import { Box } from "@chakra-ui/core";
import React from "react";

export type WrapperVariant = "small" | "regular";

interface WrapperProps {
  variant?: WrapperVariant;
  bgColor?: string;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
  bgColor,
}) => {
  return (
    <Box
      bg={bgColor}
      mt={8}
      mx="auto"
      maxW={variant === "regular" ? "800px" : "300px"}
      w="95%">
      {children}
    </Box>
  );
};
