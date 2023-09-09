import{getTeamApiUrl} from './global'

export async function getMyAllTasks(userName) {
    const apiUrl = getTeamApiUrl() + '/getMyAllTasks';
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
    const apiUrl = getTeamApiUrl() + '/getMyCheckinTasks';
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
    const apiUrl = getTeamApiUrl() + '/findSmallFile';
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
      const apiUrl = getTeamApiUrl() + '/getObsUrl';
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
    const apiUrl = getTeamApiUrl() + '/getAllVersions4Task';
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
    const apiUrl = getTeamApiUrl() + '/getTaskPreviews';
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
    const apiUrl = getTeamApiUrl() + '/updateAnnotations';
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
    const apiUrl = getTeamApiUrl() + '/getSubmit';
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
    const apiUrl = getTeamApiUrl() + '/submitTask';
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