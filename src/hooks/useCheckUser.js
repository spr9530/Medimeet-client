// src/hooks/useCheckUser.js
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from "../userContext/userContext";

const useCheckUser = () => {
  const { isSignedIn, user:userInfo } = useUser();
  const [backendUser, setBackendUser] = useState(null);
  const {saveUserInfo} = useUserContext()

  useEffect(() => {
    const checkUserInBackend = async () => {
      if (!isSignedIn || !userInfo) return;

      try {
        const res = await axios.post("https://medimeet-1-kidp.onrender.com/api/user/check-user", {
          id: userInfo.id,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          imageUrl: userInfo.imageUrl,
          email: userInfo.primaryEmailAddress?.emailAddress,
        });

        await saveUserInfo()
        setBackendUser(res.data);
      } catch (error) {
        console.error("❌ Error calling backend:", error);
      }
    };

    checkUserInBackend();
  }, [isSignedIn, userInfo]);

  return { isSignedIn, userInfo, backendUser };
};

export default useCheckUser;
