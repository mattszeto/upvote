import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

// if there is no user logged in, then redirect to login screen before they can start creating a post.
// Will instantly move you to login page if it has already cached the request (if its the first time then it will buffer)
// after logining in it will redirect you to the previous page you were on

export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [fetching, data, router]);
};
