<template>

  <div>

    <div class="page-header">
      <div
        class="flexrow task-information"
      >

        <div class="filler"></div>
        <div class="preview-list flexrow" v-if="isPreview">
          <span
            :class="{
              'flexrow-item': true,
              selected: currentVersionIndex === index
            }"
            :key="'preview-' + index"
            @click="onVersionChanged(index)"
            v-for="(version, index) in lastFiveVersions"
          >
            {{ version }}
          </span>
        </div>
      </div>
    </div>


    <preview-player
      :entity-preview-files="taskEntityPreviews"
      :last-preview-files="[]"
      :previews="taskPreviews"
      :light="!isWide"
      :read-only="false"
      :is-assigned="false"
      :extra-wide="isExtraWide"
      :force-refresh="forceRefresh"
      @annotation-changed="onAnnotationChanged"
      @change-current-preview="changeCurrentPreview"
      @add-extra-preview="onAddExtraPreview"
      @remove-extra-preview="onRemoveExtraPreview"
      @comment-added="onCommentAdded"
      @time-updated="onTimeUpdated"
      @saveReturnFile="saveReturnFile"
      @change-content="changeContent"
      @play-video=""
      ref="preview-player"
    />


    <div class="task-column comments-column">
      <div>
        <div>
          <add-comment
            v-model:content="content"
            v-model:isSendBack="isSendBack"
            @pass-task="showApproveDialog"
            @send-back="showRollbackDialog"
            @enable-send-back="enableSendBackButton"
          />

          <div
            class="comments"
            v-if="taskComments && taskComments.length > 0 && !loading.task"

          >

            <comment
              :key="'comment' + comment.id"
              :comment="comment"
              :light="true"
              v-for="(comment, index) in taskComments"
              @delete-comment="deleteMyComment"
              @update-comment="updateMyComment"
              @download="downloadLink"
            />

          </div>


          <div class="no-comment" v-else-if="!loading.task">
            <em>
              无评论
            </em>
          </div>

        </div>
      </div>

    </div>


    <a-modal v-model:visible="showApprove" hideCancel="true" @ok="onSubmitTask">
      <template #title>
        <div>提示</div>
      </template>
      <div>审核通过！</div>
    </a-modal>

      <a-modal v-model:visible="showRollback"  hideCancel="true" @ok="onReturnTask">
        <template #title>
          <div>提示</div>
        </template>
        <div>退回修改?</div>
      </a-modal>


  </div>


</template>

<script>

import PreviewPlayer from '../previewer/previews/PreviewPlayer.vue'
import {addPreview, listPreview, listVersion, updatePreviewAnnotation} from './preview'
import AddComment from '../previewer/widgets/AddComment.vue'
import Comment from '../previewer/widgets/Comment.vue'
import {addComment, postReview, listComment, deleteComment, updateComment, download} from './review'
import {getUserInfo} from '../../utils/global';
import {getTaskVersionList, getTaskPreviewList, getSubmit,submitTask, updateAnnotations} from '../../utils/api';

