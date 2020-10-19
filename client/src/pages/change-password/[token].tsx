import { NextPage } from 'next';
import React from 'react'



export const ChangePassword: NextPage<{token: string}> = ({}) => {
    return ();
}

ChangePassword.getInitialProps = ({query}) => {
  return {
    token: query.token as string
  }
}

export default ChangePassword
