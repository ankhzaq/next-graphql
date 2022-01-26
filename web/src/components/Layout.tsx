import React from 'react';
import { NavBar } from './NavbBar';
import { Wrapper } from './Wrapper';

export type WrapperVariant = "small" | "regular";

interface LayoutProps {
  variant?: WrapperVariant;
}

const Layout: React.FC<LayoutProps> = ({ children, variant = "regular"}) => {
  return (
    <>
      <NavBar />
      <Wrapper> {children}</Wrapper>
    </>
  );
}

export default Layout;
