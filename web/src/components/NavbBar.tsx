import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Flex,
  Heading,
  Link, useToast
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { useRouter } from 'next/router';
import { useState } from 'react';

const DURATION_LOGOUT_DISABLED = 2500;

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [showLogoutDisabledDialog, setShowLogoutDisabledDialog] = useState(false);
  const toast = useToast()
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();
  let body = null;

  // data is loading
  if (fetching) {
    body = null;
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link color='white' mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link color='white'>register</Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Flex zIndex={1} position="sticky" bg="tan" p={4} top="0" align="center">
        {showLogoutDisabledDialog && (
          <Alert status='error'>
            <AlertIcon />
            <AlertDescription>Logout is not available in the environment [heroku and cookies are not friends :) ]</AlertDescription>
          </Alert>
        )}
          <NextLink href="/create-post">
            <Button as={Link} mr={4}>
              create post
            </Button>
          </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button variant="link" onClick={async () => {
          if (process.env.HEROKU_FIX_USER) {
            setShowLogoutDisabledDialog(true);
            setTimeout(() => {
              setShowLogoutDisabledDialog(false)
            }, DURATION_LOGOUT_DISABLED);

            toast({
              title: 'Logout not available in the environment',
              description: "heroku and cookies are not friends :)",
              status: 'info',
              duration: DURATION_LOGOUT_DISABLED,
              isClosable: true,
            });
          } else {
            await logout();
            router.reload()
          }
        }} isLoading={logoutFetching}>logout</Button>
    </Flex>)
  }
  return (
    <Flex bg='tomato' p={4} align='center'>
      <NextLink href="/">
        <Link>
          <Heading>LiReddit</Heading>
        </Link>
      </NextLink>
      <Box ml='auto'>
        {body}
      </Box>
    </Flex>
  );
}
