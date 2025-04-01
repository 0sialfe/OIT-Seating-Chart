<template>
  <div class="room-editor">
    <el-container>
      <el-header>
        <h1>座位表编辑器</h1>
        <div class="toolbar">
          <el-button-group>
            <el-button type="primary" @click="toggleEditMode">
              {{ store.isEditMode ? '退出编辑' : '编辑模式' }}
            </el-button>
            <el-button type="success" @click="addSeat" :disabled="!store.isEditMode">
              添加座位
            </el-button>
            <el-button 
              type="danger" 
              @click="deleteSelectedSeat" 
              :disabled="!store.isEditMode || !store.selectedSeat?.id"
            >
              删除座位
            </el-button>
          </el-button-group>
          <el-button type="primary" @click="saveLayout" class="save-button">
            保存布局
          </el-button>
        </div>
      </el-header>
      <el-main>
        <v-stage 
          ref="stageRef" 
          :config="store.stageConfig" 
          @click="handleStageClick"
          @mousemove="handleMouseMove"
          @touchstart="handleStageClick"
        >
          <v-layer>
            <v-rect
              v-for="seat in store.seats"
              :key="seat.id"
              :config="seat"
              @click="handleSeatClick"
              @touchstart="handleSeatClick"
              @dragend="handleSeatDragEnd"
              :draggable="store.isEditMode"
            />
          </v-layer>
        </v-stage>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useSeatingStore } from '../stores/seating';

const store = useSeatingStore();
const stageRef = ref(null);

const toggleEditMode = () => {
  store.toggleEditMode();
  console.log('编辑模式:', store.isEditMode);
};

const addSeat = () => {
  if (!store.isEditMode) {
    ElMessage.warning('请先进入编辑模式');
    return;
  }
  console.log('添加座位');
  store.addSeat({
    x: 100,
    y: 100,
    width: 60,
    height: 60,
    fill: '#4CAF50',
    stroke: '#2E7D32',
    strokeWidth: 2,
    draggable: true
  });
};

const deleteSelectedSeat = () => {
  if (!store.isEditMode) {
    ElMessage.warning('请先进入编辑模式');
    return;
  }
  if (store.selectedSeat?.id) {
    const seatId = store.selectedSeat.id;
    console.log('删除座位:', seatId);
    console.log('当前选中的座位:', store.selectedSeat);
    store.deleteSeat(seatId);
    ElMessage.success('座位已删除');
  } else {
    ElMessage.warning('请先选择一个座位');
  }
};

const handleStageClick = (e: any) => {
  if (e.target !== e.currentTarget) {
    return;
  }
  console.log('点击画布');
  if (store.isEditMode) {
    store.setSelectedSeat(null);
  }
};

const handleSeatClick = (e: any) => {
  e.cancelBubble = true;
  console.log('点击座位');
  if (store.isEditMode) {
    const seat = e.target;
    const seatId = seat.id();
    console.log('选中的座位ID:', seatId);
    console.log('选中的座位属性:', {
      id: seatId,
      x: seat.x(),
      y: seat.y(),
      width: seat.width(),
      height: seat.height(),
      fill: seat.fill(),
      stroke: seat.stroke(),
      strokeWidth: seat.strokeWidth(),
      draggable: seat.draggable()
    });
    store.setSelectedSeat({
      id: seatId,
      x: seat.x(),
      y: seat.y(),
      width: seat.width(),
      height: seat.height(),
      fill: seat.fill(),
      stroke: seat.stroke(),
      strokeWidth: seat.strokeWidth(),
      draggable: seat.draggable()
    });
  }
};

const handleSeatDragEnd = (e: any) => {
  if (!store.isEditMode) return;
  const seat = e.target;
  const newX = seat.x();
  const newY = seat.y();
  console.log('拖动结束:', seat.id(), newX, newY);
  store.updateSeatPosition(seat.id(), newX, newY);
};

const handleMouseMove = (e: any) => {
  // 可以在这里添加鼠标移动时的交互效果
};

const saveLayout = async () => {
  try {
    await store.saveLayout();
    ElMessage.success('布局保存成功');
  } catch (error) {
    ElMessage.error('保存失败：' + error.message);
  }
};

onMounted(async () => {
  try {
    // 加载初始布局
    await store.loadLayout();
    console.log('布局加载完成');
  } catch (error) {
    console.error('初始化失败:', error);
    ElMessage.error('加载布局失败');
  }
});
</script>

<style scoped>
.room-editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar {
  display: flex;
  gap: 10px;
}

.save-button {
  margin-left: 20px;
}

.el-main {
  flex: 1;
  padding: 20px;
  background-color: #f5f7fa;
}

h1 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

/* 添加编辑模式的视觉反馈 */
:deep(.v-stage) {
  cursor: default;
}

:deep(.v-stage.is-edit-mode) {
  cursor: crosshair;
  background-color: #f0f9ff;
}

:deep(.v-rect) {
  cursor: move;
}
</style> 