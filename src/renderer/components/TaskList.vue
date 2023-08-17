<template>


  <a-layout>
    <a-layout-sider>
      <div class="menu-demo">
        <a-menu
            :style="{ width: '200px', height: '100%' }"
            :default-open-keys="['0']"
            :default-selected-keys="['0_2']"
            show-collapse-button
            breakpoint="xl"
            default-collapsed="false"
            @collapse="onCollapse"
        >
          <a-menu-item key="0">
            <a-button type="text" @click="clickTasks">
              <template #icon>
                <icon-pen-fill />
              </template>
              <template #default>待我提交</template>
            </a-button>
          </a-menu-item>
          <a-menu-item key="1">
            <a-button type="text">
              <template #icon>
                <icon-tool />
              </template>
              <template #default>待我审验</template>
            </a-button>
          </a-menu-item>
        </a-menu>
      </div>
    </a-layout-sider>
    <a-layout-content>
      <div style="padding: 10px;">
      <a-table :columns="columns" :data="data" @row-dblclick="doubleClickRow" />
    </div>
    </a-layout-content>
  </a-layout>


</template>

<script>
import { reactive } from 'vue';

export default {
  setup() {
    const doubleClickRow = (row)=> {
      window.alert(row.name)
      window.plugins.open("maya2018")
    }
    const columns = [
      {
        title: '任务名',
        dataIndex: 'name',
        ellipsis: true,
        tooltip: true,
        width: 150
      },
      {
        title: '场次名',
        dataIndex: 'projectName',
        width: 150
      },
      {
        title: '项目名',
        dataIndex: 'project',
        ellipsis: true,
        width: 150,
      },
      {
        title: '阶段',
        dataIndex: 'stage',
        ellipsis: true,
        tooltip: {position: 'left'},
        width: 100,
      },
    ];
    const data = reactive([{
      key: '1',
      name: 'chr_Guiboshi',
      projectName: 'FPCW_Asset',
      project: 'FPCW',
      stage: '模型'
    }, {
      key: '2',
      name: 'chr_Guiboshi',
      projectName: 'FPCW_Asset',
      project: 'FPCW',
      stage: '模型'
    }, {
      key: '3',
      name: 'chr_Guiboshi',
      projectName: 'FPCW_Asset',
      project: 'FPCW',
      stage: '模型'
    }, {
      key: '4',
      name: 'chr_Guiboshi',
      projectName: 'FPCW_Asset',
      project: 'FPCW',
      stage: '模型'
    }, {
      key: '5',
      name: 'chr_Guiboshi',
      projectName: 'FPCW_Asset',
      project: 'FPCW',
      stage: '模型'
    }]);

    return {
      columns,
      data,
      doubleClickRow
    }
  },
}
</script>
