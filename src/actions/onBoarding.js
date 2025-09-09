import axios from "axios";
export async function setUserRole(formData) {
    try {
        // if (!formData.userId) throw new Error("User not authenticated");

        const res = await axios.post(
            "https://medimeet-1-kidp.onrender.com/api/user/roles",
            formData,
            { headers: { "Content-Type": "application/json" } }
        );
        return res.data;
    } catch (error) {
        console.error("❌ Error calling backend:", error);
        return { success: false, error: error.message };
    }
}

export async function getCurrentUser(userId) {
    
    if (!userId) throw new Error("User not authenticated");

    try {
        const res = await axios.get(`https://medimeet-1-kidp.onrender.com/api/user/current?userId=${userId}`, {
            params: { userId }, // sends ?userId=123
        });

        return res.data.user;
    } catch (error) {
        console.error("❌ Failed to fetch current user:", error);
        return null;
    }
}
