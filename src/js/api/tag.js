import axios from "axios";
import {loadProject} from "@/js/api/common";

export const getTagGroupList = async (context, projectId, dataTypeId) => {
    context.loadingDialogTitle = "태그 그룹"
    context.loadingDialogSubTitle = "태그 그룹을 가져오는 중 입니다."
    context.showLoadingDialog = true

    context.selectedTagGroupId = 0
    context.tagGroups = []

    try {
        const result = await axios.get(`${context.$baseURL}api/v1/project/${projectId}/tagGroup?dataTypeId=${dataTypeId}&size=100`)
        let tagGroupData = result.data._embedded.tagGroupResponseControllerDtoList;
        for (let i = 0;i < tagGroupData.length;i++) tagGroupData[i].value = i;
        context.tagGroups = tagGroupData
        console.log('get tag groups', context.tagGroups)
    } catch(error) {
        context.tagGroups = []
        console.error('get tag group error', error);
    } finally {
        context.selectedTagGroup = 0
        context.showLoadingDialog = false
    }
}

export const getTagList = async (context, projectId, tagGroupId) => {
    context.loadingDialogTitle = '태그 목록'
    context.loadingDialogSubTitle = '태그 목록 가져오는 중...'
    context.showLoadingDialog = true
    try {
        const result = await axios.get(`${context.$baseURL}api/v1/project/${projectId}/tagGroup/${tagGroupId}/tag?size=100`)
        context.tags = result.data._embedded.tagResponseControllerDtoList;
    } catch (error) {
        context.tags = []
        console.error('get tag group error', error);
    } finally {
        context.showLoadingDialog = false
    }
}

export const addTagGroup = async (context, projectId, groupText) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '태그 그룹 추가'
    context.loadingDialogSubTitle = '태그 그룹 추가 중...'

    try {
        await axios.post(`${context.$baseURL}api/v1/project/${projectId}/tagGroup`, {
            "project_id": projectId,
            "tag_group_name": groupText
        })
        loadProject(context, projectId, context.dataPage - 1)
    } catch (error) {
        console.error('add tag group error', error);
    } finally {
        context.showLoadingDialog = false
    }
}

export const deleteTagGroup = async (context, projectId, tagGroupId,) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '태그 그룹 삭제'
    context.loadingDialogSubTitle = '태그 그룹 삭제 중...'

    try {
        await axios.delete(`${context.$baseURL}api/v1/project/${projectId}/tagGroup/${tagGroupId}`)
        loadProject(context, projectId, context.dataPage - 1)
    } catch (error) {
        console.error('delete tag group error', error);
    } finally {
        context.showLoadingDialog = false
    }
}

export const addTag = async (context, projectId, tagGroupId, tag_name, tag_color) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '태그 추가'
    context.loadingDialogSubTitle = '태그 추가 중...'

    try {
        await axios.post(`${context.$baseURL}api/v1/project/${projectId}/tagGroup/${tagGroupId}/tag`, {
            "tag_name": tag_name,
            "tag_color": tag_color
        })
        loadProject(context, projectId, context.dataPage - 1)
    } catch (error) {
        console.error('add tag group error', error);
    } finally {
        context.showLoadingDialog = false
    }
}

export const deleteTag = async (context, projectId, tagGroupId, tagId) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '태그 삭제'
    context.loadingDialogSubTitle = '태그 삭제 중...'

    try {
        await axios.delete(`${context.$baseURL}api/v1/project/${projectId}/tagGroup/${tagGroupId}/tag/${tagId}`)
        loadProject(context, projectId, context.dataPage - 1)
    } catch (error) {
        console.error('delete tag group error', error);
    } finally {
        context.showLoadingDialog = false
    }
}

export const changeTagInform = async (context, projectId, tagGroupId, tagId, tag_name, tag_color) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '태그 정보 변경'
    context.loadingDialogSubTitle = '태그 정보 변경 중...'

    try {
        await axios.put(`${context.$baseURL}api/v1/project/${projectId}/tagGroup/${tagGroupId}/tag/${tagId}`, {
            "tag_name": tag_name,
            "tag_color": tag_color
        })
        loadProject(context, projectId, context.dataPage - 1)
    } catch (error) {
        console.error('delete tag group error', error);
    } finally {
        context.showLoadingDialog = false
    }
}
