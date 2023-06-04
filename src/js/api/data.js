import axios from "axios";
import {loadProject} from "@/js/api/common";

export const getDataList = async (context, projectId, page, tagGroupId, pageable) => {
    context.loadingDialogTitle = '데이터 로딩'
    context.loadingDialogSubTitle = "텍스트 데이터를 가져오는 중 입니다."
    context.showLoadingDialog = true

    // context.sentenceMap.clear()
    if (context.reloadCount === 0) {
        try {
            const result = await axios.get(`${context.$baseURL}api/v1/project/${projectId}/data?size=100&page=${page}`)
            context.lineData = result.data._embedded.dataResponseControllerDtoList;
            context.dataPage = result.data.page.number + 1
            context.dataTotalPage = result.data.page.totalPages

            for (let d of context.lineData) {
                d.search = true
                d.text = d.text
                    .replaceAll('\n', ' ')
                    .replaceAll('\t', ' ')
                    .replaceAll('\r', ' ')
                    .replaceAll('\b', ' ')
                    .replaceAll('\v', ' ')
                    .replaceAll('\f', ' ')
                // context.sentenceMap.set(d.id, d.data_tags)
            }

            console.log(result.data);
            // console.log(context.sentenceMap);
        } catch (error) {
            context.lineData = []
            context.dataPage = 0
            context.dataTotalPage = 0
            console.error('get data error', error);
        } finally {
            context.showLoadingDialog = false
        }
    } else {
        try {
            const result = await axios.get(`${context.$baseURL}api/v1/project/${projectId}/data/${tagGroupId}/rank/sentence?size=100&page=${page}&sort=${pageable}`)
            context.lineData = result.data._embedded.dataResponseControllerDtoList;
            context.dataPage = result.data.page.number + 1
            context.dataTotalPage = result.data.page.totalPages

            for (let d of context.lineData) {
                d.search = true
                d.text = d.text
                    .replaceAll('\n', ' ')
                    .replaceAll('\t', ' ')
                    .replaceAll('\r', ' ')
                    .replaceAll('\b', ' ')
                    .replaceAll('\v', ' ')
                    .replaceAll('\f', ' ')
                // context.sentenceMap.set(d.id, d.data_tags)
            }

            console.log('reloaded', result.data);
        } catch (error) {
            context.lineData = []
            context.dataPage = 0
            context.dataTotalPage = 0
            console.error('get data reload error', error);
            if (error.response.data.type === 'ES010') {
                alert("모든 데이터의 태깅이 완료되었습니다.")
            } else if (error.response.data.type === 'ES006') {
                alert("학습 정보가 없습니다 ")
            } else {
                alert(`오류가 발생했습니다. error: ${error.response.data.type}`)
            }
        } finally {
            context.showLoadingDialog = false
        }
    }
}

export const getWordDataList = async (context, projectId, startIndex, endIndex, tagGroupId, page, pageable) => {
    context.loadingDialogTitle = '단어 데이터 로딩'
    context.loadingDialogSubTitle = "단어 태깅 데이터를 가져오는 중 입니다."
    context.showLoadingDialog = true

    if (context.reloadCount === 0) {
        try {
            const result = await axios.get(`${context.$baseURL}api/v1/project/${projectId}/data/word?startIndex=${startIndex}&endIndex=${endIndex}`)

            for (let word of result.data) {
                let parentId = word.parent_id
                if (context.wordTagData[parentId] === undefined) context.wordTagData[parentId] = []
                context.wordTagData[parentId].push(word)
            }
            // console.log(result.data);
        } catch (error) {
            console.error('get word data error', error);
        } finally {
            context.showLoadingDialog = false
        }
    } else {
        try {
            const result = await axios.get(`${context.$baseURL}api/v1/project/${projectId}/data/${tagGroupId}/rank/word?size=100&page=${page}&sort=${pageable}`)

            context.lineData = []
            context.dataPage = result.data.page.number + 1
            context.dataTotalPage = result.data.page.totalPages

            const sentenceData = {}
            for (let d of result.data._embedded.rankWordIndexResponseDtoList) {
                sentenceData[d.parent_id] = {
                    id: d.parent_id,
                    project_id: d.project_id,
                    text: d.parent_text
                }
            }
            context.lineData = Object.values(sentenceData)

            for (let d of context.lineData) {
                d.search = true
                d.text = d.text
                    .replaceAll('\n', ' ')
                    .replaceAll('\t', ' ')
                    .replaceAll('\r', ' ')
                    .replaceAll('\b', ' ')
                    .replaceAll('\v', ' ')
                    .replaceAll('\f', ' ')
                // context.sentenceMap.set(d.id, d.data_tags)
            }

            for (let word of result.data._embedded.rankWordIndexResponseDtoList) {
                let parentId = word.parent_id
                if (context.wordTagData[parentId] === undefined) context.wordTagData[parentId] = []
                context.wordTagData[parentId].push(word)
            }
            console.log('reloaded', result.data);
        } catch (error) {
            console.error('get word reload data error', error);
            if (error.response.data.type === 'ES010') {
                alert("모든 데이터의 태깅이 완료되었습니다.")
            } else if (error.response.data.type === 'ES006') {
                alert("학습 정보가 없습니다 ")
            } else {
                alert(`오류가 발생했습니다. error: ${error.response.data.type}`)
            }
        } finally {
            context.showLoadingDialog = false
        }
    }
}

