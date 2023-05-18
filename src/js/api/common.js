import {getTagGroupList, getTagList} from "@/js/api/tag";
import {getDataList} from "@/js/api/data";
import {disconnectLoggingSSE, initStatusSSE} from "@/js/sse/train";
// import {getProjectStatus} from "@/js/api/train";

export const initVariables = (context) => {
    context.initStatus = true

    context.dataPage = 0
    context.dataPageSave = 1
    context.dataTotalPage = 1
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
    context.selectionRank = 'sumRank'
    context.trainResultData = null
    context.firstParagraph = -1
    context.childData = []
    context.makeParagraphStatus = ''
}

export const loadProject = async (context, id, page) => {
    // context.wordMap.clear()
    // context.paragraphMap.clear()
    disconnectLoggingSSE()

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