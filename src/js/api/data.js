import axios from "axios";
import {getTagGroupList, getTagList} from "@/js/api/tag";

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

export const getDataList = (context, id, page) => {
    context.loadingDialogTitle = '데이터 로딩'
    context.loadingDialogSubTitle = "텍스트 데이터를 가져오는 중 입니다."
    context.showLoadingDialog = true
    axios.get(`${context.$baseURL}api/v1/project/${id}/data?size=150&page=${page}`)
        .then(response => {
            try {
                context.lineData = response.data._embedded.dataResponseControllerDtoList;
                context.dataPage = response.data.page.number + 1
                context.dataTotalPage = response.data.page.totalPages

                for (let d of context.lineData) {
                    d.search = true
                }
            } catch {
                context.lineData = []
                context.dataPage = 0
                context.dataTotalPage = 0
            }
            context.showLoadingDialog = false
            console.log(response.data);
        })
        .catch(error => {
            context.showLoadingDialog = false
            console.log('get data error', error);
        });
}

export const addTagInData = async (context, projectId, targetTag, targetDataIdx) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '태그 할당'
    context.loadingDialogSubTitle = '데이터에 태그 할당 중...'

    const targetData = context.lineData[targetDataIdx]
    const newTags = []
    let found = 0
    for (let tIdx in targetData.data_tags) {
        const target = targetData.data_tags[tIdx]
        const insertData = {}
        if (target.tagGroupId === targetTag.tag_group_id) {
            insertData.tag_group_id = targetTag.tag_group_id
            insertData.tag_id = targetTag.tag_id
            found = 1
        } else {
            insertData.tag_group_id = target.tagGroupId
            insertData.tag_id = target.tagId
        }
        newTags.push(insertData)
    }
    if (!found) {
        newTags.push({
            "tag_group_id": targetTag.tag_group_id,
            "tag_id": targetTag.tag_id
        })
    }
    console.log(newTags)
    await axios.put(`${context.$baseURL}api/v1/project/${projectId}/data`, [{
        "id": targetData.id,
        "text": targetData.text,
        "data_tags": newTags
    }])
        .then((response) => {
            targetData.data_tags = response.data[0].data_tags
            console.log(response.data[0].data_tags);
            context.showLoadingDialog = false
        })
        .catch(error => {
            context.showLoadingDialog = false
            console.log('put tag in data error', error);
        });
}

export const deleteTagInData = async (context, projectId, targetTag, targetDataIdx) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '데이터 태그 삭제'
    context.loadingDialogSubTitle = '데이터에 할당된 태그 제거 중...'

    const targetData = context.lineData[targetDataIdx]
    const newTags = []
    for (let tIdx in targetData.data_tags) {
        const target = targetData.data_tags[tIdx]
        const insertData = {}
        if (target.tagId === targetTag.tagId) {
            continue
        }
        insertData.tag_group_id = target.tagGroupId
        insertData.tag_id = target.tagId
        newTags.push(insertData)
    }
    console.log(newTags)
    await axios.put(`${context.$baseURL}api/v1/project/${projectId}/data`, [{
        "id": targetData.id,
        "text": targetData.text,
        "data_tags": newTags
    }])
        .then((response) => {
            console.log(response.data[0].data_tags);
            targetData.data_tags = response.data[0].data_tags
            context.showLoadingDialog = false
        })
        .catch(error => {
            context.showLoadingDialog = false
            console.log('put tag delete in data error', error);
        });
}

export const postData = (context, projectId, file, colName) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '데이터 업로드'
    context.loadingDialogSubTitle = '데이터에 업로드 중...'

    let dataFile = new FormData()
    dataFile.append("file", file)

    axios.post(`${context.$baseURL}api/v1/project/${projectId}/data?colName=${colName}`, dataFile,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            context.showLoadingDialog = false
            loadProject(context, projectId, 0)
            console.log(response);
        })
        .catch(error => {
            context.showLoadingDialog = false
            console.log('post data error', error);
        });
}