export const getParagraphDataList = async (context, projectId, startIndex, endIndex, tagGroupId, page, pageable) => {
    context.loadingDialogTitle = '문단 데이터 로딩'
    context.loadingDialogSubTitle = "문단 태깅 데이터를 가져오는 중 입니다."
    context.showLoadingDialog = true

    if (context.reloadCount === 0) {
        try {
            const result = await axios.get(`${context.$baseURL}api/v1/project/${projectId}/data/paragraph?startIndex=${startIndex}&endIndex=${endIndex}`)

            result.data.paragraph_indexes.sort((a, b) => {
                return b.start_index - a.start_index
            })
            console.log(result.data);
            context.paragraphData = {}
            for (let data of result.data.paragraph_indexes) {
                context.paragraphData[data.id] = data
            }
        } catch (error) {
            console.error('get paragraph data error', error);
        } finally {
            context.showLoadingDialog = false
        }
    } else {
        try {
            const result = await axios.get(`${context.$baseURL}api/v1/project/${projectId}/data/${tagGroupId}/rank/paragraph?size=100&page=${page}&sort=${pageable}`)

            context.lineData = []
            context.dataPage = result.data.page.number + 1
            context.dataTotalPage = result.data.page.totalPages

            for (let d of result.data._embedded.rankParagraphResponseDtoList) {
                for (let l of d.child_data) {
                    context.lineData.push({
                        id: l.id,
                        project_id: d.project_id,
                        text: l.text
                    })
                }
            }

            for (let d of context.lineData) {
                d.search = true
                d.text = d.text
                    .replaceAll('\n', ' ')
                    .replaceAll('\t', ' ')
                    .replaceAll('\r', ' ')
                    .replaceAll('\b', ' ')
                    .replaceAll('\v', ' ')
                    .replaceAll('\f', ' ')
                // context.sentenceMap.set(d.id, d.data_tags)
            }

            result.data._embedded.rankParagraphResponseDtoList.sort((a, b) => {
                return b.start_index - a.start_index
            })
            context.paragraphData = {}
            for (let data of result.data._embedded.rankParagraphResponseDtoList) {
                context.paragraphData[data.id] = data
            }
            console.log('reloaded', result.data);
        } catch (error) {
            console.error('get paragraph reload data error', error);
            if (error.response.data.type === 'ES010') {
                alert("모든 데이터의 태깅이 완료되었습니다.")
            } else if (error.response.data.type === 'ES006') {
                alert("학습 정보가 없습니다 ")
            } else {
                alert(`오류가 발생했습니다. error: ${error.response.data.type}`)
            }
        } finally {
            context.showLoadingDialog = false
        }
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
        targetData.data_tags = result.data.data_tags
        console.log(result.data.data_tags);
    } catch (error) {
        console.error('put tag in data error', error);
        alert(`${error.response.data.detail} error: ${error.response.data.type}`)
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
        console.log(result.data.data_tags);
        targetData.data_tags = result.data.data_tags
    } catch (error) {
        console.error('put tag delete in data error', error);
        alert(`${error.response.data.detail} error: ${error.response.data.type}`)
    } finally {
        context.showLoadingDialog = false
    }
}




