import {getTagGroupList, getTagList} from "@/js/api/tag";
import {getDataList} from "@/js/api/data";
import {disconnectLoggingSSE, initStatusSSE} from "@/js/sse/train";
import {getTrainList} from "@/js/api/project";
// import {getProjectStatus} from "@/js/api/train";

export const initVariables = (context) => {
    context.initStatus = true

    context.dataPage = 1
    context.dataPageSave = 1
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
    context.paragraphData = {}
    context.selectionRank = 'sum'
    context.trainResultData = null
    context.firstParagraph = -1
    context.childData = []
    context.makeParagraphStatus = ''
    context.reloadCount = 0
    context.logDatas = []
    context.trainStatus = -1
    context.logMsg = ""
    context.isIndeterminate = true
    context.logProgressMax = 0
    context.logProgressNow = 0
}

export const loadProject = async (context, id, page) => {
    // context.wordMap.clear()
    // context.paragraphMap.clear()
    disconnectLoggingSSE()

    initVariables(context)
    initStatusSSE(context, id)

    const result = await getTrainList(context, id)
    if (result !== null && result.page.totalElements > 0) {
        context.reloadCount = 1
    } else {
        context.reloadCount = 0
    }
    console.log("reloaded", context.reloadCount)

    await getTagGroupList(context, id)
    if (context.tagGroups.length > 0) {
        console.log(context.tagGroups)
        await getTagList(context,
            id,
            context.tagGroups[context.selectedTagGroupId].tag_group_id)
    }
    if (context.reloadCount === 0) {
        await getDataList(context, id, page)
    } else {
        await getDataList(context, id, page, context.tagGroups[context.selectedTagGroupId].tag_group_id, context.selectionRank)
    }
    // await getProjectStatus(context, context.tagGroups[context.selectedTagGroupId].tag_group_id)
}