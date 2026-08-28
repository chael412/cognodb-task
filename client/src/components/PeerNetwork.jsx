import { useState, useEffect } from "react";
import { fetchPeerNetwork } from "../services/api";


export default function PeerNetwork({ studentId }) {
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPeerNetwork(studentId)
      .then(setPeers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <p>Loading peers...</p>;

  return (
    <div>
      <h3>Peer Network for {studentId}</h3>
      <ul>
        {peers.map((peer, idx) => (
          <li key={idx}>
            <strong>{peer.peerName}</strong> (Taught by {peer.teacherName} in {peer.subjectName})
          </li>
        ))}
      </ul>
    </div>
  );
}