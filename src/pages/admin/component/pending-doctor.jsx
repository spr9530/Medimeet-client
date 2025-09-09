import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Check, X, User, Medal, FileText, ExternalLink } from "lucide-react";
import { Separator } from "../../../components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { format } from "date-fns";
import { BarLoader } from "react-spinners";
import axios from "axios";
import useFetch from "../../../hooks/useFetch";
import { updateDoctorInfo } from "../../../actions/admin";
import { useUser } from "@clerk/clerk-react";

export function PendingDoctors({ doctors, refreshDoctors }) {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const {
        loading,
        data,
        fn: submitStatusUpdate,
    } = useFetch(updateDoctorInfo);

    const { user } = useUser();
        const userId = user?.id;

    // Open doctor details dialog
    const handleViewDetails = (doctor) => {
        setSelectedDoctor(doctor);
    };

    // Close doctor details dialog
    const handleCloseDialog = () => {
        setSelectedDoctor(null);
    };
            console.log(userId)

    // Handle approve or reject doctor
    const handleUpdateStatus = async (doctorId, status) => {
        if (loading) return;
        try {

            const formData = new FormData();
            formData.append("doctorId", doctorId);
            formData.append("status", status);
            formData.append("userId", userId);
            await submitStatusUpdate(formData);

            handleCloseDialog();

            if (refreshDoctors) refreshDoctors();
        } catch (error) {
            console.error("❌ Failed to update doctor:", error);
        } finally {
        }
    };

    return (
        <div>
            <Card className="bg-muted/20 border-emerald-900/20">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Pending Doctor Verifications</CardTitle>
                    <CardDescription>Review and approve doctor applications</CardDescription>
                </CardHeader>
                <CardContent>
                    {doctors.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No pending verification requests at this time.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {doctors.map((doctor) => (
                                <Card
                                    key={doctor._id}
                                    className="bg-background border-emerald-900/20 hover:border-emerald-700/30 transition-all"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-muted/20 rounded-full p-2">
                                                    <User className="h-5 w-5 text-emerald-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{doctor.name}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {doctor.specialty} • {doctor.experience} years experience
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 self-end md:self-auto">
                                                <Badge
                                                    variant="outline"
                                                    className="bg-amber-900/20 border-amber-900/30 text-amber-400"
                                                >
                                                    Pending
                                                </Badge>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(doctor)}
                                                    className="border-emerald-900/30 hover:bg-muted/80"
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Doctor Details Dialog */}
            {selectedDoctor && (
                <Dialog open={!!selectedDoctor} onOpenChange={handleCloseDialog}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Doctor Verification Details</DialogTitle>
                            <DialogDescription>
                                Review the doctor's information carefully before making a decision
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Basic Info */}
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="space-y-1 flex-1">
                                    <h4 className="text-sm font-medium">Full Name</h4>
                                    <p className="text-base font-medium">{selectedDoctor.name}</p>
                                </div>
                                <div className="space-y-1 flex-1">
                                    <h4 className="text-sm font-medium">Email</h4>
                                    <p className="text-base font-medium">{selectedDoctor.email}</p>
                                </div>
                                <div className="space-y-1 flex-1">
                                    <h4 className="text-sm font-medium">Application Date</h4>
                                    <p className="text-base font-medium">
                                        {format(new Date(selectedDoctor.createdAt), "PPP")}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            {/* Professional Details */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Medal className="h-5 w-5 text-emerald-400" />
                                    <h3 className="font-medium">Professional Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-medium">Specialty</h4>
                                        <p>{selectedDoctor.specialty}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <h4 className="text-sm font-medium">Years of Experience</h4>
                                        <p>{selectedDoctor.experience} years</p>
                                    </div>

                                    <div className="space-y-1 col-span-2">
                                        <h4 className="text-sm font-medium">Credentials</h4>
                                        <div className="flex items-center">
                                            <a
                                                href={selectedDoctor.credentialUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-emerald-400 hover:text-emerald-300 flex items-center"
                                            >
                                                View Credentials
                                                <ExternalLink className="h-4 w-4 ml-1" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Description */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-emerald-400" />
                                    <h3 className="font-medium">Service Description</h3>
                                </div>
                                <p className="whitespace-pre-line">{selectedDoctor.description}</p>
                            </div>
                        </div>

                        {loading && <BarLoader width={"100%"} color="#36d7b7" />}

                        <DialogFooter className="flex sm:justify-between">
                            <Button
                                variant="destructive"
                                onClick={() => handleUpdateStatus(selectedDoctor._id, "rejected")}
                                disabled={loading}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                <X className="mr-2 h-4 w-4" />
                                Reject
                            </Button>
                            <Button
                                onClick={() => handleUpdateStatus(selectedDoctor._id, "verified")}
                                disabled={loading}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
