<template>
  <div class="addCommentOut">
    <a-input
      ref="refName"
      v-model:value="textContent"
      type="textarea"
      placeholder="请给予宝贵的意见"
      @change="updateContent"
    />

    <div style="float: left;padding-top: 10px; margin-left: 5px">
      <a-popover
        trigger="click"
        v-model="emojiShow"
      >
       <a-button @click="emojiShow = !emojiShow">😀</a-button>
        <template #content>  
        
        <div class="browBox">
          <ul>
            <li
              v-for="(item, index) in faceList"
              :key="index"
              @click="getBrow(index)"
            >
              {{ item }}
            </li>
          </ul>
        </div>

        </template>

      </a-popover>
    </div>

    <a-upload
      multiple
      directory-dnd
      style="margin-left: 500px"
      :default-upload="false"
      ref="upload"
      @change="handleChange"
      v-model:file-list="fileList"
    >
      <n-upload-dragger>
        <div style="margin-bottom: 12px">
          <n-icon size="48" :depth="3">
            <archive-icon />
          </n-icon>
        </div>
        <n-text style="font-size: 16px">
          点击或者拖动文件到该区域来上传
        </n-text>
      </n-upload-dragger>
    </a-upload>



    <div style="float: right;padding-top: 10px;padding-right: 10px">
      <n-button size="small" round type="info" @click="passTask" :disabled="!disableSendBack">通过</n-button>
    </div>
    <div style="float: right;padding-top: 10px;padding-right: 10px">
      <n-button size="small" round type="primary" @click="sendBack" :disabled="disableSendBack">返修</n-button>
    </div>


  </div>
</template>

<script>
import appData from './emojis.json';
import { defineComponent, ref,watch, reactive, onMounted} from "vue";
import { ArchiveOutline as ArchiveIcon } from "@vicons/ionicons5";

export default defineComponent({
  name: "MyEditor",
  props: ['content','isSendBack'],
  components: {
    ArchiveIcon
  },
  setup (props, ctx) {
    var textContent = ref(props.content)
    const refName = ref()
    let dialogVisible = ref(false)
    //表情框是否展示
    let emojiShow = ref(false)
    //表情列表
    let faceList = ref([])
    //表情文本
    const fileListLengthRef = ref(0)
    const uploadRef = ref(null)
    let marginBottom = ref('60px')
    let fileInfoList = ref([])
    let fileList = ref([])
    var disableSendBack = ref(props.isSendBack)

    const updateContent = ()=>{
       ctx.emit('update:content',refName.value.value) //关键点
    }

    // const submitComment = () => {
    //   ctx.emit(
    //     "add-comment", {
    //     }
    //   )
    // }

    //加载表情，存放到表情列表中
    const loadEmojis = () => {
      for (let i in appData) {
        faceList.value.push(appData[i].char);
      }
    }
    // 获取用户点击之后的标签 ，存放到输入框内
    const getBrow = (index) => {
      textContent.value += faceList.value[index]
      emojiShow.value = false
      ctx.emit('update:content',textContent.value)
    }
    const uploadClick = () => {
      console.log(fileListLengthRef.value)
      console.log(fileList.value)
      // if (fileListLengthRef.value === 0) {
      //   ctx.emit("uploadFinish", {
      //     "fileInfoList": fileInfoList.value,
      //   })
      // }
    }

    const handleChange = (options) => {
      fileListLengthRef.value = options.fileList.length;
      if (fileListLengthRef.value > 0)
          ctx.emit("enable-send-back", {})
    }

    const passTask = () => {
      ctx.emit(
        "pass-task", {
        }
      )
    }

    const sendBack = () => {
      ctx.emit(
        "send-back", fileListLengthRef.value > 0 ? fileList.value : null
      )
    }

    onMounted(() => {
      loadEmojis()
    })

    // watch
    watch(
      () => [props.isSendBack, props.content],
      ([newIsSendBack, newContent], [oldIsSendBack, oldContent]) => {
        disableSendBack.value = newIsSendBack
        textContent.value = newContent
      },
    )
    return reactive({
      refName,
      textContent,
      updateContent,
      dialogVisible,
      emojiShow,
      faceList,
      marginBottom,
      fileInfoList,
      disableSendBack,
      fileListLengthRef,
      uploadRef,
      upload: uploadRef,
      fileListLength: fileListLengthRef,
      fileList,
      loadEmojis,
      handleChange,
      getBrow,
      uploadClick,
      passTask,
      sendBack
    })
  }
})


</script>

<!--<style src="@wangeditor/editor/dist/css/style.css"></style>-->
<style scoped>
/deep/ .n-upload.n-upload--dragger-inside .n-upload-trigger{
	display: inline-block;
}
.addCommentOut {
  width: 100%;
  margin-bottom: v-bind(marginBottom);
  border: 1px solid #ccc;
  margin-top: 10px;
}

.browBox {
  width: 300px;
  height: 200px;
  background: #e6e6e6;
  position: absolute;
  z-index: 100;
  bottom: 0px;
  overflow: scroll;
}

.browBox ul {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
}

.browBox ul li {
  cursor: pointer;
  width: 10%;
  font-size: 16px;
  list-style: none;
  text-align: center;
}
</style>
