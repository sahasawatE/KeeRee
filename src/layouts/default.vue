<template>
  <v-app>
    <v-layout class="bg-white">
      <v-main class="my-auto">
        <v-container fluid>
          <v-row justify="center">
            <v-col cols="12" md="8">
              <slot />
            </v-col>
          </v-row>
          <widget-container-modal />
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
import { container } from "jenesius-vue-modal";

export default {
  name: "DefaultLayout",
  components: {
    WidgetContainerModal: container,
  },
};
</script>
