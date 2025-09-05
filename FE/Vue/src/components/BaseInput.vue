<template>
  <div class="form-group">
    <label :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      @input="updateValue"
      :class="{ 'input-error': error }"
    />
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  error?: string;
  label: string;
  type: string;
  modelValue?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
  error: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const inputId = computed(() => {
  return props.id || props.label.toLowerCase().replace(/\s+/g, '-');
});

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<style lang="scss" scoped>
.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  input[type='text'],
  input[type='password'] {
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  .input-error {
    border-color: #dc3545;

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  }
}
</style>
