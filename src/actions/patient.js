import axios from "axios";
export async function getPatientAppointments(userId) {

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const res = await axios.get(
      `https://medimeet-1-kidp.onrender.com/api/patient/get-patient-appointment?userId=${userId}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    throw error;
  }
}
