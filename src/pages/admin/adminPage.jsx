import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { ShieldCheck, AlertCircle, Users, CreditCard } from "lucide-react";
import { getPendingDoctors, getPendingPayouts, getVerifiedDoctors, verifyAdmin } from "../../actions/admin";
import { useAuth } from "@clerk/clerk-react";
import { PageHeader } from "../../components/page-header";
import { PendingPayouts } from "./component/pending-payout";
import { PendingDoctors } from "./component/pending-doctor";
import { VerifiedDoctors } from "./component/verified-doctor";
import LoadingScreen from "../../components/loading";

export default function AdminPage() {
    const [pendingDoctorsData, setPendingDoctorsData] = useState({ doctors: [] });
    const [verifiedDoctorsData, setVerifiedDoctorsData] = useState({ doctors: [] });
    const [pendingPayoutsData, setPendingPayoutsData] = useState({ payouts: [] });
    const [loading, setLoading] = useState(true);
    const { userId } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
    async function fetchData(uid) {
        try {
            console.log("Fetching for userId:", uid);
            const isAdmin = await verifyAdmin(uid);
            if (!isAdmin) {
                navigate("/on-boarding");
                return;
            }

            const [pending, verified, payouts] = await Promise.all([
                getPendingDoctors(uid),
                getVerifiedDoctors(uid),
                getPendingPayouts(),
            ]);
            setPendingDoctorsData(pending || { doctors: [] });
            setVerifiedDoctorsData(verified || { doctors: [] });
            setPendingPayoutsData(payouts || { payouts: [] });
        } catch (err) {
            console.error("Error fetching admin data:", err);
        } finally {
            setLoading(false);
        }
    }

    if (userId) {
        fetchData(userId); // 👈 pass as argument instead of closing over stale value
    }
}, [navigate, userId]);


    if (loading) {
        return (<LoadingScreen/>)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader icon={<ShieldCheck />} title="Admin Settings" />

            {/* Vertical tabs on larger screens / Horizontal tabs on mobile */}
            <Tabs defaultValue="pending" className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <TabsList className="md:col-span-1 bg-muted/30 border h-14 md:h-40 flex sm:flex-row md:flex-col w-full p-2 md:p-1 rounded-md md:space-y-2 sm:space-x-2 md:space-x-0">
                    <TabsTrigger
                        value="pending"
                        className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full"
                    >
                        <AlertCircle className="h-4 w-4 mr-2 hidden md:inline" />
                        <span>Pending Verification</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="doctors"
                        className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full"
                    >
                        <Users className="h-4 w-4 mr-2 hidden md:inline" />
                        <span>Doctors</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="payouts"
                        className="flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full"
                    >
                        <CreditCard className="h-4 w-4 mr-2 hidden md:inline" />
                        <span>Payouts</span>
                    </TabsTrigger>
                </TabsList>

                <div className="md:col-span-3">
                    <TabsContent value="pending" className="border-none p-0">
                        <PendingDoctors doctors={pendingDoctorsData.doctors || []} />
                    </TabsContent>

                    <TabsContent value="doctors" className="border-none p-0">
                        <VerifiedDoctors doctors={verifiedDoctorsData.doctors || []} />
                    </TabsContent>

                    <TabsContent value="payouts" className="border-none p-0">
                        <PendingPayouts payouts={pendingPayoutsData.payouts || []} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
