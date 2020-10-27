import { theme as chakraTheme } from "@chakra-ui/core";

const fonts = { ...chakraTheme.fonts, mono: `'Menlo', monospace` };

const breakpoints = ["40em", "52em", "64em"];

const theme = {
  ...chakraTheme,
  colors: {
    ...chakraTheme.colors,
    lighterbrown: {
      100: "#fbeef5",
      200: "#fbeef5",
      300: "#dfd5d9",
      400: "#c4bbbe",
      500: "#dfd5d9",
      600: "#93858a",
      700: "#796b70",
      800: "#5f5357",
      900: "#453c3e",
    },
    lightbrown: {
      100: "#fbeef5",
      200: "#fbeef5",
      300: "#dfd5d9",
      400: "#c4bbbe",
      500: "#aa9ea2",
      600: "#93858a",
      700: "#796b70",
      800: "#5f5357",
      900: "#453c3e",
    },
    brown: {
      100: "#aba0a2",
      200: "#918588",
      300: "#796c6e",
      400: "#5e5356",
      500: "#443b3d",
      600: "#2b2325",
      700: "#160909",
      800: "#160909",
      900: "#160909",
    },
    darkbrown: {
      100: "#160909",
      200: "#160909",
      300: "#160909",
      400: "#160909",
      500: "#160909",
      600: "#160909",
      700: "#160909",
      800: "#160909",
      900: "#160909",
    },
  },
  fonts,
  breakpoints,
  icons: {
    ...chakraTheme.icons,
    logo: {
      path: (
        <svg
          width="3000"
          height="3163"
          viewBox="0 0 3000 3163"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <rect width="3000" height="3162.95" fill="none" />
          <path
            d="M1470.89 1448.81L2170 2488.19H820V706.392H2170L1470.89 1448.81ZM1408.21 1515.37L909.196 2045.3V2393.46H1998.84L1408.21 1515.37Z"
            fill="currentColor"
          />
        </svg>
      ),
      viewBox: "0 0 3000 3163",
    },
  },
};

export default theme;
