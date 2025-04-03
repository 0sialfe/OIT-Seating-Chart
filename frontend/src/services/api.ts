import axios from 'axios';
import type { Room } from '../types';
import type { Seat } from '@/stores/seating';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const roomApi = {
  async saveRoom(room: Room): Promise<Room> {
    if (room.id === 'layout') {
      const { data } = await api.post<Room>('/rooms/layout', room);
      return data;
    }
    const { data } = await api.post<Room>('/rooms', room);
    return data;
  },

  async getRoom(id: string): Promise<Room> {
    if (id === 'layout') {
      const { data } = await api.get<Room>('/rooms/layout');
      return data;
    }
    const { data } = await api.get<Room>(`/rooms/${id}`);
    return data;
  },

  async getAllRooms(): Promise<Room[]> {
    const { data } = await api.get<Room[]>('/rooms');
    return data;
  },
};

// 导出兼容性函数
export const saveRoom = async (seats: Seat[]) => {
  try {
    const now = new Date().toISOString();
    const response = await roomApi.saveRoom({
      id: 'layout',
      name: '默认布局',
      seats: seats.map(seat => ({
        ...seat,
        fill: seat.type === 'slot' ? '#e0e0e0' : '#90caf9',
        stroke: '#666',
        strokeWidth: 2,
        draggable: true
      })),
      createdAt: now,
      updatedAt: now
    });
    return response;
  } catch (error) {
    console.error('保存房间布局失败:', error);
    throw error;
  }
};

export const getRoom = async () => {
  try {
    const response = await roomApi.getRoom('layout');
    return response.seats || [];
  } catch (error) {
    console.error('获取房间布局失败:', error);
    throw error;
  }
}; 