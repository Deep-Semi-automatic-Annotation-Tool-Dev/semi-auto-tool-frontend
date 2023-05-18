import axios from "axios";
import {initVariables} from "@/js/api/common";

export const getProjectList = async (context) => {
    try {
        const result = await axios.get(`${context.$baseURL}api/v1/project?size=100`)
        context.projectList = result.data._embedded.projectResponseControllerDtoList;
    } catch (error) {
        console.error('get project error', error);
    }
}

export const createProject = async (context, title) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '프로젝트 생성'
    context.loadingDialogSubTitle = '프로젝트 생성 중...'
    // console.log(title.length)

    try {
        await axios.post(`${context.$baseURL}api/v1/project`, {
            project_name: title
        })
        context.showLoadingDialog = false
        getProjectList(context)
    } catch (error) {
        console.error('post project error', error);
        context.showLoadingDialog = false
    }
}

export const renameProject = async (context, title, id) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '프로젝트 이름 변경'
    context.loadingDialogSubTitle = '프로젝트 이름 변경 중...'
    // console.log(title.length)

    try {
        await axios.put(`${context.$baseURL}api/v1/project/${id}`, {
            project_name: title
        })
        context.showLoadingDialog = false
        getProjectList(context)
    } catch (error) {
        context.showLoadingDialog = false
        console.error('put project error', error);
    }
}

export const deleteProject = async (context, id) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '프로젝트 삭제'
    context.loadingDialogSubTitle = '프로젝트 삭제 중...'

    try {
        await axios.delete(`${context.$baseURL}api/v1/project/${id}`)
        context.showLoadingDialog = false
        initVariables(context)
        getProjectList(context)
    } catch (error) {
        context.showLoadingDialog = false
        console.error('delete project error', error);
    }
}

export const getRecentTrainResult = async (context, projectId) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '학습결과 가져오기'
    context.loadingDialogSubTitle = '최근 학습 결과 가져오는 중...'
    try {
        const result = await axios.get(`${context.$baseURL}api/v1/project/${projectId}/statistics`)
        console.log(result.data)
        context.trainResultData = {}
        for (let t of result.data.tag_group_stats) {
            context.trainResultData[t.tag_group_name] = t
        }
    } catch (error) {
        console.error('get train result error', error);
        context.trainResultData = null
    }  finally {
        context.showLoadingDialog = false
    }
}



export const getTrainList = async (context, projectId)  =>{
    context.showLoadingDialog = true
    context.loadingDialogTitle = '학습 기록 목록 가져오기'
    context.loadingDialogSubTitle = '학습 기록 목록 가져오는 중...'
    try {
        const result = await axios.get(`${context.$baseURL}api/v1/project/${projectId}/train`)
        console.log(result.data)
    } catch (error) {
        console.error('get train result list error', error);
    }  finally {
        context.showLoadingDialog = false
    }
}