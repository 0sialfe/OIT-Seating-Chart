import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { saveRoom, getRoom } from '@/services/api';

export interface Seat {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  type: 'slot' | 'employee';
}

export const useSeatingStore = defineStore('seating', () => {
  const seats = ref<Seat[]>([]);
  const isEditMode = ref(false);
  const selectedSeat = ref<Seat | null>(null);
  const isAddingSeat = ref(false);
  const isAddingEmployee = ref(false);
  const gridSize = ref(20); // 设置网格大小为20像素
  const stageConfig = ref({
    width: window.innerWidth - 40,
    height: window.innerHeight - 120
  });

  // 吸附到网格函数
  const snapToGrid = (value: number): number => {
    return Math.round(value / gridSize.value) * gridSize.value;
  };

  const toggleEditMode = () => {
    isEditMode.value = !isEditMode.value;
    console.log('切换编辑模式:', isEditMode.value);
    if (!isEditMode.value) {
      selectedSeat.value = null;
      isAddingSeat.value = false;
      isAddingEmployee.value = false;
      console.log('清除选中的座位和添加状态');
    }
  };

  const setAddingSeat = (value: boolean) => {
    isAddingSeat.value = value;
    console.log('设置添加座位状态:', value);
  };

  const setAddingEmployee = (value: boolean) => {
    isAddingEmployee.value = value;
    console.log('设置添加员工状态:', value);
  };

  const addSeat = (x: number, y: number, type: 'slot' | 'employee' = 'slot') => {
    if (!isEditMode.value) {
      console.log('当前不在编辑模式，无法添加座位');
      return;
    }
    console.log('添加座位:', x, y, type);
    const snappedX = snapToGrid(x);
    const snappedY = snapToGrid(y);
    
    // 计算块的尺寸
    const width = type === 'slot' ? gridSize.value * 5 : gridSize.value * 3;
    const height = type === 'slot' ? gridSize.value * 5 : gridSize.value * 3;
    
    // 计算左上角坐标，使点击位置成为中心点
    const left = snappedX - width / 2;
    const top = snappedY - height / 2;
    
    const newSeat: Seat = {
      id: Date.now().toString(),
      x: left,
      y: top,
      width,
      height,
      label: type === 'slot' ? `座位 ${seats.value.length + 1}` : `员工 ${seats.value.filter(s => s.type === 'employee').length + 1}`,
      type
    };

    // 只检查同类型元素之间的重叠
    const isOverlapping = seats.value
      .filter(seat => seat.type === type) // 只检查同类型的座位
      .some(existingSeat => {
        // 计算两个矩形的边界
        const newLeft = newSeat.x;
        const newRight = newSeat.x + newSeat.width;
        const newTop = newSeat.y;
        const newBottom = newSeat.y + newSeat.height;

        const existingLeft = existingSeat.x;
        const existingRight = existingSeat.x + existingSeat.width;
        const existingTop = existingSeat.y;
        const existingBottom = existingSeat.y + existingSeat.height;

        // 检查是否重叠
        return !(
          newRight <= existingLeft ||
          newLeft >= existingRight ||
          newBottom <= existingTop ||
          newTop >= existingBottom
        );
      });

    if (isOverlapping) {
      console.log('座位重叠，无法添加');
      return;
    }
    
    seats.value.push(newSeat);
    console.log('当前座位列表:', seats.value);
  };

  const addEmployee = (x: number, y: number) => {
    // 获取所有座位
    const slots = seats.value.filter(seat => seat.type === 'slot');
    // 获取所有员工
    const employees = seats.value.filter(seat => seat.type === 'employee');
    
    // 检查是否有空余座位
    if (employees.length >= slots.length) {
      console.log('没有空余的座位');
      return;
    }
    
    // 查找最近的座位中心点
    const nearestSlot = slots
      .filter(slot => !employees.some(emp => {
        const slotCenterX = slot.x + slot.width / 2;
        const slotCenterY = slot.y + slot.height / 2;
        const empCenterX = emp.x + emp.width / 2;
        const empCenterY = emp.y + emp.height / 2;
        return slotCenterX === empCenterX && slotCenterY === empCenterY;
      }))
      .reduce((nearest, current) => {
        const currentCenterX = current.x + current.width / 2;
        const currentCenterY = current.y + current.height / 2;
        const currentDistance = Math.sqrt(
          Math.pow(x - currentCenterX, 2) + Math.pow(y - currentCenterY, 2)
        );
        
        if (!nearest || currentDistance < nearest.distance) {
          return {
            seat: current,
            distance: currentDistance
          };
        }
        return nearest;
      }, null as { seat: Seat; distance: number } | null);
    
    if (nearestSlot) {
      // 计算员工应该放置的位置（座位中心）
      const centerX = nearestSlot.seat.x + nearestSlot.seat.width / 2;
      const centerY = nearestSlot.seat.y + nearestSlot.seat.height / 2;
      addSeat(centerX, centerY, 'employee');
    } else {
      console.log('没有找到合适的空余座位');
    }
  };

  const deleteSeat = (id: string) => {
    if (!isEditMode.value) {
      console.log('当前不在编辑模式，无法删除座位');
      return;
    }
    console.log('删除座位:', id);
    console.log('删除前的座位列表:', seats.value);
    console.log('当前选中的座位:', selectedSeat.value);
    
    const seatToDelete = seats.value.find(seat => seat.id === id);
    if (!seatToDelete) {
      console.log('未找到要删除的座位');
      return;
    }
    
    seats.value = seats.value.filter(seat => seat.id !== id);
    console.log('删除后的座位列表:', seats.value);
    
    if (selectedSeat.value?.id === id) {
      selectedSeat.value = null;
      console.log('清除选中的座位');
    }
  };

  const setSelectedSeat = (seat: Seat | null) => {
    if (!isEditMode.value) {
      console.log('当前不在编辑模式，无法选择座位');
      return;
    }
    console.log('设置选中座位:', seat);
    selectedSeat.value = seat;
    console.log('当前选中的座位:', selectedSeat.value);
  };

  const updateSeatPosition = (id: string, x: number, y: number) => {
    if (!isEditMode.value) {
      console.log('当前不在编辑模式，无法更新座位位置');
      return;
    }
    // 吸附到网格
    const snapX = snapToGrid(x);
    const snapY = snapToGrid(y);
    
    console.log('更新座位位置:', id, x, y, '吸附到:', snapX, snapY);
    const seat = seats.value.find(s => s.id === id);
    if (seat) {
      seat.x = snapX;
      seat.y = snapY;
      console.log('座位位置已更新:', seat);
    }
  };

  const updateSeatLabel = (id: string, label: string) => {
    const seat = seats.value.find(s => s.id === id);
    if (seat) {
      seat.label = label;
    }
  };

  const saveLayout = async () => {
    try {
      console.log('保存布局:', seats.value);
      await saveRoom(seats.value);
      console.log('布局保存成功');
    } catch (error) {
      console.error('保存布局失败:', error);
      throw error;
    }
  };

  const loadLayout = async () => {
    try {
      const layout = await getRoom();
      seats.value = layout;
      console.log('布局加载完成:', seats.value);
      isEditMode.value = false;
      console.log('重置为非编辑模式');
    } catch (error) {
      console.error('加载布局失败:', error);
      seats.value = [];
    }
  };

  return {
    seats,
    isEditMode,
    selectedSeat,
    isAddingSeat,
    isAddingEmployee,
    gridSize,
    stageConfig,
    snapToGrid,
    toggleEditMode,
    setAddingSeat,
    setAddingEmployee,
    addSeat,
    addEmployee,
    deleteSeat,
    setSelectedSeat,
    updateSeatPosition,
    updateSeatLabel,
    saveLayout,
    loadLayout
  };
}); 