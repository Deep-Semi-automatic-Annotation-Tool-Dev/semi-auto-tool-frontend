import axios from "axios";
import {loadProject} from "@/js/api/common";

export const getDataList = async (context, id, page) => {
    context.loadingDialogTitle = '데이터 로딩'
    context.loadingDialogSubTitle = "텍스트 데이터를 가져오는 중 입니다."
    context.showLoadingDialog = true

    context.sentenceMap.clear()
    try {
        const result = await axios.get(`${context.$baseURL}api/v1/project/${id}/data?size=100&page=${page}`)
        context.lineData = result.data._embedded.dataResponseControllerDtoList;
        context.dataPage = result.data.page.number + 1
        context.dataTotalPage = result.data.page.totalPages

        for (let d of context.lineData) {
            d.search = true
            context.sentenceMap.set(d.id, d.data_tags)
        }

        console.log(result.data);
        console.log(context.sentenceMap);
    } catch (error) {
        context.lineData = []
        context.dataPage = 0
        context.dataTotalPage = 0
        console.error('get data error', error);
    } finally {
        context.showLoadingDialog = false
    }
}

export const getWordDataList = async (context, projectId, startIndex, endIndex) => {
    context.loadingDialogTitle = '단어 데이터 로딩'
    context.loadingDialogSubTitle = "단어 태깅 데이터를 가져오는 중 입니다."
    context.showLoadingDialog = true
    try {
        const result = await axios.get(`${context.$baseURL}api/v1/project/${projectId}/data/word?startIndex=${startIndex}&endIndex=${endIndex}`)

        for (let word of result.data) {
            let parentId = word.parent_id
            if (context.wordTagData[parentId] === undefined) context.wordTagData[parentId] = []
            context.wordTagData[parentId].push(word)
        }
        console.log(result.data);
    } catch (error) {
        console.error('get word data error', error);
    } finally {
        context.showLoadingDialog = false
    }
}

export const getParagraphDataList = async (context, projectId, startIndex, endIndex) => {
    context.loadingDialogTitle = '문단 데이터 로딩'
    context.loadingDialogSubTitle = "문단 태깅 데이터를 가져오는 중 입니다."
    context.showLoadingDialog = true
    try {
        const result = await axios.get(`${context.$baseURL}api/v1/project/${projectId}/data/paragraph?startIndex=${startIndex}&endIndex=${endIndex}`)

        result.data.paragraph_indexes.sort((a, b) => {
            return b.start_index - a.start_index
        })
        console.log(result.data);
        context.paragraphData = result.data
    } catch (error) {
        console.error('get word data error', error);
    } finally {
        context.showLoadingDialog = false
    }
}

export const addTagInData = async (context, projectId, targetTag, targetDataIdx, dataId) => {
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

    try {
        const result = await axios.put(`${context.$baseURL}api/v1/project/${projectId}/data/${dataId}`,
            {
            "data_tags": newTags
        })
        targetData.data_tags = result.data[0].data_tags
        console.log(result.data[0].data_tags);
    } catch (error) {
        console.error('put tag in data error', error);
    } finally {
        context.showLoadingDialog = false
    }
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

    try {
        const result = await axios.put(`${context.$baseURL}api/v1/project/${projectId}/data/${targetData.id}`,
            {
            "data_tags": newTags
        })
        console.log(result.data[0].data_tags);
        targetData.data_tags = result.data[0].data_tags
    } catch (error) {
        console.error('put tag delete in data error', error);
    } finally {
        context.showLoadingDialog = false
    }
}

// export const deleteTagInWord = async (context) => {
//     context.showLoadingDialog = true
//     context.loadingDialogTitle = '단어 태그 삭제'
//     context.loadingDialogSubTitle = '단어에 할당된 태그 제거 중...'
//
//     const targetData = context.lineData[targetDataIdx]
//     const newTags = []
//     for (let tIdx in targetData.data_tags) {
//         const target = targetData.data_tags[tIdx]
//         const insertData = {}
//         if (target.tagId === targetTag.tagId) {
//             continue
//         }
//         insertData.tag_group_id = target.tagGroupId
//         insertData.tag_id = target.tagId
//         newTags.push(insertData)
//     }
//     console.log(newTags)
//
//     try {
//         const result = await axios.put(`${context.$baseURL}api/v1/project/${projectId}/data`, [{
//             "id": targetData.id,
//             "text": targetData.text,
//             "data_tags": newTags
//         }])
//         console.log(result.data[0].data_tags);
//         targetData.data_tags = result.data[0].data_tags
//     } catch (error) {
//         console.error('put tag delete in data error', error);
//     } finally {
//         context.showLoadingDialog = false
//     }
// }

export const postData = async (context, projectId, file, colName) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '데이터 업로드'
    context.loadingDialogSubTitle = '데이터에 업로드 중...'

    let dataFile = new FormData()
    dataFile.append("file", file)

    try {
        const result = await axios.post(`${context.$baseURL}api/v1/project/${projectId}/data?colName=${colName}`, dataFile,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        console.log(result);
        context.showLoadingDialog = false
        loadProject(context, projectId, 0)
    } catch (error) {
        console.error('post data error', error);
        context.showLoadingDialog = false
    }
}