export const createWord = async (context, projectId, parentId, startIdx, endIdx, tagGroupId, tagId) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '단어 태그 추가'
    context.loadingDialogSubTitle = '단어 데이터 추가 중...'

    try {
        const result = await axios.post(`${context.$baseURL}api/v1/project/${projectId}/data/word`,
            {
                "parent_data_id": parentId,
                "start_index": startIdx,
                "end_index": endIdx - 1,
                "data_tags": [
                    {
                        "tag_group_id": tagGroupId,
                        "tag_id": tagId
                    }
                ]
            })
        console.log(result.data);
        try {
            context.wordTagData[result.data.parent_id].push(result.data)
        } catch (e) {
            context.wordTagData[result.data.parent_id] = [result.data]
        }
        // targetData.data_tags = result.data.data_tags
    } catch (error) {
        console.error('post word error', error);
        alert(`${error.response.data.detail} error: ${error.response.data.type}`)
    } finally {
        context.showLoadingDialog = false
    }
}

export const addTagInWord = async (context, projectId, itemIdx, parentIdx, targetTag) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '단어 태그 추가'
    context.loadingDialogSubTitle = '단어에 할당된 태그 추가 중...'

    const targetData = context.wordTagData[parentIdx][itemIdx]
    const newTags = []
    let found = 0
    for (let tIdx in targetData.data_target_tags) {
        const target = targetData.data_target_tags[tIdx]
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
        const result = await axios.put(`${context.$baseURL}api/v1/project/${projectId}/data/${targetData.id}`,
            {
                "data_tags": newTags
            })
        console.log(result.data.data_tags);
        targetData.data_target_tags = result.data.data_tags
    } catch (error) {
        console.error('put tag delete in word error', error);
        alert(`${error.response.data.detail} error: ${error.response.data.type}`)
    } finally {
        context.showLoadingDialog = false
    }
}

export const deleteTagInWord = async (context, projectId, itemIdx, parentIdx, targetTag) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '단어 태그 삭제'
    context.loadingDialogSubTitle = '단어에 할당된 태그 제거 중...'

    const targetData = context.wordTagData[parentIdx][itemIdx]
    const newTags = []
    for (let tIdx in targetData.data_target_tags) {
        const target = targetData.data_target_tags[tIdx]
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
        console.log(result.data.data_tags);
        targetData.data_target_tags = result.data.data_tags
    } catch (error) {
        console.error('put tag delete in word error', error);
        alert(`${error.response.data.detail} error: ${error.response.data.type}`)
    } finally {
        context.showLoadingDialog = false
    }
}

export const deleteWord = async (context, projectId, dataId) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '단어 삭제'
    context.loadingDialogSubTitle = '단어 삭제 중...'

    try {
        await axios.delete(`${context.$baseURL}api/v1/project/${projectId}/data/${dataId}`)

        context.wordTagData = {}
        if (context.reloadCount === 0) {
            if (context.lineData.length > 0) {
                let startIdx = context.lineData[context.lineData.length - 1].id
                let endIdx = context.lineData[0].id

                context.showLoadingDialog = false
                await getWordDataList(
                    context,
                    context.selectedProjectId,
                    startIdx,
                    endIdx,
                    context.tagGroups[context.selectedTagGroupId].tag_group_id,
                    context.dataPage - 1,
                    context.selectionRank
                )
            }
        } else {
            context.showLoadingDialog = false
            await getWordDataList(
                context,
                context.selectedProjectId,
                0, 0,
                context.tagGroups[context.selectedTagGroupId].tag_group_id,
                context.dataPage - 1,
                context.selectionRank
            )
        }

    } catch (error) {
        console.error('word data delete error', error);
        context.showLoadingDialog = false
        alert(`${error.response.data.detail} error: ${error.response.data.type}`)
    }
}





export const addTagInParagraph = async (context, projectId, parentIdx, targetTag) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '문단 태그 추가'
    context.loadingDialogSubTitle = '문단에 할당된 태그 추가 중...'

    const targetData = context.paragraphData[parentIdx]
    const newTags = []
    let found = 0
    for (let tIdx in targetData.data_target_tags) {
        const target = targetData.data_target_tags[tIdx]
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
        const result = await axios.put(`${context.$baseURL}api/v1/project/${projectId}/data/${targetData.id}`,
            {
                "data_tags": newTags
            })
        console.log(result.data.data_tags);
        targetData.data_target_tags = result.data.data_tags
    } catch (error) {
        console.error('put tag in paragraph error', error);
        alert(`${error.response.data.detail} error: ${error.response.data.type}`)
    } finally {
        context.showLoadingDialog = false
    }
}

export const deleteTagInParagraph = async (context, projectId, itemId, targetTag) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '문단 태그 삭제'
    context.loadingDialogSubTitle = '문단에 할당된 태그 제거 중...'

    const targetData = context.paragraphData[itemId]
    const newTags = []
    for (let target of targetData.data_target_tags) {
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
        console.log(result.data.data_tags);
        targetData.data_target_tags = result.data.data_tags
    } catch (error) {
        console.error('put tag delete in paragraph error', error);
        alert(`${error.response.data.detail} error: ${error.response.data.type}`)
    } finally {
        context.showLoadingDialog = false
    }
}

