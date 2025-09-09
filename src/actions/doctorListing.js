import axios from "axios";

export async function getDoctorBySpeciality(speciality) {
    try {
        console.log('called')
        const res = await axios.get(
            `https://medimeet-1-kidp.onrender.com/api/doctor/speciality?speciality=${encodeURIComponent(speciality)}`
        );
        return res.data;
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return { error: "Failed to fetch doctors" };
    }
}
