import axios from "axios";

export const getDataList = (context, id, page) => {
    axios.get(`${context.$baseURL}api/v1/project/${id}/data?size=100&page=${page}`)
        .then(response => {
            try {
                context.lineData = response.data._embedded.dataResponseControllerDtoList;
            } catch {
                context.lineData = []
            }
            console.log(response.data._embedded);
        })
        .catch(error => {
            console.log('get data error', error);
        });
}

export const addTagInData = async (context, projectId, targetTag, targetDataIdx) => {
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
        })
        .catch(error => {
            console.log('put tag in data error', error);
        });
}

export const deleteTagInData = async (context, projectId, targetTag, targetDataIdx) => {
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
        })
        .catch(error => {
            console.log('put tag delete in data error', error);
        });
}
