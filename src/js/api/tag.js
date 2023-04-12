import axios from "axios";
import {getDataList} from "@/js/api/data";

const loadProject = async (context, id, page) => {

    context.dataPage = 0
    context.dataTotalPage = 0
    context.selectedTagGroupId = 0
    context.stepperIdx = 0
    context.projectRightClickedId = 0
    context.lineData = []
    context.tags = []
    context.tagGroups = []
    context.tagGroupSelectionModel = 0

    await getTagGroupList(context, id)
    if (context.tagGroups.length > 0) {
        console.log(context.tagGroups)
        await getTagList(context, id, context.tagGroups[context.selectedTagGroup].tag_group_id)
    }
    await getDataList(context, id, page)
}

export const getTagGroupList = async (context, projectId) => {
    context.loadingDialogTitle = "태그 그룹"
    context.loadingDialogSubTitle = "태그 그룹을 가져오는 중 입니다."
    context.showLoadingDialog = true
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

            context.showLoadingDialog = false
            // console.log(tagGroupData);
        })
        .catch(error => {
            context.showLoadingDialog = false
            console.log('get tag group error', error);
        });
}

export const getTagList = async (context, projectId, tagGroupId) => {
    context.loadingDialogTitle = '태그 목록'
    context.loadingDialogSubTitle = '태그 목록 가져오는 중...'
    context.showLoadingDialog = true
    await axios.get(`${context.$baseURL}api/v1/project/${projectId}/tagGroup/${tagGroupId}/tag?size=100`)
        .then(response => {
            try {
                context.tags = response.data._embedded.tagResponseControllerDtoList;
            } catch {
                context.tags = []
            }
            // console.log(response);
            context.showLoadingDialog = false
        })
        .catch(error => {
            context.showLoadingDialog = false
            console.log('get tag group error', error);
        });
}

export const addTagGroup = async (context, projectId, groupText) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '태그 그룹 추가'
    context.loadingDialogSubTitle = '태그 그룹 추가 중...'
    await axios.post(`${context.$baseURL}api/v1/project/${projectId}/tagGroup`, {
        "project_id": projectId,
        "tag_group_name": groupText
    })
        .then(async () => {
            context.showLoadingDialog = false
            loadProject(context, projectId, context.dataPage - 1)
        })
        .catch(error => {
            context.showLoadingDialog = false
            console.log('add tag group error', error);
        });
}

export const deleteTagGroup = async (context, projectId, tagGroupId,) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '태그 그룹 삭제'
    context.loadingDialogSubTitle = '태그 그룹 삭제 중...'
    await axios.delete(`${context.$baseURL}api/v1/project/${projectId}/tagGroup/${tagGroupId}`)
        .then(() => {
            context.showLoadingDialog = false
            loadProject(context, projectId, context.dataPage - 1)
        })
        .catch(error => {
            context.showLoadingDialog = false
            console.log('delete tag group error', error);
        });
}

export const addTag = async (context, projectId, tagGroupId, tag_name, tag_color) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '태그 추가'
    context.loadingDialogSubTitle = '태그 추가 중...'
    await axios.post(`${context.$baseURL}api/v1/project/${projectId}/tagGroup/${tagGroupId}/tag`, {
        "tag_name": tag_name,
        "tag_color": tag_color
    })
        .then(async () => {
            context.showLoadingDialog = false
            loadProject(context, projectId, context.dataPage - 1)
        })
        .catch(error => {
            context.showLoadingDialog = false
            console.log('add tag group error', error);
        });
}

export const deleteTag = async (context, projectId, tagGroupId, tagId) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '태그 삭제'
    context.loadingDialogSubTitle = '태그 삭제 중...'
    await axios.delete(`${context.$baseURL}api/v1/project/${projectId}/tagGroup/${tagGroupId}/tag/${tagId}`)
        .then(() => {
            // context.tags = response.data._embedded.tagResponseControllerDtoList;
            // console.log(response)
            context.showLoadingDialog = false
            loadProject(context, projectId, context.dataPage - 1)
        })
        .catch(error => {
            context.showLoadingDialog = false
            console.log('delete tag group error', error);
        });
}

export const changeTagInform = async (context, projectId, tagGroupId, tagId, tag_name, tag_color) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '태그 정보 변경'
    context.loadingDialogSubTitle = '태그 정보 변경 중...'
    await axios.put(`${context.$baseURL}api/v1/project/${projectId}/tagGroup/${tagGroupId}/tag/${tagId}`, {
        "tag_name": tag_name,
        "tag_color": tag_color
    })
        .then(() => {
            // context.tags = response.data._embedded.tagResponseControllerDtoList;
            // console.log(response)
            context.showLoadingDialog = false
            loadProject(context, projectId, context.dataPage - 1)
        })
        .catch(error => {
            context.showLoadingDialog = false
            console.log('delete tag group error', error);
        });
}
