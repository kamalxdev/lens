'use client';


import React, { useMemo } from 'react';



const PeerContext=React.createContext(null);


export const usePeer=()=> React.useContext(PeerContext);

export const PeerProvider=(props)=>{
    const peer = typeof window != "undefined" ? useMemo(() => new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    'stun:stun.l.google.com:19302',
                    'stun:global.stun.twilio.com:3478'
                ]
            }
        ]
    
    }), []) : null;

    const createOffer= async ()=>{
        const offer=await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    };

    const createAnswer= async ()=>{
        await peer.setRemoteDescription(offer)
        const answer=await peer.createOffer();
        await peer.setLocalDescription(answer);
        return answer;
    };

    return <PeerContext.Provider value={{peer,createOffer,createAnswer}}> 
        {props.children}
    </PeerContext.Provider>;
};