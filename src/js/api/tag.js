import axios from "axios";
import {getDataList} from "@/js/api/data";

const loadProject = async (context, id, page) => {
    await getTagGroupList(context, id)
    if (context.tagGroups.length > 0) {
        console.log(context.tagGroups)
        await getTagList(context, id, context.tagGroups[context.selectedTagGroup].tag_group_id)
    }
    await getDataList(context, id, page)
}

export const getTagGroupList = async (context, projectId) => {
    await axios.get(`${context.$baseURL}api/v1/project/${projectId}/tagGroup?size=100`)
        .then(response => {
            try {
                let tagGroupData = response.data._embedded.tagGroupResponseControllerDtoList;
                for (let i = 0;i < tagGroupData.length;i++) {
                    tagGroupData[i].value = i;
                }
                context.tagGroups = tagGroupData
                context.selectedTagGroup = 0
            } catch {
                context.tagGroups = []
                context.selectedTagGroup = 0
            }

            // console.log(tagGroupData);
        })
        .catch(error => {
            console.log('get tag group error', error);
        });
}

export const getTagList = async (context, projectId, tagGroupId) => {
    await axios.get(`${context.$baseURL}api/v1/project/${projectId}/tagGroup/${tagGroupId}/tag?size=100`)
        .then(response => {
            try {
                context.tags = response.data._embedded.tagResponseControllerDtoList;
            } catch {
                context.tags = []
            }
            // console.log(response);
        })
        .catch(error => {
            console.log('get tag group error', error);
        });
}

export const addTagGroup = async (context, projectId, groupText) => {
    await axios.post(`${context.$baseURL}api/v1/project/${projectId}/tagGroup`, {
        "project_id": projectId,
        "tag_group_name": groupText
    })
        .then(async () => {
            loadProject(context, projectId, 0)
        })
        .catch(error => {
            console.log('add tag group error', error);
        });
}

export const deleteTagGroup = async (context, projectId, tagGroupId,) => {
    await axios.delete(`${context.$baseURL}api/v1/project/${projectId}/tagGroup/${tagGroupId}`)
        .then(() => {
            // context.tags = response.data._embedded.tagResponseControllerDtoList;
            // console.log(response)
            loadProject(context, projectId, 0)
        })
        .catch(error => {
            console.log('delete tag group error', error);
        });
}

export const addTag = async (context, projectId, tagGroupId, tag_name, tag_color) => {
    await axios.post(`${context.$baseURL}api/v1/project/${projectId}/tagGroup/${tagGroupId}/tag`, {
        "tag_name": tag_name,
        "tag_color": tag_color
    })
        .then(async () => {
            loadProject(context, projectId, 0)
        })
        .catch(error => {
            console.log('add tag group error', error);
        });
}

export const deleteTag = async (context, projectId, tagGroupId, tagId) => {
    await axios.delete(`${context.$baseURL}api/v1/project/${projectId}/tagGroup/${tagGroupId}/tag/${tagId}`)
        .then(() => {
            // context.tags = response.data._embedded.tagResponseControllerDtoList;
            // console.log(response)
            loadProject(context, projectId, 0)
        })
        .catch(error => {
            console.log('delete tag group error', error);
        });
}

export const changeTagInform = async (context, projectId, tagGroupId, tagId, tag_name, tag_color) => {
    await axios.put(`${context.$baseURL}api/v1/project/${projectId}/tagGroup/${tagGroupId}/tag/${tagId}`, {
        "tag_name": tag_name,
        "tag_color": tag_color
    })
        .then(() => {
            // context.tags = response.data._embedded.tagResponseControllerDtoList;
            // console.log(response)
            loadProject(context, projectId, 0)
        })
        .catch(error => {
            console.log('delete tag group error', error);
        });
}
