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

export const addTagInData = async (context, projectId, tagGroupId, tagId) => {
    await axios.put(`${context.$baseURL}api/v1/project/${projectId}/data`, {
        "data_tags": [{
            "tag_group_id": tagGroupId,
            "tag_id": tagId
        }]
    })
        .then(response => {
            context.lineData[]
            // console.log(response);
        })
        .catch(error => {
            console.log('put tag in data error', error);
        });
}