export default {
  name: 'taskReview',
  components: {
    PreviewPlayer,
    AddComment,
    Comment
  },

  props: {
    taskId: {
      type: String,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: true
    },
    isPreview: {
      type: Boolean,
      default: true
    },
    currentTimeRaw: {
      type: Number,
      default: 0
    },
    currentParentPreview: {
      type: Object,
      default: null
    },
    silent: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      showApprove: false,
      showRollback: false,
      forceRefresh: false,
      isSendBack: true,
      dialogVisible: false,
      attachmentUrl: null,
      taskEntityPreviews: {},
      content: "",
      addExtraPreviewFormData: null,
      attachedFileName: '',
      attachedImage: '',
      currentVersionIndex: 0,
      currentPreviewPath: '',
      currentPreviewDlPath: '',
      currentTime: 0,
      commentToEdit: null,
      isSubscribed: false,
      isWide: true,
      isExtraWide: false,
      otherPreviews: [],
      taskComments: [],
      taskPreviews: [],
      previewVersions: [],
      errors: {
        addComment: false,
        addPreview: false,
        addExtraPreview: false,
        editComment: false,
        deleteComment: false,
        confirmDeleteTaskPreview: false,
        task: false
      },
      loading: {
        addComment: false,
        addPreview: false,
        addExtraPreview: false,
        editComment: false,
        deleteComment: false,
        confirmDeleteTaskPreview: false,
        task: false
      },
      currentPreviewIndex: 0,
      submitId: null,
      returnMap: new Map(),
      fileList: null,
    }
  },

  watch: {
    // async uploadFinishNum(){
    //   if (this.taskPreviews.length>0) {
    //     console.log("change")
    //     let taskId = this.taskPreviews[0]._id
    //     await this.getTaskComments(taskId);
    //   }
    // }
    content: function (newValue, oldValue) {
      let fps = this.$refs["preview-player"].currentFrame
      if (this.returnMap.has(fps)) {
        let list = this.returnMap.get(fps)
        if (newValue !== list.notes && newValue !== '') {
          list.notes = newValue
          this.returnMap.set(fps, list)
        }
      }
    },
  },

  computed: {
    lastFiveVersions() {
      if (this.previewVersions) {
        return this.previewVersions.slice(0, 5)
      } else {
        return []
      }
    },
  },
  mounted() {
    if (this.$refs['add-comment']) {
      this.$refs['add-comment'].text = this.lastCommentDraft
    }
    console.log(this.taskId)
    this.getTaskVersions().then(() => {
      if (this.previewVersions.length > 0) {
        this.getTaskPreviewsByVersion(this.previewVersions[0]);
      }
    });
  },

  beforeUnmount() {
    // if (this.$refs['add-comment']) {
    //   const lastComment = `${this.$refs['add-comment'].text}`
    //   this.$store.commit('SET_LAST_COMMENT_DRAFT', lastComment)
    // }
  },

  methods: {

    async getTaskVersions() {
      this.previewVersions = await getTaskVersionList(this.taskId)
    },

    async getTaskComments(submitId) {
      this.taskComments = await listComment(submitId)
    },

    async getTaskPreviewsByVersion(v) {
      var submits = await getTaskPreviewList(this.taskId, v);
      if (submits.length > 0) {
        this.submitId = submits[0]._id
        const submitFileIDList = submits[0].submitFileIDList
				submitFileIDList.forEach((element, index) => {
					element.projectName = submits[0].projectName
					element.taskName = submits[0].taskName
					element.storage = submits[0].storage
				})
        this.taskPreviews = submitFileIDList
        this.taskComments = submits[0].returnFileIDList
      }
    },

    onVersionChanged(index) {
      this.currentVersionIndex = index
      this.getTaskPreviewsByVersion(this.previewVersions[index])
    },


    getOriginalPath() {
      // const previewId = this.currentPreviewId
      // const extension = this.extension ? this.extension : 'png'
      // return `/api/pictures/originals/preview-files/${previewId}.${extension}`
    },

    getOriginalDlPath() {
      // const previewId = this.currentPreviewId
      // return `/api/pictures/originals/preview-files/${previewId}/download`
    },

    changeCurrentPreview(previewFile) {
      const index = this.taskPreviews.findIndex(p => p.id === previewFile.id)
      if (index || index === 0) {
        this.currentPreviewIndex = index
        this.currentPreviewPath = this.getOriginalPath()
        this.currentPreviewDlPath = this.getOriginalDlPath()
      }
    },


    onAnnotationChanged({preview, additions, deletions, updates}) {
      updateAnnotations({
        taskId: this.taskId,
        submitFileId: preview.id,
        additions,
        deletions,
        updates
      })
      this.isSendBack = false
    },

    onAddExtraPreview() {
      this.dialogVisible = true
    },
    handleClose(done) {
      this.dialogVisible = false;
    },

    onRemoveExtraPreview(preview) {
      this.currentExtraPreviewId = preview.id
    },

    onCommentAdded() {

    },
    async addMyComment() {
      if (this.taskPreviews.length > 0) {
        this.forceRefresh = true
        // console.log(this.content)
        // const file = new File([], "heavyimagefile", {type: 'image/png'});
        //
        // let result = await postReview(storage.get('USERNAME'),this.submitId,{'file':file,'notes':this.content});
        // if (result.status === 0) {
        //   this.message.success(
        //     "评论成功！！！"
        //   )
        // }
        // await this.getTaskComments(this.submitId);
      }
    },
    showApproveDialog() {
      this.showApprove = true
    },
    showRollbackDialog(filelist) {
      if (filelist !== null)
        this.fileList = filelist
      console.log(this.showRollback)  
      this.showRollback = true
    },
    async pass() {
      // if (!this.$refs["preview-player"].isMovie)
      //   this.$refs["preview-player"].captureImage()
      let formdata = new FormData();
      formdata.append("isReturn", false)
      formdata.append("isPass",true)
      formdata.append("taskId",this.taskId)
      formdata.append("submitId", this.submitId)
      formdata.append("user",getUserInfo().userName)

      let result = await postReview(formdata);
      if (result.status === 0) {
        this.returnMap.clear()
        this.$message.success(
          "操作成功！！！"
        )
      } else {
        this.$message.error(
          result.message
        )
      }
    },

    async sendback(flag) {
      let formdata = new FormData();
      if (!this.$refs['preview-player'].isMovie && flag) {  //图片退回
        this.$refs['preview-player'].captureImage(false)
      } else if (this.$refs['preview-player'].isMovie && this.$refs['preview-player'].isReturn && flag) {   //视频最后一帧批注退回
        this.$refs['preview-player'].captureImage(false)
      } else {
        const userInfo = await getUserInfo()

        if (this.fileList !== null) {
          for (let i = 0; i < this.fileList.length; i ++) {
            formdata.append("checkinors", userInfo.userName)
            formdata.append("notes", this.content)
            formdata.append(this.fileList[i].name, this.fileList[i].file)
            formdata.append("filenames", this.fileList[i].name)
            formdata.append("types", "image")
            formdata.append("times", 0)
          }
          this.fileList = null
          this.content = null
        }
        this.returnMap.forEach((value, key, map) => {
          let list = value
          console.log(list)
          formdata.append("checkinors", list.checkinor)
          formdata.append("notes", list.notes)
          formdata.append(list.filename, list.file)
          formdata.append("filenames", list.filename)
          formdata.append("types", "image")
          formdata.append("times", list.time)
        })
        formdata.append("submitId", this.submitId)
        formdata.append("isReturn", true)
        formdata.append("isPass",false)
        formdata.append("taskId",this.taskId)
        formdata.append("user",userInfo.userName)

        let result = await postReview(formdata);
        if (result.status === 0) {
          this.returnMap.clear()
          this.$message.success(
            "评论成功！！！"
          )
        } else {
          this.$message.error(
            result.message
          )
        }
        this.forceRefresh = false;
        await this.getTaskComments(this.submitId);
      }
    },

    async onSubmitTask() {
      this.showApprove = false
      await this.pass()
    },

    async onReturnTask() {
      this.showRollback = false
      await this.sendback(true)
    },

    changeContent(fps) {
      fps += ""
      if (this.returnMap.has(fps))
        this.content = this.returnMap.get(fps).notes
    },

    enableSendBackButton() {
      this.isSendBack = false
    },

    async saveReturnFile(list) {
      let str = this.content
      if (this.taskPreviews.length > 0) {
        const file = new File([list.file], list.filename, {type: 'image/png'});
        const userInfo = await getUserInfo()
        let list2 = {
          "checkinor": userInfo.userName,
          "notes": str,
          "file": file,
          "filename": list.filename,
          "type": "png",
          "time": list.time,
        }
        this.returnMap.set(list.fps, list2)

        this.content = ""
        this.isSendBack = false
        console.log(this.returnMap)
        if (!this.$refs['preview-player'].isMovie) {
          this.sendback(false)
        }
        if (this.$refs['preview-player'].isMovie && this.$refs['preview-player'].isReturn) {
          this.sendback(false)
          this.$refs['preview-player'].isReturn = false
        }
      }
    },

    async uploadFinish(list) {
      if (this.taskPreviews.length > 0) {
        // console.log(list)
        // console.log(storage.get('USERNAME'))
        let result = await addComment(getUserInfo().userName, list["note"], this.submitId, list["fileInfoList"]);
        if (result.status === 0) {
          this.$message.success(
            "评论成功！！！"
          )
        }
        await this.getTaskComments(this.submitId);
      }
    },

    async deleteMyComment(id) {
      if (this.taskPreviews.length > 0) {
        let result = await deleteComment(id, this.submitId);
        if (result.status === 0) {
          this.$message.success(
            "删除成功！！！"
          )
        }
        await this.getTaskComments(this.submitId);
      }
    },

    async updateMyComment(list) {
      if (this.taskPreviews.length > 0) {
        // console.log(list.content, list.id)
        let result = await updateComment(list, this.submitId);
        if (result.status === 0) {
          this.$message.success(
            "修改成功！！！"
          )
        }
        await this.getTaskComments(this.submitId);
      }
    },

    downloadLink(list) {
      download(list)
    },


    onTimeUpdated(time) {
      this.currentTime = time
    }
  }
};
</script>

