import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { getCurrentUser } from "../actions/onBoarding";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [userInfo, setUser] = useState(null);
    const [userSignedIn, setUserSignedIn] = useState(false);
    const [userLoading, setUserLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const { user, isSignedIn, isLoaded } = useUser();

    const saveUserInfo = async () => {
        if (!isSignedIn || !user) return;
        setUserLoading(true);
        try {
            const res = await getCurrentUser(user.id);
            setUserRole(res.role);
            console.log(res)
            setUserSignedIn(true);
            setUser(res);
            return res;
        } catch (err) {
            console.error("Error saving user info:", err);
        } finally {
            setUserLoading(false);
        }
    };

    const removeUserInfo = () => {
        setUser(null);
        setUserSignedIn(false);
        setUserRole(null);
    };

    // 👇 Watch Clerk loading state
    useEffect(() => {
        const init = async () => {
            if (!isLoaded) {
                setUserLoading(true);
                return;
            }

            if (isLoaded && isSignedIn && user) {
                await saveUserInfo();
            } else if (isLoaded && !isSignedIn) {
                removeUserInfo();
                setUserLoading(false);
            }
        }
        init()
    }, [isLoaded, isSignedIn, user]);

    return (
        <UserContext.Provider
            value={{
                user,
                userInfo,
                isSignedIn,
                userRole,
                userLoading,
                userSignedIn,
                saveUserInfo,
                removeUserInfo,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

// custom hook
export function useUserContext() {
    return useContext(UserContext);
}
