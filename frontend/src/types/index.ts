// 基础坐标接口
interface Position {
  x: number;
  y: number;
}

// 尺寸接口
interface Size {
  width: number;
  height: number;
}

// 用户接口
interface User {
  id: string;           // 纯小写英文字符ID
  name: string;         // 任意语言的名字
  department?: string;  // 可选的部门信息
  createdAt: Date;     // 创建时间
  updatedAt: Date;     // 更新时间
}

// 座位接口
export interface Seat {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  draggable: boolean;
}

// 房间/区域接口
export interface Room {
  id: string;
  name: string;
  seats: Seat[];
  createdAt: string;
  updatedAt: string;
}

// 用户-座位绑定记录
interface SeatAssignment {
  id: string;          // 绑定记录唯一标识
  seatId: string;      // 座位ID
  userId: string;      // 用户ID
  startDate: Date;     // 分配开始时间
  endDate?: Date;      // 分配结束时间（可选，用于临时分配）
  status: 'active' | 'expired' | 'cancelled';  // 分配状态
  createdAt: Date;     // 创建时间
  updatedAt: Date;     // 更新时间
}

export type {
  Position,
  Size,
  User,
  Seat,
  Room,
  SeatAssignment
} 