<template>
<div>
    <div class="content-wrapper full">
      <div class="flexrow">

        <div
          class="flexrow-item avatar">
          <img
            :src="comment.avatar"
            v-if="comment.hasAvatar"
          />
          <span
            v-if="!comment.hasAvatar"
          >
          </span>
        </div>

        <strong class="flexrow-item">
            <span class="person-name">
              {{ comment.checkinor }}
            </span>
        </strong>

        <!-- <div class="filler"></div> -->
        <span
          class="flexrow-item date"
          :title="fullDate"
        >
          {{ fullDate }}
        </span>

      </div>

      <div class="flexrow-item comment-content">
        <div class="content">
          <p
            v-html="renderComment(comment.notes)"
            class="comment-text"
            v-if="comment.notes"
            v-show="!isUpd"
          >
          </p>

          <a-button text @click="download" style="margin-right: 10px">
            <template #icon>
              <a-icon>
                <AttachIcon />
              </a-icon>
            </template>
            {{ comment.filename }}
          </a-button>


         <a-textarea 
            ref="refName"
            v-model="newCom"
            placeholder="请给予宝贵的意见"
            v-show="isUpd"
            style="margin-top: 10px; margin-bottom: 5px"
            @change="updateContent"
         />

        </div>
      </div>

      <div class="flexrow-item comment-content" v-if="isShow" style="margin-top: 15px">
        <a-button size="tiny" style="margin-right: 10px" @click="deleteComment" :disabled="isUpd">
          <template #icon>
            <a-icon><TrashIcon /></a-icon>
          </template>
          删除
        </a-button>
        <a-button size="tiny" @click="updateComment">
          <template #icon>
            <a-icon><PencilIcon /></a-icon>
          </template>
          修改
        </a-button>
      </div>

    </div>

</div>
</template>

<script>

import moment from 'moment'
import { renderComment } from '../lib/render'
import { formatDate, parseDate } from '../lib/time'
import { Trash as TrashIcon, Pencil as PencilIcon, Attach as AttachIcon} from "@vicons/ionicons5";
import { defineComponent, ref,watch, reactive, computed,onMounted} from "vue";


export default defineComponent({
  name: "comment",
  props: {
    comment: {
      type: Object,
      default: () => {}
    },
    highlighted: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    },
    light: {
      type: Boolean,
      default: false
    },
    isLast: {
      type: Boolean,
      default: false
    },
    isChange: {
      type: Boolean,
      default: false
    }
  },
  components: {
    TrashIcon, PencilIcon, AttachIcon
  },
  setup (props, ctx) {
    const refName = ref()
    const isShow = ref(false)
    const newCom = ref(props.comment.notes)
    const isUpd = ref(false)
    const commentDate = computed(() => {
      return moment(props.comment.createDate).tz('Asia/Shanghai');
    })

    const fullDate = computed(() => {
      return commentDate.value.format('YYYY-MM-DD HH:mm:ss');
    })

    const shortDate = computed(() => {
      if (moment().diff(commentDate.value, 'days') > 1) {
        return commentDate.value.format('MM/DD');
      } else {
        return commentDate.value.format('HH:mm');
      }
    })




    const formatDate = (date)=> {
      return formatDate(date)
    }

   const deleteComment = ()=> {
      ctx.emit(
        "delete-comment", this.comment.id
      )
    }

  const updateContent = ()=>{
          console.log(refName.value.modelValue)
       ctx.emit('update:content',refName.value.modelValue) //关键点
    }

    const updateComment = ()=> {
      isUpd.value = !isUpd.value
      console.log(props.comment.notes,newCom.value,isUpd.value)
      if (!isUpd.value && props.comment.notes !== newCom.value) {
          console.log("dddddddddd")
          ctx.emit(
             "update-comment", {"content": newCom.value, "id": props.comment.id})
      }
    }

    const download =() => {

      ctx.emit(
        "download",  {
      	id: props.comment.id,
				name: props.comment.filename,
				storage:props.comment.storage}
      )
    }
  

    onMounted(() => {
       window.intel_configs.get("user_info").then(defaultConfig=>{
        if (defaultConfig!=null) {
              const existedUserInfoConfig = JSON.parse(defaultConfig)
              isShow.value = existedUserInfoConfig.userName === props.comment.checkinor
            }
        })
    })


    return reactive({
      refName,
      isShow,
      newCom,
      isUpd,
      commentDate,
      fullDate,
     deleteComment,
     renderComment,
     download,
     updateComment,
     deleteComment,
     formatDate,
     updateContent

    })
  }
})


