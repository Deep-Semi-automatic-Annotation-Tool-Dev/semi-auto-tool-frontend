import {getTagGroupList, getTagList} from "@/js/api/tag";
import {getDataList} from "@/js/api/data";
import {initStatusSSE} from "@/js/sse/train";
// import {getProjectStatus} from "@/js/api/train";

export const initVariables = (context) => {
    context.initStatus = true

    context.dataPage = 0
    context.dataTotalPage = 0
    context.selectedTagGroupId = 0
    context.stepperIdx = 0
    context.projectRightClickedId = 0
    context.lineData = []
    context.tags = []
    context.tagGroups = []
    context.tagGroupSelectionModel = 0
    context.selectedTag = 0
    context.tagMod = 'sentence'
    context.wordTagData = {}
    context.selectionRank = 'sumRank'
    context.trainResultData = null
}

export const loadProject = async (context, id, page) => {
    // context.wordMap.clear()
    // context.paragraphMap.clear()

    initVariables(context)
    initStatusSSE(context, id)

    await getTagGroupList(context, id)
    if (context.tagGroups.length > 0) {
        console.log(context.tagGroups)
        await getTagList(context,
            id,
            context.tagGroups[context.selectedTagGroupId].tag_group_id)
    }
    await getDataList(context, id, page)
    // await getProjectStatus(context, context.tagGroups[context.selectedTagGroupId].tag_group_id)
}