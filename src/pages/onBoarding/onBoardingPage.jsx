// OnboardingPage.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom"; // React Router
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { User, Stethoscope, Loader2 } from "lucide-react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { doctorFormSchema } from "../../lib/schema";
import { SPECIALTIES } from "../../lib/specialities";
import useFetch from "../../hooks/useFetch";
import { getCurrentUser, setUserRole } from "../../actions/onBoarding";
import { useAuth } from "@clerk/clerk-react";
import { useUserContext } from "../../userContext/userContext";
import LoadingScreen from "../../components/loading";

export default function OnboardingPage() {
    const [step, setStep] = useState("choose-role");
    const navigate = useNavigate();
    const { userId } = useAuth();
    //   wip protector route
    const { userInfo, saveUserInfo, userLoading } = useUserContext()
    const { loading, data, fn: submitUserRole } = useFetch(setUserRole);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(doctorFormSchema),
        defaultValues: {
            specialty: "",
            experience: undefined,
            credentialUrl: "",
            description: "",
        },
    });

    const specialtyValue = watch("specialty");

    const handlePatientSelection = async () => {
        if (loading) return;

        const formData = new FormData();
        formData.append("role", "patient");
        formData.append("userId", userId);

        await submitUserRole(formData); // 👈 use return value
        await saveUserInfo()
    };

    // Handle doctor form submission
    const onDoctorSubmit = async (formData) => {
        if (loading) return;

        const payload = new FormData();
        payload.append("role", "doctor");
        payload.append("specialty", formData.specialty);
        payload.append("experience", formData.experience.toString());
        payload.append("credentialUrl", formData.credentialUrl);
        payload.append("description", formData.description);
        payload.append("userId", userId);

        await submitUserRole(payload);
        await saveUserInfo()
    };



    useEffect(() => {
        if (userInfo && userInfo.role === 'patient') {
            navigate('/doctors', { replace: true });
        } else if (userInfo && userInfo.role === 'doctor') {
            navigate('/doctor', { replace: true });
        } else if (userInfo && userInfo.role === 'admin') {
            navigate('/admin', { replace: true });
        }
    }, [userInfo, navigate]);


    // Handle doctor form submission
    // const onDoctorSubmit = async (formData) => {
    //     if (loading) return;

    //     const payload = new FormData();
    //     payload.append("role", "doctor");
    //     payload.append("specialty", formData.specialty);
    //     payload.append("experience", formData.experience.toString());
    //     payload.append("credentialUrl", formData.credentialUrl);
    //     payload.append("description", formData.description);
    //     payload.append("userId", userId)


    //     await submitUserRole(payload);
    //     await saveUserInfo();
    //     if (data.success) {
    //         navigate(res.redirect)
    //     }
    // };

    // Step 1: Role selection
    if (step === "choose-role") {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome to MediMeet
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Tell us how you want to use the platform
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card
                            className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
                            onClick={() => !loading && handlePatientSelection()}
                        >
                            <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                                <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
                                    <User className="h-8 w-8 text-emerald-400" />
                                </div>
                                <CardTitle className="text-xl font-semibold text-white mb-2">
                                    Join as a Patient
                                </CardTitle>
                                <CardDescription className="mb-4">
                                    Book appointments, consult with doctors, and manage your
                                    healthcare journey
                                </CardDescription>
                                <Button
                                    className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Continue as Patient"
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card
                            className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
                            onClick={() => !loading && setStep("doctor-form")}
                        >
                            <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                                <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
                                    <Stethoscope className="h-8 w-8 text-emerald-400" />
                                </div>
                                <CardTitle className="text-xl font-semibold text-white mb-2">
                                    Join as a Doctor
                                </CardTitle>
                                <CardDescription className="mb-4">
                                    Create your professional profile, set your availability, and
                                    provide consultations
                                </CardDescription>
                                <Button
                                    className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
                                    disabled={loading}
                                >
                                    Continue as Doctor
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // Step 2: Doctor registration form
    if (step === "doctor-form") {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <Card className="border-emerald-900/20">
                        <CardContent className="pt-6">
                            <div className="mb-6">
                                <CardTitle className="text-2xl font-bold text-white mb-2">
                                    Complete Your Doctor Profile
                                </CardTitle>
                                <CardDescription>
                                    Please provide your professional details for verification
                                </CardDescription>
                            </div>

                            <form onSubmit={handleSubmit(onDoctorSubmit)} className="space-y-6">
                                {/* Specialty */}
                                <div className="space-y-2">
                                    <Label htmlFor="specialty">Medical Specialty</Label>
                                    <Select
                                        value={specialtyValue}
                                        onValueChange={(value) => setValue("specialty", value)}
                                    >
                                        <SelectTrigger id="specialty">
                                            <SelectValue placeholder="Select your specialty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SPECIALTIES.map((spec) => (
                                                <SelectItem
                                                    key={spec.name}
                                                    value={spec.name}
                                                    className="flex items-center gap-2"
                                                >
                                                    <span className="text-emerald-400">{spec.icon}</span>
                                                    {spec.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.specialty && (
                                        <p className="text-sm font-medium text-red-500 mt-1">
                                            {errors.specialty.message}
                                        </p>
                                    )}
                                </div>

                                {/* Experience */}
                                <div className="space-y-2">
                                    <Label htmlFor="experience">Years of Experience</Label>
                                    <Input
                                        id="experience"
                                        type="number"
                                        placeholder="e.g. 5"
                                        {...register("experience", { valueAsNumber: true })}
                                    />
                                    {errors.experience && (
                                        <p className="text-sm font-medium text-red-500 mt-1">
                                            {errors.experience.message}
                                        </p>
                                    )}
                                </div>

                                {/* Credential URL */}
                                <div className="space-y-2">
                                    <Label htmlFor="credentialUrl">Link to Credential Document</Label>
                                    <Input
                                        id="credentialUrl"
                                        type="url"
                                        placeholder="https://example.com/my-medical-degree.pdf"
                                        {...register("credentialUrl")}
                                    />
                                    {errors.credentialUrl && (
                                        <p className="text-sm font-medium text-red-500 mt-1">
                                            {errors.credentialUrl.message}
                                        </p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        Please provide a link to your medical degree or certification
                                    </p>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description of Your Services</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe your expertise, services, and approach to patient care..."
                                        rows="4"
                                        {...register("description")}
                                    />
                                    {errors.description && (
                                        <p className="text-sm font-medium text-red-500 mt-1">
                                            {errors.description.message}
                                        </p>
                                    )}
                                </div>

                                {/* Form Buttons */}
                                <div className="pt-2 flex items-center justify-between">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep("choose-role")}
                                        className="border-emerald-900/30"
                                        disabled={loading}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit for Verification"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div >
        );
    }

    if (userLoading) {
        return (
            <LoadingScreen />
        )
    }

    return null;
}
