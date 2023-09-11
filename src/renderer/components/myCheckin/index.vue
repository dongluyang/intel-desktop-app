<template>
	<div>
		<div>
			<div class="home">
				<n-card>
					<span style="font-size: 20px">
						{{ checkinTaskTitle }}
					</span>
				</n-card>

				<n-tabs
					@update:value="switchTab"
					class="card-tabs"
					default-value="work"
					size="large"
					animated
					style="margin: 0 4px"
					pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
					<n-tab-pane name="work" tab="待我审批">
					</n-tab-pane>
					<n-tab-pane name="done" tab="我参与的">
					</n-tab-pane>
				</n-tabs>

				<vxe-table
					:loading="loading"
					border
					show-overflow
					:data="taskList"
					:column-config="{resizable: true}"
					:edit-config="{trigger: 'click', mode: 'cell'}">
					<vxe-column field="key" title="序号" width="60"></vxe-column>
					<vxe-column field="name" title="任务名" width="180"></vxe-column>
					<vxe-column field="projectName" title="场次名" width="180"></vxe-column>
					<vxe-column field="parentProjectName" title="项目名" width="180"></vxe-column>
					<vxe-column field="stage" title="阶段" width="80"></vxe-column>
					<vxe-column field="status" title="状态" width="80"></vxe-column>
					<vxe-column title="操作">
						<template #default="{ row }">
							<vxe-button type="text" status="primary" @click="showReview(row)">审验</vxe-button>
						</template>
					</vxe-column>
				</vxe-table>
			</div>
		</div>
		<div>
			<n-drawer v-model:show="reviewVisible" width="100%" :placement="'right'" :close-on-esc="false">
				<n-drawer-content :title="taskName" closable="true">
					<taskReview  :task-id="taskId" />
				</n-drawer-content>
			</n-drawer>
		</div>
	</div>
</template>

<script lang="ts">
	import { h, defineComponent, onMounted, reactive, toRefs } from 'vue';
	import { getUserInfo, getLocal, setLocal } from '@/utils';

	import Qs from 'qs';
	import emitter from '@/service/eventbus';

	import { getAllProjects, getMyCheckinTasks } from '@/service';
	import taskReview from './taskReview.vue'


  export default defineComponent({
    name: 'myCheckin',

    components: {
			taskReview
		},

    setup() {

      const state = reactive({
        user: '',
        status:'work',
        note:'',
        taskData:null,
        reviewVisible:false,
        total: 0,
        loading: true,
        taskList: [],
        pagination: {
          pageSize: 10
        },
        taskId:null,
        taskName:null,
        teamList: [],
        teamName: '',
        projectList: [],
        checkinTaskTitle: '',
      });

      onMounted(() => {

				emitter.on("selectTeam", msg => {
					const userInfo = getUserInfo();
					state.user = userInfo.userName;
					getTeamList();
					getProjectList();
					getMyCheckinTaskList();
				});

				const userInfo = getUserInfo();
				state.user = userInfo.userName;
        getTeamList();
        getProjectList();
        getMyCheckinTaskList();
      });

      const switchTab = async ( value )=>{
        state.status = value;
        getMyCheckinTaskList();
      };

      const getTeamList = async () => {
        const list = getLocal('TEAMS');
        state.teamList = [];
        if (list ==  null) {
          return
        }
        for (let i = 0; i < list.length; i++) {
          state.teamList.push({ name: list[i].groupName, key: list[i].groupName, label: list[i].groupName })
        }
        state.teamName = getLocal('TEAMINFO').groupName;
      };

      const getProjectList = async () => {
        state.projectList = await getAllProjects();
      };

      const getMyCheckinTaskList = async () => {
        state.loading = true;
        state.taskList = [];
        state.total = 0;
        const data = await getMyCheckinTasks(state.user, state.status);
				let datas = [];
        for (let i = 0; i < data.length; i++) {
					let status = '';
          if (!data[i].isDone) {
						status = '设计';
					}
          else if (data[i].isDone && !data[i].isFinished) {
						status = '审验';
					} else
              status = '完成';
          for (let j = 0; j < state.projectList.length; j++) {
            if (data[i].projectName == state.projectList[j].name) {
              data[i].parentProjectName = state.projectList[j].project;
              break;
            }
          }
          datas.push({
            key: (i + 1).toString(),
            id: data[i]._id,
            name: data[i].name,
            parentProjectName: data[i].parentProjectName,
            projectName: data[i].projectName,
            status: status,
            stage: data[i].stage,
            diffcult: data[i].diffcult,
            executor: data[i].executor,
            checkinor: data[i].checkinor,
          });
        }
				state.taskList = datas;
        state.total = state.taskList.length;
        state.checkinTaskTitle = '我的审验任务列表(' + state.total.toString() + ')';
        state.loading = false;
      };

      const onRefresh = () => {
        getMyCheckinTaskList();
      };

     	const showReview = (record: {}) => {
			 state.reviewVisible = true
			 state.taskId = record.id;
			 state.taskName = "任务审验 " + record.name + record.stage;
		 	};

      const onReturnTask = async () => {
        state.showRollback = false
        // await rollbackTask(state.taskData.id, state.note);
        getMyCheckinTaskList();
      };

      return {
        switchTab,
        onRefresh,
        onReturnTask,
				showReview,
        ...toRefs(state),
      };
    }
  })
</script>

<style scoped>
.tableHeaderRight {
  width: 100px;
}
:deep.line {
  margin: 0 18px;
}
.dataout {
  padding: 24px;
}
:deep(.danger .status) {
  color: #f56c6c !important;
}
:deep(.warning .status) {
  color: #e6a23c !important;
}
:deep(.success .status) {
  color: #67C23A !important;
}
</style>
