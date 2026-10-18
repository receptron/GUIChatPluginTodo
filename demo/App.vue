<template>
  <div class="max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-800 mb-8">{{ pluginName }} Demo</h1>

    <div class="bg-white rounded-lg p-5 mb-5 shadow-md">
      <h2 class="text-gray-600 text-xl mb-4">Actions</h2>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(sample, index) in samplesList"
          :key="index"
          @click="executeSample(sample)"
          class="py-2 px-4 bg-indigo-100 border border-indigo-200 rounded-md cursor-pointer text-sm text-indigo-700 hover:bg-indigo-200"
        >
          {{ sample.name }}
        </button>
      </div>
    </div>

    <div v-if="ViewComponent" class="bg-white rounded-lg p-5 mb-5 shadow-md">
      <h2 class="text-gray-600 text-xl mb-4">View Component</h2>
      <div class="border border-gray-200 rounded h-96">
        <component :is="ViewComponent" :selectedResult="result" @updateResult="handleUpdate" />
      </div>
    </div>

    <div v-if="PreviewComponent" class="bg-white rounded-lg p-5 mb-5 shadow-md">
      <h2 class="text-gray-600 text-xl mb-4">Preview Component</h2>
      <div class="max-w-[200px]">
        <component :is="PreviewComponent" :result="result" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { plugin, executeTodo } from "../src/vue";
import type { ToolResult, ToolSample } from "gui-chat-protocol/vue";
import type { TodoToolData } from "../src/core/types";
import { isTodoArgs } from "./isTodoArgs";

const pluginName = computed(() => plugin.toolDefinition.name);
const samplesList = computed(() => plugin.samples || []);
const ViewComponent = computed(() => plugin.viewComponent);
const PreviewComponent = computed(() => plugin.previewComponent);

const result = ref<ToolResult<TodoToolData>>({
  toolName: pluginName.value,
  uuid: "demo-uuid",
  message: "Ready",
  title: "Todo List",
  data: { items: [] },
});

const executeSample = async (sample: ToolSample) => {
  const { args } = sample;
  if (!isTodoArgs(args)) {
    console.error("Sample args are not TodoArgs:", sample.name, args);
    return;
  }
  const execResult = await executeTodo({}, args);
  result.value = {
    ...result.value,
    ...execResult,
    uuid: `demo-${Date.now()}`,
  };
};

const handleUpdate = (updated: ToolResult<TodoToolData>) => {
  result.value = updated;
};
</script>
