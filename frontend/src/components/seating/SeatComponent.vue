<template>
  <v-group
    :config="groupConfig"
    @mousedown="handleMouseDown"
    @dragmove="handleDragMove"
    @dragend="handleDragEnd"
  >
    <!-- 座位背景 -->
    <v-rect
      :config="seatConfig"
    />
    <!-- 座位标签 -->
    <v-text
      :config="labelConfig"
    />
  </v-group>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Seat } from '@/types';

const props = defineProps<{
  seat: Seat;
  isSelected: boolean;
  isEditing: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
  (e: 'update:position', id: string, position: { x: number; y: number }): void;
}>();

const groupConfig = computed(() => ({
  x: props.seat.position.x,
  y: props.seat.position.y,
  draggable: props.isEditing,
}));

const seatConfig = computed(() => ({
  width: props.seat.size.width,
  height: props.seat.size.height,
  fill: getSeatColor(props.seat.status),
  stroke: props.isSelected ? '#1890ff' : '#999',
  strokeWidth: props.isSelected ? 2 : 1,
  cornerRadius: 4,
}));

const labelConfig = computed(() => ({
  text: props.seat.label || '',
  fontSize: 12,
  fill: '#666',
  width: props.seat.size.width,
  align: 'center',
  verticalAlign: 'middle',
}));

function getSeatColor(status: string): string {
  switch (status) {
    case 'occupied':
      return '#f5222d20';
    case 'disabled':
      return '#00000010';
    default:
      return '#ffffff';
  }
}

const handleMouseDown = () => {
  emit('select', props.seat.id);
};

const handleDragMove = (e: any) => {
  emit('update:position', props.seat.id, {
    x: e.target.x(),
    y: e.target.y(),
  });
};

const handleDragEnd = (e: any) => {
  emit('update:position', props.seat.id, {
    x: e.target.x(),
    y: e.target.y(),
  });
};
</script> 