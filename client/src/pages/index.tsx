import { ConnectKitButton, useSIWE } from "connectkit";
import { useRouter } from 'next/router'
import { useEffect } from "react";

export default function Home() {
  const { isSignedIn, data } = useSIWE();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/siwe/submit")
    }
  }, [isSignedIn, router])

  return (
    <>
      <div>Sign in with ethereum to continue</div>
      <ConnectKitButton />
    </>
  )
}