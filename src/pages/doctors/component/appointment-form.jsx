import React, { useState, useEffect } from "react";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { format } from "date-fns";
import { Loader2, Clock, ArrowLeft, Calendar, CreditCard } from "lucide-react";
import { toast } from "sonner";
import useFetch from "../../../hooks/useFetch";
import { bookAppointment } from "../../../actions/appointments";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";

export function AppointmentForm({ slot, onBack, onComplete }) {
  const [description, setDescription] = useState("");
  const { userId } = useAuth();
  const {doctorId} = useParams();

  const { loading, data, fn: submitBooking } = useFetch(bookAppointment);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      doctorId: doctorId,
      startTime: slot.startTime,
      endTime: slot.endTime,
      description,
      userId,
    };

    await submitBooking({ formData, userId });
  };

  useEffect(() => {
    if (data?.success) {
      toast.success("Appointment booked successfully!");
      onComplete();
    }
  }, [data, onComplete]);

  return (
    <>
      {userId ? <>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-muted/20 p-4 rounded-lg border border-emerald-900/20 space-y-3">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-emerald-400 mr-2" />
              <span className="text-white font-medium">
                {format(new Date(slot.startTime), "EEEE, MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-emerald-400 mr-2" />
              <span className="text-white">{slot.formatted}</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-emerald-400 mr-2" />
              <span className="text-muted-foreground">
                Cost: <span className="text-white font-medium">2 credits</span>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Describe your medical concern (optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Provide details about your medical concern..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background border-emerald-900/20 h-32"
            />
            <p className="text-sm text-muted-foreground">
              This information will be shared with the doctor before your appointment.
            </p>
          </div>

          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={loading}
              className="border-emerald-900/30"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Change Time Slot
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </div>
        </form>
      </> : <div>Loading</div>}
    </>
  );
}
