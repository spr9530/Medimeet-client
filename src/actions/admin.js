import axios from "axios";

export async function verifyAdmin(userId) {
               
    try {
        // Send userId as query param
        const res = await axios.get(`https://medimeet-1-kidp.onrender.com/api/admin/verify?userId=${userId}`, {
        });

        return res.data;
    } catch (error) {
        console.error("❌ Error calling backend:", error);
        return { success: false, error: error.message };
    }
};


export async function getPendingDoctors(userId) {
    const res = await verifyAdmin(userId);
    if (!res.isAdmin) throw new Error("Unauthorized");

    try {
        const res = axios.get('https://medimeet-1-kidp.onrender.com/api/admin/pending-doctors')

        return (await res).data;

    } catch (error) {
        throw new Error("Failed to fetch pending doctors");
    }
}

export async function getVerifiedDoctors(userId) {
    const res = await verifyAdmin(userId);
    if (!res.isAdmin) throw new Error("Unauthorized");

    try {
        const res = axios.get('https://medimeet-1-kidp.onrender.com/api/admin/verified-doctors')

        return (await res).data;

    } catch (error) {
        throw new Error("Failed to fetch pending doctors");
    }
}

export async function updateDoctorInfo(formData) {

    const doctorId = formData.get("doctorId");
    const status = formData.get("status");
    const userId = formData.get("userId");
    const res = await verifyAdmin(userId);
    if (!res.isAdmin) throw new Error("Unauthorized");
    if (!doctorId || !["verified", "rejected"].includes(status)) {
        throw new Error("Invalid input");
    }

    try {
        const response = await axios.put("https://medimeet-1-kidp.onrender.com/api/admin/update-doctor-status", {
            doctorId,
            status,
        });

        return response.data;
    } catch (error) {
        console.error("Error updating doctor info:", error);
        throw error;
    }

}

export async function updateDoctorActiveStatus(formData) {
    const doctorId = formData.get("doctorId");
    const suspend = formData.get("suspend");
    const userId = formData.get("userId");
    const res = await verifyAdmin(userId);
    if (!res.isAdmin) throw new Error("Unauthorized");
    try {
        const res = await axios.put("https://medimeet-1-kidp.onrender.com/api/admin/update-doctor-status-suspend", {
            doctorId,
            suspend,
        });

        return res.data;
    } catch (error) {
        console.error("Error updating doctor status:", error);
        throw error.response?.data || { message: "Failed to update doctor status" };
    }
}

export async function getPendingPayouts() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }
    try {
        const res = await axios.get("https://medimeet-1-kidp.onrender.com/api/payout/pending");
        return res.data; // { payouts: [...] }
    } catch (error) {
        console.error("Error fetching pending payouts:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch pending payouts");
    }
}

export async function approvePayout({formData, userId}) {
    const payoutId = formData.get("payoutId");
     if (!payoutId) {
        throw new Error("Payout ID is required");
    }

    try {
        const res = await axios.post("https://medimeet-1-kidp.onrender.com/api/payout/approve", {
            payoutId,
            userId
        });

        return res.data; // { success: true }
    } catch (error) {
        console.error("Error approving payout:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to approve payout");
    }
}