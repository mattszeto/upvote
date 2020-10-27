import React from "react";
import { Form, Formik } from "formik";
import { Box, Button, Flex, Heading, Link, Text } from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { Layout } from "../components/Layout";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <Layout>
      <Wrapper variant="small">
        <Heading mb={4} fontSize="35px">
          Login
        </Heading>
        <Formik
          initialValues={{ usernameOrEmail: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login(values);

            if (response.data?.login.errors) {
              setErrors(toErrorMap(response.data.login.errors));
            } else if (response.data?.login.user) {
              // register has been a success and user has been found
              if (typeof router.query.next === "string") {
                router.push(router.query.next || "/");
              }
              router.push("/");
            }
          }}>
          {({ isSubmitting }) => (
            <Box>
              <Form>
                <InputField
                  name="usernameOrEmail"
                  placeholder="username or email"
                  label="username"
                />
                <Box mt={1}>
                  <InputField
                    name="password"
                    placeholder="password"
                    label="password"
                    type="password"
                  />
                </Box>
                <Flex mt={1} pb={0}>
                  <NextLink href="/register">
                    <Link fontSize={11} ml="auto">
                      Create Account
                    </Link>
                  </NextLink>
                  <Text fontSize={11} ml={1}>
                    |
                  </Text>
                  <NextLink href="/forgot-password">
                    <Link fontSize={11} ml={1}>
                      Forgot Password?
                    </Link>
                  </NextLink>
                </Flex>
                <Button
                  w="100%"
                  mt={2}
                  type="submit"
                  isLoading={isSubmitting}
                  variantColor="orange">
                  Login
                </Button>
              </Form>
            </Box>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
