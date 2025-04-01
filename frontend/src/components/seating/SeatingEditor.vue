<template>
  <div class="seating-editor">
    <tool-bar
      :is-editing="isEditing"
      @toggle-edit="toggleEdit"
      @add-seat="handleAddSeat"
      @delete-seat="handleDeleteSeat"
    />
    <v-stage
      ref="stageRef"
      :config="stageConfig"
      @click="handleStageClick"
      @mousedown="handleMouseDown"
    >
      <v-layer ref="layerRef">
        <!-- 网格背景 -->
        <v-rect
          v-if="isEditing"
          :config="gridConfig"
        />
        
        <!-- 座位 -->
        <seat-component
          v-for="seat in currentRoom?.seats"
          :key="seat.id"
          :seat="seat"
          :is-selected="selectedSeatId === seat.id"
          :is-editing="isEditing"
          @select="handleSeatSelect"
          @update:position="handleSeatMove"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { VStage, VLayer, VRect } from 'vue-konva';
import { useSeatingStore } from '@/stores/seating';
import ToolBar from './ToolBar.vue';
import SeatComponent from './SeatComponent.vue';
import type { Position } from '@/types';

const store = useSeatingStore();
const stageRef = ref(null);
const layerRef = ref(null);

const stageConfig = computed(() => ({
  width: 800,
  height: 600
}));

const gridConfig = computed(() => ({
  width: stageConfig.value.width,
  height: stageConfig.value.height,
  stroke: '#ddd',
  strokeWidth: 1,
  listening: false,
  // 创建网格图案
  fillPatternImage: createGridPattern(store.gridSize)
}));

// 创建网格图案
function createGridPattern(size: number) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(size, size);
    ctx.stroke();
  }
  return canvas;
}

// 事件处理
const handleStageClick = (e: any) => {
  if (!store.isEditing) return;
  
  // 如果点击空白处，取消选择
  if (e.target === e.currentTarget) {
    store.selectSeat(null);
  }
};

const handleMouseDown = (e: any) => {
  // 防止拖动时选中文本
  e.evt.preventDefault();
};

const handleSeatSelect = (seatId: string) => {
  store.selectSeat(seatId);
};

const handleSeatMove = (seatId: string, position: Position) => {
  store.updateSeatPosition(seatId, position);
};

const handleAddSeat = (position: Position) => {
  store.addSeat(position);
};

const handleDeleteSeat = () => {
  if (store.selectedSeatId) {
    store.deleteSeat(store.selectedSeatId);
  }
};

const toggleEdit = () => {
  store.isEditing = !store.isEditing;
};
</script>

<style scoped>
.seating-editor {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style> 