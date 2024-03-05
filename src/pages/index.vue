<template>
  <div class="t-h-full d-flex flex-column align-center">
    <v-form ref="login-form" lazy-validation @submit.prevent="handleLogin">
      <v-row justify="center">
        <v-col cols="12">
          <div class="d-flex flex-column align-center">
            <v-img
              src="/logo/logo.png"
              height="120"
              width="120"
              cover
              alt=""
              class="rounded-circle"
            ></v-img>
            <div
              class="d-flex flex-row justify-space-between pt-4 align-center t-w-full"
            >
              <v-img src="/logo/CPF.jpg" height="80" width="80" alt=""></v-img>
              <v-img src="/logo/CPF2.png" height="80" width="80" alt=""></v-img>
              <v-img
                src="/logo/cp_100.png"
                height="80"
                width="80"
                alt=""
              ></v-img>
            </div>
          </div>
        </v-col>
        <v-col cols="12">
          <div class="d-flex flex-column t-gap-3 t-text-center">
            <span class="text-success t-text-sm">
              โปรแกรมบริหารจัดการฟาร์มไก่ไข่คีรี
            </span>
            <span class="text-success t-text-sm">
              โครงการเลี้ยงไข่ไก่เพื่ออาหารกลางวันนักเรียน
            </span>
            <span class="text-primary t-font-bold">
              โรงเรียนคีรีศรีสาครวิทยา
            </span>
            <span class="t-text-sm">
              สำนักงานเขตพื้นที่การศึกษาประถมศึกษาตราด
            </span>
          </div>
        </v-col>
        <v-col cols="12">
          <v-label class="py-6 d-flex justify-center">
            เข้าสู่ระบบด้วยเบอร์โทร
          </v-label>
          <v-text-field
            v-model="telModel"
            placeholder="เบอร์โทรศัพท์"
            :rules="rules.tel"
            :hide-details="false"
            :loading="loading"
            :disabled="loading"
          ></v-text-field>
          <v-btn block type="submit" :loading="loading">เข้าสู่ระบบ</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  setup() {
    definePageMeta({
      middleware: "guest",
    });
    const tel = ref("");
    const loading = ref(false);
    const rules = {
      tel: [(v: string) => !!v || "กรุณากรอก"],
    };
    return {
      tel,
      rules,
      loading,
    };
  },
  computed: {
    telModel: {
      get() {
        return utils.phone(this.tel);
      },
      set(e: string) {
        this.tel = e;
      },
    },
  },
  methods: {
    async handleLogin() {
      this.loading = true;

      const form = this.$refs["login-form"] as any;
      const valid = await form.validate();

      if (valid) {
        const login = await this.$auth.login(this.tel);
        if (login) {
          this.$router.push("/home");
        } else {
          this.$dialog.error.open({
            title: "เกิดข้อผิดพลาด",
            details: "เบอร์โทรไม่ถูกต้อง",
          });
          this.tel = "";
        }
        this.loading = false;
      }
    },
  },
});
</script>
