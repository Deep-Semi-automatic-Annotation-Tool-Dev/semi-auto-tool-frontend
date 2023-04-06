import axios from "axios";

export const getDataList = (context, id, page) => {
    axios.get(`${context.$baseURL}api/v1/project/${id}/data?size=100&page=${page}`)
        .then(response => {
            context.lineData = response.data._embedded.dataResponseControllerDtoList;
            console.log(response.data._embedded);
        })
        .catch(error => {
            console.log('get data error', error);
        });
}

export const addTagInData = async (context, projectId, tagGroupId, tagId, dataId, dataIdx) => {
    await axios.put(`${context.$baseURL}api/v1/project/${projectId}/data`, {
        "id": dataId,
        "data_tags": [{
            "tag_group_id": tagGroupId,
            "tag_id": tagId
        }]
    })
        .then(response => {
            // context.lineData[dataIdx].data_tags.push()
            console.log(response, dataIdx);
        })
        .catch(error => {
            console.log('put tag in data error', error);
        });
}
