import React from "react";
import { Form, Formik } from "formik";
import { Box, Button, Heading } from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";

interface registerProps {}

// const REGISTER_MUT = `
// mutation Register($username: String!, $password:String! ) {
//     register(options: { username: $username, password: $password }) {
//       errors{
//         field
//         message
//       }
//       user{
//         id
//         username
//       }
//     }
//   }
// `;

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  return (
    <Layout>
      <Wrapper variant="small">
        <Heading mb={4} fontSize="35px" fontFamily="monospace">
          Register
        </Heading>
        <Formik
          initialValues={{ email: "", username: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await register({ options: values });
            if (response.data?.register.errors) {
              setErrors(toErrorMap(response.data.register.errors));
            } else if (response.data?.register.user) {
              // register has been a success and user has been found
              router.push("/");
            }
          }}>
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="username"
                placeholder="username"
                label="username"
              />
              <Box mt={2}>
                <InputField name="email" placeholder="email" label="email" />
              </Box>
              <Box mt={2}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="password"
                  type="password"
                />
              </Box>
              <Button
                width="100%"
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                variantColor="orange">
                Register
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
