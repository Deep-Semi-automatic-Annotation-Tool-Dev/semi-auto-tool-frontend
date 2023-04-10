import axios from "axios";

export const getDataList = (context, id, page) => {
    axios.get(`${context.$baseURL}api/v1/project/${id}/data?size=100&page=${page}`)
        .then(response => {
            try {
                context.lineData = response.data._embedded.dataResponseControllerDtoList;
            } catch {
                context.lineData = []
            }
            // console.log(response.data._embedded);
        })
        .catch(error => {
            console.log('get data error', error);
        });
}

export const addTagInData = async (context, projectId, targetTag, targetDataIdx, tagGroupId) => {
    const targetData = context.lineData[targetDataIdx]
    console.log(targetTag)
    await axios.put(`${context.$baseURL}api/v1/project/${projectId}/data`, [{
        "id": targetData.id,
        "text": targetData.text,
        "data_tags": [{
            "tag_group_id": targetTag.tag_group_id,
            "tag_id": targetTag.tag_id
        }]
    }])
        .then(() => {
            let found = 0
            for (let tIdx in targetData.data_tags) {
                const target = targetData.data_tags[tIdx]
                if (target.tagGroupId === targetTag.tag_group_id) {
                    target.tagId = targetTag.tag_id
                    target.tagColor = targetTag.tag_color
                    target.tagName = targetTag.tag_name
                    found = 1
                    break
                }
            }
            if (!found) {
                targetData.data_tags.push({
                    'tagColor': targetTag.tag_color,
                    'tagGroupId': targetTag.tag_group_id,
                    'tagGroupName': context.tagGroups[tagGroupId].tag_group_name,
                    'tagId': targetTag.tag_id,
                    'tagName': targetTag.tag_name
                })
            }
            // console.log(response, dataIdx);
        })
        .catch(error => {
            console.log('put tag in data error', error);
        });
}
