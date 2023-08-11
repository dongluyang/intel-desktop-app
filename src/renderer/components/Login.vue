<template>
  <a-form :model="form" :style="{width:'600px'}">
    <a-form-item field="userName" label="用户名" validate-trigger="input" required>
      <a-input v-model="form.userName" placeholder="请输入用户名" />
    </a-form-item>
    <a-form-item field="password" label="密码" validate-trigger="input" required>
      <a-input-password v-model="form.password" placeholder="请输入密码" />
    </a-form-item>
  </a-form>
<!--  {{ form }}-->
</template>

<script>
import { reactive } from 'vue';

export default {
  setup() {
    const form = reactive({
      userName: '',
      password: '',
    })

    return {
      form,
    }
  },
}
</script>

