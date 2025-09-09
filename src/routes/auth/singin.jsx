import { SignInButton, useClerk, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Button } from "../../components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../../userContext/userContext";

function SigninPage() {
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect") || "/";
  const { saveUserInfo } = useUserContext();
  const {isSignedIn} = useUser()


  useEffect(() => {
    const init = async () => {
      if (!isSignedIn) {
        openSignIn();
      } else {
        await saveUserInfo();
        setTimeout(() => {
          navigate(redirect, { replace: true });
        }, 400);
      }
    };

    init();
  }, [isSignedIn, openSignIn, navigate, redirect, saveUserInfo]);


  return (
    <div className="container mx-auto my-20">
      <div className="flex items-center justify-center">
        <SignInButton mode="modal">
          {isSignedIn ? <div>Alredy SignedIn</div> :
            <Button variant="secondary">Sign In</Button>
          }
        </SignInButton>
      </div>
    </div>
  );
}

export default SigninPage;
