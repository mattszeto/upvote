import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  IconButton,
  Text,
} from "@chakra-ui/core";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    // this will make the request for user from the browser,
    // if you remove it will make request from server
    pause: isServer(),
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  let body = null;

  if (fetching) {
  } // data is loading
  if (!data?.me) {
    // user not logged in
    body = (
      <>
        <NextLink href="/login">
          <Link mr={4}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Button width="90px" as={Link} variantColor="teal">
            Register
          </Button>
        </NextLink>
      </>
    );
  } else {
    // user is logged in
    body = (
      <Flex align="center">
        <Box mr={2}>user/{data.me.username}</Box>
      </Flex>
    );
  }
  // change login & register buttons to be animated
  if (!data?.me && router.pathname.includes("/login")) {
    body = (
      <>
        <NextLink href="/login">
          <Button width="90px" mr={4} as={Link} variantColor="teal">
            Login
          </Button>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else if (!data?.me && router.pathname.includes("/register")) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={4}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Button width="90px" as={Link} variantColor="teal">
            Register
          </Button>
        </NextLink>
      </>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="white" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading>yup·vote</Heading>
          </Link>
        </NextLink>

        <Box ml={"auto"}>{body}</Box>

        {!data?.me ? null : (
          <IconButton
            onClick={onOpen}
            aria-label="User Settings"
            icon="settings"
            size="sm"
            variant="ghost"
            isRound={true}
          />
        )}
        <Drawer placement="top" onClose={onClose} isOpen={isOpen} size="xs">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>
              <Flex flex={1} align="center">
                <Text mr={2}>{data?.me?.username}:</Text>
                <Text> {data?.me?.about}</Text>
                <Button p={2} ml="auto" h="30px" variant="solid">
                  Profile
                </Button>
                <Button
                  p={2}
                  ml={4}
                  h="30px"
                  onClick={async () => {
                    await logout();
                    router.reload();
                  }}
                  isLoading={logoutFetching}
                  variant="solid">
                  Logout
                </Button>
              </Flex>
            </DrawerHeader>
            <DrawerBody textAlign="center"></DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Flex>
  );
};
