import { useMeQuery } from '../generated/graphql';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();

  useEffect(()=> {
    // disable cookie mandatory
    debugger;
    console.log("useIsAuth");
    if (!fetching && !data?.me && !parseInt(process.env.HEROKU_FIX_USER || "")) {
      debugger;
      router.replace("/login?next=" + router.pathname);
    }
  },[fetching, data, router]);
}
