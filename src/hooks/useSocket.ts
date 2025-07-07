import { useEffect, useRef } from "react";
import io  from "socket.io-client";

const useSocket = (userId: string) => {
  const socket = useRef<any>(null);

  useEffect(() => {
    socket.current = io("http://localhost:3001");
    socket.current.emit("join", userId);

    return () => {
      socket.current.disconnect();
    };
  }, [userId]);

  return socket;
};

export default useSocket;