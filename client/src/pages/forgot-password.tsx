import { Box, Button, Text } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { createUrqlClient } from "../utils/createUrqlClient";

import { useForgotPasswordMutation } from "../generated/graphql";
import { Layout } from "../components/Layout";
import { __prod__ } from "../utils/constants";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Layout>
      <Wrapper variant="small">
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (values) => {
            await forgotPassword(values);
            setComplete(true);
          }}>
          {({ isSubmitting }) =>
            complete ? (
              <Box>
                If an account with that email exists, we have sent you an email
                to reset password.
              </Box>
            ) : (
              <Form>
                <InputField
                  name="email"
                  placeholder="your@email.com"
                  label="Email"
                  type="email"
                />
                <Button
                  mt={4}
                  type="submit"
                  isLoading={isSubmitting}
                  w="100%"
                  variantColor="orange">
                  Reset Password
                </Button>
              </Form>
            )
          }
        </Formik>
        {/* forget password is currently disabled in production */}
        {__prod__ ? (
          <Text fontSize="12px" textAlign="center">
            Forget Password is Disabled
          </Text>
        ) : null}
      </Wrapper>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
