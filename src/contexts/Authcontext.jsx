import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const authContext = createContext(null);

// Helpers — callable from any component
export function saveUserId(id) {
    if (id) localStorage.setItem("userId", id);
}
export function saveUserPhoto(photo) {
    if (photo) localStorage.setItem("userPhoto", photo);
}

export default function AuthContextProvider({ children }) {
    const [userToken, setUserToken] = useState(() => localStorage.getItem("token") || null);
    const [userId, setUserId] = useState(() => localStorage.getItem("userId") || null);
    const [userPhoto, setUserPhoto] = useState(() => localStorage.getItem("userPhoto") || null);
    const [userName, setUserName] = useState(() => localStorage.getItem("userName") || null);

    useEffect(() => {
        if (!userToken) {
            setUserId(null);
            setUserPhoto(null);
            setUserName(null);
            localStorage.removeItem("userId");
            localStorage.removeItem("userPhoto");
            localStorage.removeItem("userName");
            return;
        }

        // Fetch real profile data from the correct endpoint
        async function fetchProfile() {
            try {
                const { data } = await axios.get(
                    "https://route-posts.routemisr.com/users/profile-data",
                    { headers: { token: userToken } }
                );

                // Unwrap the user object however it comes
                const u =
                    data?.data?.user ||
                    data?.data ||
                    data?.user ||
                    null;

                if (u) {
                    if (u._id) { setUserId(u._id); localStorage.setItem("userId", u._id); }
                    if (u.photo) { setUserPhoto(u.photo); localStorage.setItem("userPhoto", u.photo); }
                    if (u.name) { setUserName(u.name); localStorage.setItem("userName", u.name); }
                }
            } catch {
                // Fallback: JWT decode for userId only
                try {
                    const payload = JSON.parse(atob(userToken.split('.')[1]));
                    const id = payload.id || payload._id || payload.userId || payload.sub || payload.user_id || null;
                    if (id) { setUserId(id); localStorage.setItem("userId", id); }
                } catch { }
            }
        }

        fetchProfile();
    }, [userToken]);

    return (
        <authContext.Provider value={{
            userToken, setUserToken,
            userId, setUserId,
            userPhoto, setUserPhoto,
            userName, setUserName,
        }}>
            {children}
        </authContext.Provider>
    );
}
