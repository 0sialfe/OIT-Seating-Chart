<template>
  <div class="toolbar">
    <el-button-group>
      <el-button
        :type="isEditing ? 'primary' : 'default'"
        @click="$emit('toggle-edit')"
      >
        {{ isEditing ? '完成编辑' : '编辑模式' }}
      </el-button>
      
      <el-button
        v-if="isEditing"
        @click="handleAddSeat"
      >
        添加座位
      </el-button>
      
      <el-button
        v-if="isEditing"
        type="danger"
        @click="$emit('delete-seat')"
      >
        删除选中
      </el-button>
    </el-button-group>

    <el-button-group>
      <el-button
        type="primary"
        :loading="isSaving"
        @click="handleSave"
      >
        保存布局
      </el-button>
    </el-button-group>

    <el-alert
      v-if="error"
      :title="error"
      type="error"
      show-icon
      closable
    />
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElButtonGroup, ElAlert } from 'element-plus';
import { useSeatingStore } from '@/stores/seating';
import { storeToRefs } from 'pinia';

const store = useSeatingStore();
const { isSaving, error } = storeToRefs(store);

defineProps<{
  isEditing: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle-edit'): void;
  (e: 'add-seat'): void;
  (e: 'delete-seat'): void;
}>();

const handleAddSeat = () => {
  emit('add-seat', {
    x: 100,
    y: 100
  });
};

const handleSave = async () => {
  try {
    await store.saveCurrentRoom();
    ElMessage.success('保存成功');
  } catch (error) {
    ElMessage.error('保存失败');
  }
};
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 16px;
  padding: 8px;
  border-bottom: 1px solid #eee;
}
</style> 