import { Button, useColorMode } from "@chakra-ui/core";
import React from "react";

interface ColorModeSwitcherProps {}

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = ({}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button onClick={toggleColorMode}>
      {colorMode === "light" ? "Dark" : "Light"}
    </Button>
  );
};
