import axios from "axios";


export async function getDoctorById(doctorId) {
  try {
    const res = await axios.get(`https://medimeet-1-kidp.onrender.com/api/doctor/get-detail?doctorId=${doctorId}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function getAvailableTimeSlots(doctorId) {
  try {
    const res = await axios.get(
      `https://medimeet-1-kidp.onrender.com/api/doctor/get-available-timeslots?doctorId=${doctorId}`
    );
    return res.data; // This will contain { days: [...] }
  } catch (error) {
    console.error("Failed to fetch available time slots:", error);
    throw error;
  }
}

export async function bookAppointment({ formData, userId }) {
  if (!userId) {
    throw new Error("Unauthorized: User not logged in");
  }

  try {
    const res = await axios.post("https://medimeet-1-kidp.onrender.com/api/appointments/book", {
      formData,
      userId,
    });

    console.log(res.data)
    return res.data;
  } catch (error) {
    console.error("Failed to book appointment:", error);

    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }

    throw new Error("Failed to book appointment: " + error.message);
  }
}

export async function generateVideoToken({formData, userId}) {

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Make POST request to backend route
    const res = await axios.post("https://medimeet-1-kidp.onrender.com/api/appointments/genrate-video-token", formData);
      return  res.data
  } catch (error) {
    console.error("Error generating video token:", error);
    throw new Error(error.response?.data?.error || error.message);
  }
}