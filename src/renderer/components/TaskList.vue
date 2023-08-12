<template>
  <a-table :columns="columns" :data="data" @row-dblclick="doubleClickRow" />
</template>

<script>
import { reactive } from 'vue';

export default {
  setup() {
    const doubleClickRow = (row)=> {
      window.alert(row.name)
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
