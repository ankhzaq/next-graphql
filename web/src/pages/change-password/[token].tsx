import React from 'react';
import { NextPage } from 'next';

export const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  return (<div> token is: {token}</div>);
}

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  }
}

export default ChangePassword;