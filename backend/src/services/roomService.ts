import fs from 'fs';
import path from 'path';
import type { Room } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const ROOMS_FILE = path.join(DATA_DIR, 'rooms.json');

class RoomService {
  constructor() {
    // 确保数据目录存在
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private async readRooms(): Promise<Room[]> {
    try {
      if (!fs.existsSync(ROOMS_FILE)) {
        return [];
      }
      const data = await fs.promises.readFile(ROOMS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('读取房间数据失败:', error);
      return [];
    }
  }

  private async writeRooms(rooms: Room[]): Promise<void> {
    try {
      await fs.promises.writeFile(ROOMS_FILE, JSON.stringify(rooms, null, 2));
    } catch (error) {
      console.error('保存房间数据失败:', error);
      throw error;
    }
  }

  async saveRoom(room: Room): Promise<Room> {
    const rooms = await this.readRooms();
    const existingIndex = rooms.findIndex(r => r.id === room.id);
    
    if (existingIndex >= 0) {
      // 更新现有房间
      rooms[existingIndex] = {
        ...room,
        updatedAt: new Date().toISOString()
      };
    } else {
      // 添加新房间
      rooms.push({
        ...room,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    await this.writeRooms(rooms);
    return room;
  }

  async getRoom(id: string): Promise<Room | null> {
    const rooms = await this.readRooms();
    return rooms.find(room => room.id === id) || null;
  }

  async getAllRooms(): Promise<Room[]> {
    return this.readRooms();
  }

  async getLayout(): Promise<Room> {
    const rooms = await this.readRooms();
    const layout = rooms.find(room => room.id === 'layout');
    
    if (!layout) {
      // 如果没有布局，创建一个默认布局
      const defaultLayout: Room = {
        id: 'layout',
        name: '默认布局',
        seats: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await this.saveRoom(defaultLayout);
      return defaultLayout;
    }
    
    return layout;
  }

  async saveLayout(layout: Room): Promise<void> {
    layout.id = 'layout';
    await this.saveRoom(layout);
  }
}

export const roomService = new RoomService(); 