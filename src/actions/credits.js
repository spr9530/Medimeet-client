import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import useCheckUser from "../hooks/useCheckUser";
import { useUserContext } from "../userContext/userContext";

export function useCredits() {
  const { isSignedIn, backendUser: user } = useCheckUser();
  const {userInfo, saveUserInfo} = useUserContext()


  const { has } = useAuth(); // ✅ get the 'has' function
  const [backendUser, setBackendUser] = useState(null);

  async function checkAndAllocateCredits() {
    console.log('called')
    if (!userInfo) {
      console.error("❌ No user found.");
      return;
    }

    // Determine current plan
    const hasBasic = has({ plan: "free_user" });
    const hasStandard = has({ plan: "standard" });
    const hasPremium = has({ plan: "premium" });

    let currentPlan = "free_user";
    if (hasPremium) currentPlan = "premium";
    else if (hasStandard) currentPlan = "standard";
    else if (hasBasic) currentPlan = "free_user";

    try {
      const res = await axios.post("https://medimeet-1-kidp.onrender.com/api/credits/allocate", {
        user: {
          id: userInfo._id,
          email: userInfo.email,
          fullName: `${userInfo.name}`,
          role: userInfo.role,
        },
        currentPlan, // ✅ send actual plan
      });
      await saveUserInfo();

      setBackendUser(res.data); // store backend response
    } catch (error) {
      console.error("❌ Error calling backend:", error);
    }
  }

  return { backendUser, checkAndAllocateCredits };
}

export async function deductCreditsForAppointment(userId, doctorId) {
  if (!userId || !doctorId) {
    throw new Error("User ID and Doctor ID are required");
  }

  try {
    const res = await axios.post("https://medimeet-1-kidp.onrender.com/api/credit/deduct", {
      userId,
      doctorId,
    });

    // The backend returns { success: true, user } or { success: false, error }
    return res.data;
  } catch (error) {
    console.error("Failed to deduct credits:", error);

    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }

    throw new Error("Failed to deduct credits: " + error.message);
  }
}
