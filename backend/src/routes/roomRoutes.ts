import express from 'express';
import { RoomController } from '../controllers/roomController';

const router = express.Router();
const roomController = new RoomController();

// 获取房间布局
router.get('/rooms/layout', roomController.getLayout);

// 保存房间布局
router.post('/rooms/layout', roomController.saveLayout);

export { router as roomRoutes }; 