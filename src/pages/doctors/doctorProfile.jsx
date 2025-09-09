import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // if using react-router
import { getAvailableTimeSlots, getDoctorById } from "../../actions/appointments";
import { DoctorProfile } from "./component/doctor-profile";
import { PageHeader } from "../../components/page-header";
import { StethoscopeIcon } from "lucide-react";

export default function DoctorProfilePage() {
    const [availableDays, setAvailableDays] = useState([]);
    const [doctor, setDoctor] = useState(null)
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // for redirect
    const { doctorId } = useParams();

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch doctor and slots in parallel
                const [doctorData, slotsData] = await Promise.all([
                    getDoctorById(doctorId),
                    getAvailableTimeSlots(doctorId),
                ]);

                setDoctor(doctorData.doctor);
                setAvailableDays(slotsData.days || []);
                setLoading(false);
            } catch (error) {
                console.error("Error loading doctor profile:", error);
                // navigate("/doctors"); // redirect if error
            }
        }

        fetchData();
    }, [doctorId, navigate]);

    if (loading) return <div>Loading...</div>;
    if (!doctor) return <div>Doctor not found</div>;

    return (
        <div className="container mx-auto my-20">
            <div className="container mx-auto">
                <PageHeader
                    icon={<StethoscopeIcon />}
                    title={"Dr. " + doctor.name}
                    backLink={`/doctors/${doctor.specialty}`}
                    backLabel={`Back to ${doctor.specialty}`}
                />
                <DoctorProfile doctor={doctor} availableDays={availableDays} />
            </div>
        </div>
    )
}
