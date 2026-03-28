import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useEffect, useRef } from "react";

export function usePreviewAutoSignIn() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();
  const attempted = useRef(false);

  useEffect(() => {
    if (!__IS_PREVIEW__) return;
    if (isLoading || isAuthenticated || attempted.current) return;
    attempted.current = true;
    void signIn("anonymous");
  }, [isAuthenticated, isLoading, signIn]);
}
