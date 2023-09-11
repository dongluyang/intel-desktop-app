import axios from 'axios';
import { getTeamApiUrl } from "../../utils/global";




export async function listComment(submitId) {
  const apiUrl = getTeamApiUrl() + '/getSubmitsReturn';
  return new Promise((resolve, reject) => {
    axios
      .post(apiUrl, {id:submitId})
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


// 新增审验评论
export async function addComment(checkinor, replyText, submitId, fileInfoList) {
  const commentUrl = getTeamApiUrl() + '/addReturnFileIDList';
  return new Promise((resolve, reject) => {
    axios
      .post(commentUrl, {checkinor:checkinor,notes:replyText,submitID:submitId, fileInfoList: fileInfoList})
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


// 新增审验评论
export async function postReview(formdata) {
  const config = {
    headers: {'Content-Type': 'multipart/form-data;boundary='+new Date().getTime()}
  }
  const url = await getTeamApiUrl() + '/uploadReturnFileContent';
  console.log(url)
  // let list = returnList.push(submitId)

  // return new Promise((resolve, reject) => {
  //   axios
  //     .post(url, list)
  //     .then((response) => {
  //       resolve(response.data);
  //     })
  //     .catch((error) => {
  //       reject(error);
  //     });
  // });

  return new Promise((resolve, reject) => {
    axios
      .post(url, formdata,config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


// 删除审验评论
export async function deleteComment(id, submitId) {
  const deleteUrl = getTeamApiUrl() + '/deleteSubmitReturnFile';
  return new Promise((resolve, reject) => {
    axios
      .post(deleteUrl, {id: id, submitId: submitId})
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


// 修改审验评论
export async function updateComment(list, submitId) {
  const updateUrl = getTeamApiUrl() + '/updateSubmitReturnNotes';
  return new Promise((resolve, reject) => {
    axios
      .post(updateUrl, {id: list.id, newCom: list.content, submitId: submitId})
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// 下载文件
export async function download(list) {
  const downloadUrl = getTeamApiUrl() + '/downloadReturnFile';
  axios
    .post(downloadUrl, {id: list.id, name: list.name}, {responseType: "blob"})
    .then((res) => {
      let blob = new Blob([res.data], { type: res.data.type });
      // 获取heads中的filename文件名
      let downloadElement = document.createElement("a");
      // 创建下载的链接
      let href = window.URL.createObjectURL(blob);
      downloadElement.href = href;
      // 下载后文件名
      downloadElement.download = list.name;
      document.body.appendChild(downloadElement);
      // 点击下载
      downloadElement.click();         // 下载完成移除元素
      document.body.removeChild(downloadElement);
      // 释放掉blob对象
    });
}


export async function getImageByUrl(url) {
	return new Promise((resolve, reject) => {
		axios.get(url, {
			headers: {
				Origin: 'http://cgteam.net'
			},
			responseType: 'blob'
		})
			.then(response => {
				resolve(URL.createObjectURL(response.data));
			})
			.catch(error => {
				console.error('Error loading image:', error);
				reject(error);
			})
	});
}

