<template>
  <div class="room-editor">
    <div class="controls">
      <button @click="toggleEditMode" :class="{ active: store.isEditMode }">
        {{ store.isEditMode ? '退出编辑' : '编辑模式' }}
      </button>
      <button v-if="store.isEditMode" @click="toggleAddingSeat" :class="{ active: isAddingSeat }">
        添加座位
      </button>
      <button v-if="store.isEditMode" @click="toggleAddingEmployee" :class="{ active: isAddingEmployee }">
        添加员工
      </button>
      <button v-if="store.isEditMode" @click="saveLayout">保存布局</button>
    </div>
    
    <div v-if="store.isEditMode && isAddingEmployee && noAvailableSlots" class="message">
      没有空余的座位
    </div>
    
    <div v-if="store.isEditMode && isAddingSeat && lastAddFailed" class="message">
      座位重叠，无法添加
    </div>
    
    <div 
      class="canvas-container" 
      :class="{ 'adding-seat': isAddingSeat, 'adding-employee': isAddingEmployee }"
      @click="handleCanvasClick"
    >
      <div class="grid-background" :style="gridStyle"></div>
      <div class="seats-layer">
        <div
          v-for="seat in slotSeats"
          :key="seat.id"
          class="seat"
          :class="{ 'is-slot': seat.type === 'slot' }"
          :style="{
            left: `${seat.x}px`,
            top: `${seat.y}px`,
            width: `${seat.width}px`,
            height: `${seat.height}px`
          }"
          @click.stop="selectSeat(seat)"
        >
          <div class="seat-label">{{ seat.label }}</div>
          <button 
            v-if="store.isEditMode" 
            class="delete-btn" 
            @click.stop="deleteSeat(seat.id)"
          >×</button>
        </div>
      </div>
      <div class="employees-layer">
        <div
          v-for="seat in employeeSeats"
          :key="seat.id"
          class="seat"
          :class="{ 'is-employee': seat.type === 'employee' }"
          :style="{
            left: `${seat.x}px`,
            top: `${seat.y}px`,
            width: `${seat.width}px`,
            height: `${seat.height}px`
          }"
          @click.stop="selectSeat(seat)"
        >
          <div class="seat-label">{{ seat.label }}</div>
          <button 
            v-if="store.isEditMode" 
            class="delete-btn" 
            @click.stop="deleteSeat(seat.id)"
          >×</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSeatingStore } from '@/stores/seating'
import type { Seat } from '@/stores/seating'

const store = useSeatingStore()
const isAddingSeat = ref(false)
const isAddingEmployee = ref(false)
const lastAddFailed = ref(false)

const gridSize = computed(() => store.gridSize)

const gridStyle = computed(() => {
  const size = gridSize.value
  return {
    backgroundSize: `${size}px ${size}px`,
    backgroundImage: `linear-gradient(to right, #eee 1px, transparent 1px),
                      linear-gradient(to bottom, #eee 1px, transparent 1px)`
  }
})

const slotSeats = computed(() => store.seats.filter(seat => seat.type === 'slot'))
const employeeSeats = computed(() => store.seats.filter(seat => seat.type === 'employee'))

const noAvailableSlots = computed(() => {
  const slots = store.seats.filter(seat => seat.type === 'slot');
  const employees = store.seats.filter(seat => seat.type === 'employee');
  return employees.length >= slots.length;
});

const handleCanvasClick = (event: MouseEvent) => {
  if (!store.isEditMode) return
  
  const canvas = event.currentTarget as HTMLElement
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  if (isAddingSeat.value) {
    const oldLength = store.seats.length
    store.addSeat(x, y, 'slot')
    lastAddFailed.value = store.seats.length === oldLength
  } else if (isAddingEmployee.value) {
    store.addEmployee(x, y)
  }
}

const toggleAddingSeat = () => {
  isAddingSeat.value = !isAddingSeat.value
  if (isAddingSeat.value) {
    isAddingEmployee.value = false
  }
}

const toggleAddingEmployee = () => {
  isAddingEmployee.value = !isAddingEmployee.value
  if (isAddingEmployee.value) {
    isAddingSeat.value = false
  }
}

const toggleEditMode = () => {
  store.toggleEditMode()
  if (!store.isEditMode) {
    isAddingSeat.value = false
    isAddingEmployee.value = false
  }
}

const selectSeat = (seat: Seat) => {
  if (store.isEditMode) {
    store.setSelectedSeat(seat)
  }
}

const deleteSeat = (id: string) => {
  store.deleteSeat(id)
}

const saveLayout = async () => {
  try {
    await store.saveLayout()
  } catch (error) {
    console.error('保存布局失败:', error)
  }
}

// 组件挂载时加载布局
onMounted(async () => {
  try {
    await store.loadLayout();
  } catch (error) {
    console.error('加载布局失败:', error);
  }
});
</script>

<style scoped>
.room-editor {
  padding: 20px;
}

.controls {
  margin-bottom: 20px;
}

.controls button {
  margin-right: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
}

.controls button.active {
  background-color: #4CAF50;
  color: white;
}

.canvas-container {
  position: relative;
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
  background-color: white;
}

.canvas-container.adding-seat {
  background-color: rgba(76, 175, 80, 0.1);
  cursor: crosshair;
}

.canvas-container.adding-employee {
  background-color: rgba(33, 150, 243, 0.1);
  cursor: crosshair;
}

.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.seats-layer,
.employees-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.seat {
  position: absolute;
  border: 2px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: move;
}

.seat.is-slot {
  background-color: rgba(76, 175, 80, 0.2);
  border-color: #4CAF50;
}

.seat.is-employee {
  background-color: rgba(33, 150, 243, 0.2);
  border-color: #2196F3;
}

.seat-label {
  font-size: 14px;
  text-align: center;
  padding: 4px;
}

.seat-controls {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  padding: 4px;
}

.delete-btn {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: #ff4444;
  color: white;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  z-index: 10;
}

.delete-btn:hover {
  background-color: #cc0000;
}

.message {
  margin: 10px 0;
  padding: 10px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  text-align: center;
}
</style> 