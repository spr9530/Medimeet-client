import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // for redirects
import { AppointmentCard } from "../../components/appointment-card";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { getPatientAppointments } from "../../actions/patient";
import { PageHeader } from "../../components/page-header";
import { useAuth } from "@clerk/clerk-react";
import { getCurrentUser } from "../../actions/onBoarding";

const PatientAppointmentsPage = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const { userId } = useAuth();
    useEffect(() => {
        async function fetchUser() {
            const data = await getCurrentUser(userId)
            setUser(data);

            if (!data || data.role !== "patient") {
                navigate("/on-boarding");
            }
        }

        fetchUser();
    }, [navigate, userId]);

    // Fetch appointments
    useEffect(() => {
        async function fetchAppointments() {
            try {
                const { appointments } = await getPatientAppointments(userId);
                setAppointments(appointments || []);
            } catch (err) {
                setError("Failed to fetch appointments");
            }
        }

        if (user && user.role === "patient") {
            fetchAppointments();
        }
    }, [user]);

    return (
            <div className="container mx-auto px-4 py-8">
                <PageHeader
                    icon={<Calendar />}
                    title="My Appointments"
                    backLink="/doctors"
                    backLabel="Find Doctors"
                />

                <Card className="border-emerald-900/20">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-white flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-emerald-400" />
                            Your Scheduled Appointments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {error ? (
                            <div className="text-center py-8">
                                <p className="text-red-400">Error: {error}</p>
                            </div>
                        ) : appointments.length > 0 ? (
                            <div className="space-y-4">
                                {appointments.map((appointment) => (
                                    <AppointmentCard
                                        key={appointment._id} // MongoDB uses _id, not id
                                        appointment={appointment}
                                        userRole="patient"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                <h3 className="text-xl font-medium text-white mb-2">
                                    No appointments scheduled
                                </h3>
                                <p className="text-muted-foreground">
                                    You don&apos;t have any appointments scheduled yet. Browse our
                                    doctors and book your first consultation.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
        </div>
    );
};

export default PatientAppointmentsPage;
