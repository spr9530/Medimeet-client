import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Calendar, Clock, DollarSign, Stethoscope, StethoscopeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PageHeader } from "../../components/page-header";
import { useAuth, useUser } from "@clerk/clerk-react";
import { getDoctorAppointments, getDoctorAvailabilityAPI } from "../../actions/doctor-time";
import DoctorAppointmentsList from "./component/appointment-list";
import { AvailabilitySettings } from "./component/availability-setting";
import { getCurrentUser } from "../../actions/onBoarding";
import { useUserContext } from "../../userContext/userContext";
import DoctorEarnings from "./doctorEarningsPage";
import { getDoctorEarnings, getDoctorPayouts } from "../../actions/payout";

export default function DoctorDashboardPage() {
    const [appointmentsData, setAppointmentsData] = useState([]);
    const [availabilityData, setAvailabilityData] = useState([]);
    const [earningsData, setEarningsData] = useState({});
    const [payoutsData, setPayoutsData] = useState([]);
    const navigate = useNavigate();
    const { userId } = useAuth()

    const { userInfo, saveUserInfo, userLoading } = useUserContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let info = userInfo;
                console.log(userInfo)

                if (!info) {
                    info = await saveUserInfo(); // 👈 wait for user info
                }

                // const user = await getCurrentUser(userId)

                if (info?.role !== "doctor") {
                    navigate("/on-boarding");
                    return;
                }

                if (info?.verificationStatus !== "verified") {
                    navigate("/doctor/verification");
                    return;
                }

                // Fetch doctor data in parallel
                const [appointmentsRes, payoutsRes, earningsRes, availabilityRes] = await Promise.all([
                    getDoctorAppointments(userId),
                    getDoctorPayouts(userId),
                    getDoctorEarnings(userId),
                    getDoctorAvailabilityAPI(userId),
                ]);
                setAppointmentsData(appointmentsRes.appointments || []);
                setAvailabilityData(availabilityRes.slots || []);
                setEarningsData(earningsRes.earnings || {});
                setPayoutsData(payoutsRes.payouts || []);
            } catch (error) {
                console.error("Error fetching doctor dashboard data:", error);
            }
        };

        fetchData();
    }, [navigate, userId, userInfo, saveUserInfo]);

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader icon={<StethoscopeIcon />} title="Doctor Dashboard" />
            <Tabs defaultValue="earnings" className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <TabsList className="md:col-span-1 bg-muted/30 border h-14 md:h-40 flex sm:flex-row md:flex-col w-full p-2 md:p-1 rounded-md md:space-y-2 sm:space-x-2 md:space-x-0">
                    <TabsTrigger
                        value="earnings"
                        className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full"
                    >
                        <DollarSign className="h-4 w-4 mr-2 hidden md:inline" />
                        <span>Earnings</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="appointments"
                        className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full"
                    >
                        <Calendar className="h-4 w-4 mr-2 hidden md:inline" />
                        <span>Appointments</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="availability"
                        className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full"
                    >
                        <Clock className="h-4 w-4 mr-2 hidden md:inline" />
                        <span>Availability</span>
                    </TabsTrigger>
                </TabsList>

                <div className="md:col-span-3">
                    <TabsContent value="appointments" className="border-none p-0">
                        <DoctorAppointmentsList appointments={appointmentsData} />
                    </TabsContent>
                    <TabsContent value="availability" className="border-none p-0">
                        <AvailabilitySettings slots={availabilityData} />
                    </TabsContent>
                    <TabsContent value="earnings" className="border-none p-0">
                        <DoctorEarnings earnings={earningsData} payouts={payoutsData} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
