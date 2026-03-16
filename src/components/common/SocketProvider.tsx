'use client';

import { notificationApi } from '@/features/notification/notificationApi';
import { useGetMyProfileQuery } from '@/features/profile/profileApi';
import { baseURL } from '@/utils/BaseURL';
import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();

  // Get token to skip query if not logged in
  const token = typeof window !== 'undefined' ? localStorage.getItem('PharmacyAdmin') : null;

  // Get user profile to have the ID for listening to events
  const { data: profileRes } = useGetMyProfileQuery(undefined, {
    skip: !token
  });
  const user = profileRes?.data;
  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;

    // Initialize socket connection
    const socketInstance = io(baseURL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    interface NotificationPayload {
      title?: string;
      body?: string;
    }

    // Handler for new notifications
    const handleNotification = (data: NotificationPayload) => {
      console.log('Received real-time notification:', data);

      if (data?.title || data?.body) {
        toast.success(`${data.title || 'Notification'}: ${data.body || ''}`, {
          duration: 4000,
          position: 'top-right',
        });
      }

      // Invalidate tags to refresh data globally
      dispatch(notificationApi.util.invalidateTags(['NotificationCount', 'Notification']));
    };

    // Listen for personalized and general notifications
    socketInstance.on(`notification::${userId}`, handleNotification);
    socketInstance.on('notification', handleNotification);

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userId, dispatch]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
