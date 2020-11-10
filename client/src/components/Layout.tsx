import Head from "next/head";
import React from "react";
import { NavBar } from "./NavBar";
import { Wrapper, WrapperVariant } from "./Wrapper";

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <Head>
        <title>yupvote</title>
        <link
          rel="icon"
          href="https://www.flaticon.com/svg/static/icons/svg/992/992703.svg"
        />
      </Head>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