</script>

<style lang="scss" scoped>
@import '../variables.scss';
.dark {
  .comment-text {
    color: $white-grey;
  }

  .content .client-comment {
    background: #C4677B;
    color: white;
  }

  .add-checklist {
    background: $dark-grey-lighter;
  }

  .comment {
    background: $dark-grey-lightmore;
  }

  .like-button {
    color: white;
  }
}

article.comment {
  background: white;
  border-radius: 5px;
  padding: 0;
  margin: 1em 0;
  word-wrap: anywhere;
  hyphens: auto;
}

.media {
  padding: 0.6em;
}

.comment.highlighted {
  background: #F1EEFF;
}

.content .comment-person {
  min-height: 40px;
  margin-bottom: 0;
}

.comment-date {
  color: $grey;
  margin-left: 0.5em;
  flex: 1;
}

.content {
  .comment-text {
    margin-top: .5rem;
    margin-bottom: 0rem;
    padding: 0.2em 0.1em;
    word-break: break-word;
    hyphens: auto;
    hyphenate-limit-chars: 8 6 2;
  }
}

.checklist {
  margin-top: 0.5em;
}

.menu-icon {
  width: 20px;
  cursor: pointer;
  color: $light-grey;
}

.menu-wrapper {
  position: relative;
}

.pinned {
  transform: scale(1.02)
}

.pinned-text {
  font-size: 0.8em;
  margin: 0;
  text-align: right;
  color: $light-grey;
}

.add-checklist {
  background: $white-grey-light;
  color: $grey;
  text-transform: uppercase;
  cursor: pointer;
  font-size: 0.8em;
  padding: 0.5em;
}

.content .client-comment {
  border-radius: 4px;
  background: lighten($red, 80%);
  color: desaturate(darken($red, 30%), 20%);
  font-size: 0.8em;
  margin-top: 0.4em;
  margin-bottom: 0;
  padding: 0.5em 0.2em;
  text-align: center;
  text-transform: uppercase;
}

.round-name {
  border-radius: 1em;
  font-size: 0.8em;
  margin: 0;
  margin-right: 0.5em;
  min-width: 55px;
  padding: 0.4em;
  text-transform: uppercase;
  text-align: center;

  &.revision {
    width: 100%;
    font-weight: bold;
    border: 1px solid $purple-strong;
    color: $purple-strong;
  }
}

.flexrow {
  display: flex;
  align-items: center;
}

.comment-left {
  display: flex;
  flex-direction: column;
  padding: 0.5em 0 0.5em 0.5em;
}

.like-button {
  align-items: center;
  background-color: transparent;
  border: 0;
  border-radius: .5rem;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  margin: 0;
  padding: .3rem 0;
  width: 100%;

  &:hover,
  &:focus {
    background-color: $dark-grey-lightest;
  }

  &[disabled] {
    pointer-events: none;
  }

  span {
    margin-left: 0.3em;
  }
}

.like-button--empty {
  opacity: .5;

  &:hover,
  &:focus {
    opacity: 1;
  }
}

.comment-content {
  padding: 0em;
}

.comment-like {
  cursor: pointer;
}

.infos {
  display: flex;
  align-items: center;
}

.content-wrapper {
  padding:1.2em 1.2em .5em ;
  border-bottom: 1px solid #F1EEFF;

  &.full {
    border-left: 1px solid transparent;
  }
}

.date {
  font-size: 0.8em;
  padding-right: 0.5em;
  margin-left: auto;
}

.preview-info {
  margin-top: 0;
  padding-top: 0;

  .date {
    margin-right: 26px;
  }
}

p {
  margin: 0;
}

.attachment {
  display: block;
  text-align: center;
  margin: 0.4em auto;
}

.attachment-icon {
  margin: 0.6em;
}

.copy-icon {
  cursor: pointer;
  margin-left: .5em;
}

.congrats-picture {
  max-width: 300px;
}

@media screen and (max-width: 768px) {
  .flexrow {
    flex-direction: column;
    align-items: flex-start;
  }
}
.person-name {
  color: var(--text);
  padding-left: 12px;
}

.avatar{
  width: 32px;
  height: 32px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #F1EEFF;
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 0;
  }
}

</style>
