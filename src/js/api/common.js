import {getTagGroupList, getTagList} from "@/js/api/tag";
import {getDataList} from "@/js/api/data";
import {disconnectLoggingSSE, disconnectStatusSSE, initStatusSSE} from "@/js/sse/train";
import {getTrainList} from "@/js/api/project";
// import {getProjectStatus} from "@/js/api/train";

export const initVariables = (context, reload) => {
    context.initStatus = true

    context.selectedTagGroupId = 0
    context.stepperIdx = 0

    context.projectRightClickedId = 0

    context.lineData = []
    context.tags = []
    context.tagGroups = []

    context.tagGroupSelectionModel = 0
    context.selectedTag = 0

    context.wordTagData = {}
    context.paragraphData = {}

    context.trainResultData = null
    context.logDatas = []
    context.logMsg = ""
    context.trainStatus = -1
    context.isIndeterminate = true
    context.logProgressMax = 0
    context.logProgressNow = 0
    context.trainName = ''

    context.dataPageSave = 1
    context.firstParagraph = -1
    context.childData = []
    context.makeParagraphStatus = ''

    if (!reload) {
        context.nowModId = context.DATA_TYPE_SENTENCE
        context.tagMod = 'sentence'

        context.dataPage = 1
        context.dataTotalPage = 0

        context.selectionRank = 'sum'
        context.reloadCount = 0
    }
}

export const loadProject = async (context, id, page, reload) => {
    // context.wordMap.clear()
    // context.paragraphMap.clear()
    disconnectLoggingSSE()
    disconnectStatusSSE()

    initVariables(context, reload)
    initStatusSSE(context, id)

    const result = await getTrainList(context, id, false)
    if (result !== null && result.page.totalElements > 0) {
        // context.reloadCount = 1
        context.editable = false
    } else {
        // context.reloadCount = 0
        context.editable = true
    }
    // console.log("reloaded", context.reloadCount)

    await getTagGroupList(context, id, context.nowModId)
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