<style lang="scss" scoped>
.dark {
  .add-comment,
  .comment,
  .preview-column-content,
  .no-comment {
    width: 100%;
    background: #46494F;
    border-color: #25282E;
    box-shadow: 0px 0px 6px #333;
  }

  .no-preview {
    padding: 0.5em;
  }

  .side {
    background: #36393F;
  }

  .task-info {
    color: white;
  }
}

.side {
  background: #F8F8F8;
  min-height: 100%;
}

.add-comment {
  padding: 0.5em;
  margin-bottom: 0.5em;
  box-shadow: 0px 0px 6px #E0E0E0;
}

.page-header {
  padding: 0;
  margin-top: 0;
}

.header-title .flexrow-item {
  margin-bottom: 0.5em;
}

.title {
  margin: 0;
  flex: 1;
  font-size: 1.3em;
  line-height: 1.5em;
}

.title a {
  color: inherit;
}

.history-button {
  flex: 1;
}

.no-comment {
  background: white;
  padding: 1em;
  border-radius: 5px;
  box-shadow: 0px 0px 6px #E0E0E0;
}

.task-columns {
  display: flex;
  flex-direction: column;

}

.task-column {
  margin-top: 1em;
  overflow-y: scroll;
  height: calc(100vh - 400px);
}

.comment {
  border-top: 1px solid #EEE;
  border-bottom: 1px solid #EEE;
  border-right: 1px solid #EEE;
  margin-top: 0.1em;
  box-shadow: 0px 0px 6px #E0E0E0;
}

.add-preview-button {
  margin-top: 0.5em;
  width: 100%;
}

.no-comment {
  background: white;
  box-shadow: 0px 0px 6px #E0E0E0;
}

.comments {
  padding-bottom: 1em;
}

.preview-colum-content {
  box-shadow: 0px 0px 6px #E0E0E0;
}

.preview-standard-file {
  text-align: center;
  padding: 1em;
}

.model-viewer {
  padding: 0.3em;
}

.change-wideness-button,
.set-thumbnail-button {
  margin-right: 0.2em;
}

.preview {
  position: relative;
}

.preview-list {
  span {
    cursor: pointer;
    padding: 0.2em;
    margin: 0.2em;
    text-align: center;
    border-radius: 3px;

    &:hover {
      background: var(--background-selectable);
    }

    &.selected {
      background: var(--background-selected);
    }
  }
}
</style>
