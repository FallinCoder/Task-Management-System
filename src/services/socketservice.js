import { io } from 'socket.io-client';
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

let socket;

export const useSocket = () => {
  const { user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (user && !socketRef.current) {
      socketRef.current = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      socketRef.current.emit('join', user.id);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  return socketRef.current;
};

export const SocketProvider = ({ children }) => {
  useSocket();
  return children;
};