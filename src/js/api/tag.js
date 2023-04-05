import axios from "axios";

export const getTagGroupList = async (context, projectId) => {
    await axios.get(`${context.$baseURL}api/v1/project/${projectId}/tagGroup?size=100`)
        .then(response => {
            let tagGroupData = response.data._embedded.tagGroupResponseControllerDtoList;
            for (let i = 0;i < tagGroupData.length;i++) {
                tagGroupData[i].value = i;
            }
            context.tagGroups = tagGroupData
            context.selectedTagGroup = 0
            console.log(tagGroupData);
        })
        .catch(error => {
            console.log('get tag group error', error);
        });
}

export const getTagList = async (context, projectId, tagGroupId) => {
    await axios.get(`${context.$baseURL}api/v1/project/${projectId}/tagGroup/${tagGroupId}/tag?size=100`)
        .then(response => {
            context.tags = response.data._embedded.tagResponseControllerDtoList;
            console.log(response);
        })
        .catch(error => {
            console.log('get tag group error', error);
        });
}
