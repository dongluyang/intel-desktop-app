<template>
  <a-form :model="form" :style="{width:'600px'}">
    <a-form-item field="userName" label="用户名" :validate-trigger="['change','input']" :rules="[{required:true,message:'用户名需要'}]">
      <a-input v-model="form.userName" placeholder="请输入用户名" @input="updateUserName" />
    </a-form-item>
    <a-form-item field="password" label="密码" :validate-trigger="['change','input']" :rules="[{required:true,message:'密码需要'}]">
      <a-input-password v-model="form.password" placeholder="请输入密码" @input="updatePassword" />
    </a-form-item>
  </a-form>

</template>

<script>
import { ref,reactive,defineComponent} from 'vue';
export default defineComponent({
  setup(props, { emit }) {

    const form = reactive({
        userName:"",
        password:""
    })

  const updateUserName = () => {
      // 使用 emit 方法触发名为 'userName' 的事件
      emit('updateUserName', form.userName);
  };

    const updatePassword = () => {
      // 使用 emit 方法触发名为 'password' 的事件
      emit('updatePassword', form.password);
  };

    return {
      form,
      updateUserName,
      updatePassword
    }
  },
});
</script>

