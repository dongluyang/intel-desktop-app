import axios from 'axios'
import{getTeamApiUrl} from './global'
import service from './request'
export async function getMyAllTasks(userName) {
    const apiUrl = await getTeamApiUrl() + '/getMyAllTasks';
    return new Promise((resolve, reject) => {
      axios
        .post(apiUrl, { user: userName })
        .then((response) => {
          resolve(response.data);
        })
        .catch(
          (error) => {
          reject(error);
        });
    });
  }
  
  
  export async function getMyCheckinTasks(userName, status) {
    const apiUrl = await getTeamApiUrl() + '/getMyCheckinTasks';
    return new Promise((resolve, reject) => {
      axios
        .post(apiUrl, { user: userName, status:status })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    })
}


export async function getSmallFile(id) {
    const apiUrl = await getTeamApiUrl() + '/findSmallFile';
    return new Promise((resolve, reject) => {
      axios
        .post(apiUrl, { id: id })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  
  
  export async function getObsUrl(fileName,taskName,projectName) {
      const apiUrl = await getTeamApiUrl() + '/getObsUrl';
      return new Promise((resolve, reject) => {
          axios
              .post(apiUrl, { file: fileName,project:projectName,task:taskName })
              .then((response) => {
                  resolve(response.data);
              })
              .catch((error) => {
                  reject(error);
              });
      });
  }


export async function getTaskVersionList(taskId) {
    const apiUrl = await getTeamApiUrl() + '/getAllVersions4Task';
    return new Promise((resolve, reject) => {
      axios
        .post(apiUrl, { taskId: taskId})
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  
  export async function getTaskPreviewList(taskId,v) {
    const apiUrl = await getTeamApiUrl() + '/getTaskPreviews';
    return new Promise((resolve, reject) => {
      axios
        .post(apiUrl, { taskId: taskId,v:v})
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  
  export async function updateAnnotations(data) {
    const apiUrl = await getTeamApiUrl() + '/updateAnnotations';
    return new Promise((resolve, reject) => {
      axios
        .post(apiUrl, data)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  

  export async function getSubmit(id) {
    const apiUrl = await getTeamApiUrl() + '/getSubmit';
    return new Promise((resolve, reject) => {
      axios
        .post(apiUrl, { id: id })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }



  export async function submitTask(id) {
    const apiUrl = await getTeamApiUrl() + '/submitTask';
    return new Promise((resolve, reject) => {
      axios
        .post(apiUrl, { id: id })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }


  export async function listPluginList() {
    const apiUrl = 'http://cgyun.cn/cgproxy/system/plugin/list';
    return new Promise((resolve, reject) => {
    service.get(apiUrl,{})
    .then((response) => {
      resolve(response.rows);
    })
    .catch((error) => {
      reject(error);
    });
  });
  }