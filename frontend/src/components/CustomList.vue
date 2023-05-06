<template>
  <v-list v-if="props.modelValue?.length > 0" width="100%" density="compact">
    <v-list-item
      v-for="(value, i) in props.modelValue"
      :key="value"
      class="pa-0"
      :prepend-icon="props.displayBullet ? 'mdi-circle-small' : null"
    >
      <slot name="item" :value="value"> </slot>
      <template v-slot:append>
        <v-container class="pa-0">
          <v-btn
            v-show="orderable"
            variant="plain"
            :ripple="false"
            icon="mdi-chevron-up"
            rounded="lg"
            elevation="0"
            size="small"
            @click.stop="reorderItem(i, -1)"
          >
          </v-btn>
          <v-btn
            v-show="props.removable"
            variant="plain"
            :ripple="false"
            icon="mdi-minus"
            rounded="lg"
            elevation="0"
            size="small"
            @click.stop="deleteItem(i)"
          >
          </v-btn>
          <v-btn
            v-show="orderable"
            variant="plain"
            :ripple="false"
            icon="mdi-chevron-down"
            rounded="lg"
            elevation="0"
            size="small"
            @click.stop="reorderItem(i, +1)"
          >
          </v-btn>
        </v-container>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

// Props & Emits
const props = defineProps({
  modelValue: Array,
  displayBullet: { Type: Boolean, default: true },
  orderable: { Type: Boolean, default: true },
  removable: { Type: Boolean, default: true },
});
const emits = defineEmits(["update:modelValue", "itemDeleted"]);

// Methods
const deleteItem = (at) => {
  let temp = props.modelValue.slice();
  const deleted = temp.splice(at, 1)[0];

  emits("update:modelValue", temp);
  emits("itemDeleted", deleted);
};

const reorderItem = (from, direction) => {
  if (props.modelValue.length == 0) return;

  if (
    from == -1 ||
    from + direction < 0 ||
    from + direction >= props.modelValue.length
  )
    return;

  let temp = props.modelValue.slice();
  const target = temp.splice(from, 1)[0];
  temp.splice(from + direction, 0, target);
  emits("update:modelValue", temp);
};
</script>
