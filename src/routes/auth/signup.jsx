import { useEffect } from "react";
import { SignInButton, SignUpButton, useClerk, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

function SignupPage() {
  const { openSignUp } = useClerk();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect") || "/";

  useEffect(() => {
    if (!isSignedIn) {
      openSignUp();
    } else {
      setTimeout(() => {
        navigate(redirect, { replace: true });
      }, 400)
    }
  }, [isSignedIn, openSignUp, navigate]);

  return (
    <div className="container mx-auto my-20">
      <div className="flex items-center justify-center">
        <SignInButton mode="modal">
          {isSignedIn ? <>Alredy SignedIn</> :
            <Button variant="secondary">Sign Up</Button>
          }
        </SignInButton>
      </div>
    </div>
  );
}

export default SignupPage;
