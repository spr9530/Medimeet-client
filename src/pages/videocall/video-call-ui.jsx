import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-sdk-ng";

export default function VideoCall({ channel, token, appId, uid }) {
  console.log('kjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj', token)
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const localVideoRef = useRef();
  const remoteContainerRef = useRef();
  const clientRef = useRef(null);
  const localTracksRef = useRef([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!channel || !token || !appId) {
      toast.error("Missing required video call parameters");
      navigate("/appointments");
      return;
    }

    console.log(appId)

    const initCall = async () => {
      try {
        const client = createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;

        await client.join(appId, channel, token, uid);

        const [microphoneTrack, cameraTrack] = await createMicrophoneAndCameraTracks();
        localTracksRef.current = [microphoneTrack, cameraTrack];
        cameraTrack.play(localVideoRef.current);

        await client.publish(localTracksRef.current);
        setIsConnected(true);
        setIsLoading(false);

        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "video") {
            const remoteDiv = document.createElement("div");
            remoteDiv.id = user.uid;
            remoteDiv.style.width = "100%";
            remoteDiv.style.height = "100%";
            remoteContainerRef.current.appendChild(remoteDiv);
            user.videoTrack.play(remoteDiv);
          }
          if (mediaType === "audio") {
            user.audioTrack.play();
          }
        });

        client.on("user-unpublished", (user) => {
          const remoteDiv = document.getElementById(user.uid);
          if (remoteDiv) remoteDiv.remove();
        });

        client.on("user-left", (user) => {
          const remoteDiv = document.getElementById(user.uid);
          if (remoteDiv) remoteDiv.remove();
        });
      } catch (error) {
        console.error("Failed to initialize Agora call:", error);
        toast.error("Failed to initialize video call");
        setIsLoading(false);
      }
    };

    initCall();

    return () => {
      // Cleanup on unmount
      localTracksRef.current.forEach(track => track.close());
      clientRef.current?.leave();
      clientRef.current = null;
    };
  }, [channel, token, appId, uid, navigate]);

  const toggleVideo = () => {
    if (localTracksRef.current[1]) {
      localTracksRef.current[1].setEnabled(!isVideoEnabled);
      setIsVideoEnabled(prev => !prev);
    }
  };

  const toggleAudio = () => {
    if (localTracksRef.current[0]) {
      localTracksRef.current[0].setEnabled(!isAudioEnabled);
      setIsAudioEnabled(prev => !prev);
    }
  };

  const endCall = () => {
    localTracksRef.current.forEach(track => track.close());
    clientRef.current?.leave();
    clientRef.current = null;
    navigate("/appointments");
  };

  if (!channel || !token || !appId) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Invalid Video Call
        </h1>
        <p className="text-muted-foreground mb-6">
          Missing required parameters for the video call.
        </p>
        <Button
          onClick={() => navigate("/appointments")}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Back to Appointments
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Video Consultation
        </h1>
        <p className="text-muted-foreground">
          {isConnected
            ? "Connected"
            : isLoading
            ? "Connecting..."
            : "Connection failed"}
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-emerald-400 animate-spin mb-4" />
          <p className="text-white text-lg">Loading video call components...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Local video */}
            <div className="border border-emerald-900/20 rounded-lg overflow-hidden">
              <div className="bg-emerald-900/10 px-3 py-2 text-emerald-400 text-sm font-medium">
                You
              </div>
              <div
                ref={localVideoRef}
                className="w-full h-[300px] md:h-[400px] bg-muted/30"
              >
                {!isVideoEnabled && (
                  <div className="flex items-center justify-center h-full">
                    <div className="bg-muted/20 rounded-full p-8">
                      <User className="h-12 w-12 text-emerald-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Remote video */}
            <div className="border border-emerald-900/20 rounded-lg overflow-hidden">
              <div className="bg-emerald-900/10 px-3 py-2 text-emerald-400 text-sm font-medium">
                Other Participant
              </div>
              <div
                ref={remoteContainerRef}
                className="w-full h-[300px] md:h-[400px] bg-muted/30"
              ></div>
            </div>
          </div>

          {/* Video controls */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              onClick={toggleVideo}
              className={`rounded-full p-4 h-14 w-14 ${
                isVideoEnabled
                  ? "border-emerald-900/30"
                  : "bg-red-900/20 border-red-900/30 text-red-400"
              }`}
            >
              {isVideoEnabled ? <Video /> : <VideoOff />}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={toggleAudio}
              className={`rounded-full p-4 h-14 w-14 ${
                isAudioEnabled
                  ? "border-emerald-900/30"
                  : "bg-red-900/20 border-red-900/30 text-red-400"
              }`}
            >
              {isAudioEnabled ? <Mic /> : <MicOff />}
            </Button>

            <Button
              variant="destructive"
              size="lg"
              onClick={endCall}
              className="rounded-full p-4 h-14 w-14 bg-red-600 hover:bg-red-700"
            >
              <PhoneOff />
            </Button>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              {isVideoEnabled ? "Camera on" : "Camera off"} •
              {isAudioEnabled ? " Microphone on" : " Microphone off"}
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              When you're finished with your consultation, click the red button
              to end the call
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
