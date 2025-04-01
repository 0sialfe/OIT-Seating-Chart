import { Request, Response } from 'express';
import { roomService } from '../services/roomService';
import type { Room } from '../types';

export class RoomController {
  getLayout = async (req: Request, res: Response) => {
    try {
      const layout = await roomService.getLayout();
      res.json(layout);
    } catch (error) {
      console.error('获取布局失败:', error);
      res.status(500).json({ error: '获取布局失败' });
    }
  };

  saveLayout = async (req: Request, res: Response) => {
    try {
      const layout = req.body;
      await roomService.saveLayout(layout);
      res.json({ message: '布局保存成功' });
    } catch (error) {
      console.error('保存布局失败:', error);
      res.status(500).json({ error: '保存布局失败' });
    }
  };

  saveRoom = async (req: Request, res: Response) => {
    try {
      const roomData: Room = req.body;
      
      // 基本验证
      if (!roomData.id || !roomData.name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const savedRoom = await roomService.saveRoom(roomData);
      res.json(savedRoom);
    } catch (error) {
      console.error('Error saving room:', error);
      res.status(500).json({ error: 'Failed to save room' });
    }
  };

  getRoom = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const room = await roomService.getRoom(id);
      
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      res.json(room);
    } catch (error) {
      console.error('Error getting room:', error);
      res.status(500).json({ error: 'Failed to get room' });
    }
  };

  getAllRooms = async (req: Request, res: Response) => {
    try {
      const rooms = await roomService.getAllRooms();
      res.json(rooms);
    } catch (error) {
      console.error('Error getting rooms:', error);
      res.status(500).json({ error: 'Failed to get rooms' });
    }
  };
} 