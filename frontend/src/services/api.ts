import axios from 'axios';
import type { Room } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const roomApi = {
  async saveRoom(room: Room): Promise<Room> {
    const { data } = await api.post<Room>('/rooms', room);
    return data;
  },

  async getRoom(id: string): Promise<Room> {
    const { data } = await api.get<Room>(`/rooms/${id}`);
    return data;
  },

  async getAllRooms(): Promise<Room[]> {
    const { data } = await api.get<Room[]>('/rooms');
    return data;
  },
}; 