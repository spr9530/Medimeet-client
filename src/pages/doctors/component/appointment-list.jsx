import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Calendar } from "lucide-react";
import { AppointmentCard } from "../../../components/appointment-card";
import { getDoctorAppointments } from "../../../actions/doctor-time";
import { useAuth } from "@clerk/clerk-react";
import useFetch from "../../../hooks/useFetch";

export default function DoctorAppointmentsList() {
    const {userId} = useAuth();
    const {
        loading,
        data,
        fn: fetchAppointments,
    } = useFetch(getDoctorAppointments);

    useEffect(() => {
        fetchAppointments(userId);
    }, [userId]);

    const appointments = data?.appointments || [];

    return (
        <Card className="border-emerald-900/20">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-emerald-400" />
                    Upcoming Appointments
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Loading appointments...</p>
                    </div>
                ) : appointments.length > 0 ? (
                    <div className="space-y-4">
                        {appointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment._id} // MongoDB uses _id instead of id
                                appointment={appointment}
                                userRole="doctor"
                                refetchAppointments={fetchAppointments}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <h3 className="text-xl font-medium text-white mb-2">
                            No upcoming appointments
                        </h3>
                        <p className="text-muted-foreground">
                            You don&apos;t have any scheduled appointments yet. Make sure
                            you&apos;ve set your availability to allow patients to book.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
