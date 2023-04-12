import axios from "axios";

export const getProjectList = (context) => {
    axios.get(`${context.$baseURL}api/v1/project?size=100`)
        .then(response => {
            context.projectList = response.data._embedded.projectResponseControllerDtoList;
            // console.log(projectList);
        })
        .catch(error => {
            console.log('get project error', error);
        });
}

export const createProject = (context, title) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '프로젝트 생성'
    context.loadingDialogSubTitle = '프로젝트 생성 중...'
    // console.log(title.length)
    axios.post(`${context.$baseURL}api/v1/project`, {
        project_name: title
    })
        // eslint-disable-next-line no-unused-vars
        .then(async response => {
            context.showLoadingDialog = false
            await getProjectList(context)
        })
        .catch(error => {
            context.showLoadingDialog = false
            console.log('post project error', error);
        });
}

export const renameProject = (context, title, id) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '프로젝트 이름 변경'
    context.loadingDialogSubTitle = '프로젝트 이름 변경 중...'
    // console.log(title.length)
    axios.put(`${context.$baseURL}api/v1/project/${id}`, {
        project_name: title
    })
        // eslint-disable-next-line no-unused-vars
        .then(async response => {
            context.showLoadingDialog = false
            await getProjectList(context)
        })
        .catch(error => {
            context.showLoadingDialog = false
            console.log('put project error', error);
        });
}

export const deleteProject = (context, id) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '프로젝트 삭제'
    context.loadingDialogSubTitle = '프로젝트 삭제 중...'
    axios.delete(`${context.$baseURL}api/v1/project/${id}`)
        // eslint-disable-next-line no-unused-vars
        .then(async response => {
            context.showLoadingDialog = false

            context.dataPage = 0
            context.dataTotalPage = 0
            context.selectedTagGroupId = 0
            context.stepperIdx = 0
            context.projectRightClickedId = 0
            context.lineData = []
            context.tags = []
            context.tagGroups = []
            context.tagGroupSelectionModel = 0

            await getProjectList(context)
        })
        .catch(error => {
            context.showLoadingDialog = false
            console.log('delete project error', error);
        });
}
