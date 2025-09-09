// VerificationPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ClipboardCheck, AlertCircle, XCircle, Stethoscope } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { PageHeader } from "../../../components/page-header";
import { useAuth } from "@clerk/clerk-react";
import { getCurrentUser } from "../../../actions/onBoarding";

export default function VerificationPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const {userId} = useAuth()

  useEffect(() => {
    const fetchUser = async () => {
      const profile = await getCurrentUser(userId);

      if (profile?.verificationStatus === "verified") {
        navigate("/doctor"); // redirect if already verified
      } else {
        setUser(profile);
      }
    };

    fetchUser();
  }, [navigate, userId]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  }

  const isRejected = user?.verificationStatus === "REJECTED";

  return (
    <div className="container mx-auto px-4 py-8">
        <PageHeader icon={<Stethoscope />} title="Doctor Dashboard" />
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="border-emerald-900/20">
          <CardHeader className="text-center">
            <div
              className={`mx-auto p-4 ${
                isRejected ? "bg-red-900/20" : "bg-amber-900/20"
              } rounded-full mb-4 w-fit`}
            >
              {isRejected ? (
                <XCircle className="h-8 w-8 text-red-400" />
              ) : (
                <ClipboardCheck className="h-8 w-8 text-amber-400" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              {isRejected ? "Verification Declined" : "Verification in Progress"}
            </CardTitle>
            <CardDescription className="text-lg">
              {isRejected
                ? "Unfortunately, your application needs revision"
                : "Thank you for submitting your information"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {isRejected ? (
              <div className="bg-red-900/10 border border-red-900/20 rounded-lg p-4 mb-6 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-muted-foreground text-left">
                  <p className="mb-2">
                    Our administrative team has reviewed your application and
                    found that it doesn&apos;t meet our current requirements.
                    Common reasons for rejection include:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mb-3">
                    <li>Insufficient or unclear credential documentation</li>
                    <li>Professional experience requirements not met</li>
                    <li>Incomplete or vague service description</li>
                  </ul>
                  <p>
                    You can update your application with more information and
                    resubmit for review.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-amber-900/10 border border-amber-900/20 rounded-lg p-4 mb-6 flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground text-left">
                  Your profile is currently under review by our administrative
                  team. This process typically takes 1-2 business days. You&apos;ll
                  receive an email notification once your account is verified.
                </p>
              </div>
            )}

            <p className="text-muted-foreground mb-6">
              {isRejected
                ? "You can update your doctor profile and resubmit for verification."
                : "While you wait, you can familiarize yourself with our platform or reach out to our support team if you have any questions."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isRejected ? (
                <>
                  <Button
                    variant="outline"
                    className="border-emerald-900/30"
                    asChild
                  >
                    <Link to="/">Return to Home</Link>
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    asChild
                  >
                    <Link to="/doctor/update-profile">Update Profile</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-emerald-900/30"
                    asChild
                  >
                    <Link to="/">Return to Home</Link>
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    asChild
                  >
                    <Link to="/contact-support">Contact Support</Link>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}
