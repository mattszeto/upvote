import React from "react";
import { Form, Formik } from "formik";
import { Box, Button } from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";

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
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register(values);
          console.log(response);
          if (response.data?.register.errors) {
            [{ field: "username", message: "something wrong" }];
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
              label="Username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variantColor="teal">
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
