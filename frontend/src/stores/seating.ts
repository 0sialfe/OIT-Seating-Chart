import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Seat } from '../types';
import { roomApi } from '../services/api';

export const useSeatingStore = defineStore('seating', () => {
  const seats = ref<Seat[]>([]);
  const isEditMode = ref(false);
  const selectedSeat = ref<Seat | null>(null);
  const isAddingSeat = ref(false);
  const stageConfig = ref({
    width: window.innerWidth - 40,
    height: window.innerHeight - 120
  });

  const toggleEditMode = () => {
    isEditMode.value = !isEditMode.value;
    console.log('切换编辑模式:', isEditMode.value);
    if (!isEditMode.value) {
      selectedSeat.value = null;
      isAddingSeat.value = false;
      console.log('清除选中的座位和添加状态');
    }
  };

  const setAddingSeat = (value: boolean) => {
    isAddingSeat.value = value;
    console.log('设置添加座位状态:', value);
  };

  const addSeat = (seat: Omit<Seat, 'id'>) => {
    if (!isEditMode.value) {
      console.log('当前不在编辑模式，无法添加座位');
      return;
    }
    console.log('添加座位:', seat);
    const newSeat = {
      ...seat,
      id: Date.now().toString()
    };
    seats.value.push(newSeat);
    console.log('当前座位列表:', seats.value);
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
    console.log('更新座位位置:', id, x, y);
    const seat = seats.value.find(s => s.id === id);
    if (seat) {
      seat.x = x;
      seat.y = y;
      console.log('座位位置已更新:', seat);
    }
  };

  const saveLayout = async () => {
    try {
      console.log('保存布局:', seats.value);
      await roomApi.saveRoom({
        id: 'layout',
        name: '默认布局',
        seats: seats.value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('保存布局失败:', error);
      throw new Error('保存布局失败');
    }
  };

  const loadLayout = async () => {
    try {
      console.log('加载布局');
      const layout = await roomApi.getRoom('layout');
      seats.value = layout.seats;
      console.log('布局加载完成:', seats.value);
      isEditMode.value = false;
      console.log('重置为非编辑模式');
    } catch (error) {
      console.error('加载布局失败:', error);
      throw new Error('加载布局失败');
    }
  };

  return {
    seats,
    isEditMode,
    selectedSeat,
    isAddingSeat,
    stageConfig,
    toggleEditMode,
    setAddingSeat,
    addSeat,
    deleteSeat,
    setSelectedSeat,
    updateSeatPosition,
    saveLayout,
    loadLayout
  };
}); 