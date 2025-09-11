import { useLocation } from "react-router-dom";
import VideoCall from "./video-call-ui";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function VideoCallPage() {
  const query = useQuery();
  const channel = query.get("channel"); // previously sessionId
  const token = decodeURIComponent(query.get("token"));
  const appId = query.get("appId");
  const uid = query.get("uid") ;

  if (!channel || !token || !appId) return <p>Invalid video call parameters.</p>;

  return <VideoCall channel={channel} token={token} appId={appId} uid={uid} />;
}
