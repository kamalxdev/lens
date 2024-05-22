"use client";

import { usePeer } from "@/provider/peer";
import { useSocket } from "@/provider/socket";
import { useCallback, useEffect } from "react";

export default function ({ params }: { params: { ID: string } }) {
  const ID = params.ID;
  // @ts-ignore
  const { socket } = useSocket();
  // @ts-ignore
  const { peer, createOffer, createAnswer } = usePeer();
  const handleNewUserJoined = useCallback(
    async (data: any) => {
      console.log("new User Joined", data);
      const offer = await createOffer();
      socket.emit("user:call", { email: data.email, offer });
    },
    [createOffer, socket]
  );

  const handleIncomingCall = useCallback(
    async (data: any) => {
      console.log("Incoming call", data);
      const answer = await createAnswer(data.offer);
      socket.emit("user:answer", { ...data, answer });
    },
    [socket, createAnswer]
  );

  const handleUserAnswer = useCallback(async (data: any) => {
    console.log("User Answer", data);
    
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleNewUserJoined);
    socket.on("user:incoming", handleIncomingCall);
    socket.on("user:answer", handleUserAnswer);
    // return () => {
    //   socket.off("user:joined", handleNewUserJoined);
    //   socket.off("user:incoming", handleIncomingCall);
    // };
  }, [handleNewUserJoined, socket, handleIncomingCall, handleUserAnswer]);
  return <div>Room Joined: {ID}</div>;
}