export const createParagraph = async (context, projectId, childDatas, tagGroupId, tagId) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '문단 태그 추가'
    context.loadingDialogSubTitle = '문단 데이터 추가 중...'

    try {
        const result = await axios.post(`${context.$baseURL}api/v1/project/${projectId}/data/paragraph`,
            {
                "child_data_ids": childDatas,
                "data_tags": [
                    {
                        "tag_group_id": tagGroupId,
                        "tag_id": tagId
                    }
                ]
            })
        console.log(result.data);
        context.paragraphData[result.data.id] = result.data
    } catch (error) {
        console.error('post word error', error);
        if (error.response.data.type === 'ES008') {
            alert("중복 데이터가 존재합니다.")
        } else {
            alert(`오류가 발생했습니다. error: ${error.response.data.type}`)
        }
    } finally {
        context.showLoadingDialog = false
    }
}

export const deleteParagraph = async (context, projectId, dataId) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '문단 삭제'
    context.loadingDialogSubTitle = '문단 삭제 중...'

    try {
        await axios.delete(`${context.$baseURL}api/v1/project/${projectId}/data/${dataId}`)

        context.paragraphData = {}
        if (context.reloadCount === 0) {
            if (context.lineData.length > 0) {
                let startIdx = context.lineData[context.lineData.length - 1].id
                let endIdx = context.lineData[0].id

                context.showLoadingDialog = false
                await getParagraphDataList(context, context.selectedProjectId, startIdx, endIdx)
            }
        } else {
            context.showLoadingDialog = false
            await getParagraphDataList(
                context,
                context.selectedProjectId,
                0, 0,
                context.tagGroups[context.selectedTagGroupId].tag_group_id,
                context.dataPage - 1,
                context.selectionRank
            )
        }
    } catch (error) {
        console.error('paragraph data delete error', error);
        context.showLoadingDialog = false
        alert(`${error.response.data.detail} error: ${error.response.data.type}`)
    }
}




export const postData = async (context, projectId, file, colName) => {
    context.showLoadingDialog = true
    context.loadingDialogTitle = '데이터 업로드'
    context.loadingDialogSubTitle = '데이터에 업로드 중...'

    let dataFile = new FormData()
    dataFile.append("file", file)

    try {
        const result = await axios.post(`${context.$baseURL}api/v1/project/${projectId}/data/upload?colName=${colName}`, dataFile,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        console.log(result);
        context.showLoadingDialog = false
        loadProject(context, projectId, 0, false)
    } catch (error) {
        console.error('post data error', error);
        alert(`${error.response.data.detail} error: ${error.response.data.type}`)
        context.showLoadingDialog = false
    }
}

export const resultDownload = async (context, projectId) => {
    context.showLoadingProgressDialog = true
    context.loadingProgressDialogTitle = '데이터 다운로드'
    context.loadingProgressDialogSubTitle = '데이터 태깅 결과 다운로드 중...'

    try {
        const result = await axios.get(`${context.$baseURL}api/v1/project/${projectId}/data/download`, {
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => {
                // console.log(progressEvent)
                context.showLoadingProgressDialogMax = progressEvent.total
                context.showLoadingProgressDialogNow = progressEvent.loaded
                const progressRate = Math.round(progressEvent.loaded / progressEvent.total * 10000) / 100
                context.loadingProgressDialogSubTitle = `데이터 태깅 결과 다운로드 중 (${progressRate}%)...`
            }
        })
        console.log(result);

        const blob = new Blob([result.data], { type: 'text/csv' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `${context.selectedProjectName}_result`
        link.click()
        URL.revokeObjectURL(link.href)
    } catch (error) {
        console.error('download result error', error);
        alert(`${error.response.data.detail} error: ${error.response.data.type}`)
    } finally {
        context.showLoadingProgressDialog = false
    }
}

// export const dataReloadByRank = async (context, projectId, dataId) => {
//     context.showLoadingDialog = true
//     context.loadingDialogTitle = '데이터 리로딩'
//     context.loadingDialogSubTitle = '데이터 리로드 중...'
//
//     try {
//         await axios.delete(`${context.$baseURL}api/v1/project/${projectId}/data/${dataId}`)
//
//     } catch (error) {
//         console.error('data reload error', error);
//         context.showLoadingDialog = false
//     }
// }
