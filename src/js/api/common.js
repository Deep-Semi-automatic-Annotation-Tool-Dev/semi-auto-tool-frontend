import {getTagGroupList, getTagList} from "@/js/api/tag";
import {getDataList, getParagraphDataList, getWordDataList} from "@/js/api/data";
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

export const getDataByTagMod = async (context, mod) => {
    context.selectedTag = 0
    switch (mod) {
        case 'word': {
            context.lineData = []
            context.wordTagData = {}
            context.nowModId = context.DATA_TYPE_WORD
            context.tags = []
            context.tagGroupSelectionModel = 0
            context.selectedTag = 0

            await getTagGroupList(context, context.selectedProjectId, context.nowModId)
            if (context.tagGroups.length > 0) {
                await getTagList(context, context.selectedProjectId, context.tagGroups[context.selectedTagGroupId].tag_group_id)
            }

            if (context.reloadCount === 0) {
                await getDataList(
                    context,
                    context.selectedProjectId,
                    context.dataPage - 1,
                    0,
                    context.selectionRank
                )

                if (context.lineData.length > 0) {
                    let startIdx = context.lineData[context.lineData.length - 1].id
                    let endIdx = context.lineData[0].id
                    await getWordDataList(
                        context,
                        context.selectedProjectId,
                        startIdx,
                        endIdx,
                        0,
                        context.dataPage - 1,
                        context.selectionRank
                    )
                }
            } else {
                await getWordDataList(
                    context,
                    context.selectedProjectId,
                    0, 0,
                    context.tagGroups[context.selectedTagGroupId].tag_group_id,
                    context.dataPage - 1,
                    context.selectionRank
                )
            }

            break
        }
        case 'sentence': {
            context.lineData = []
            context.nowModId = context.DATA_TYPE_SENTENCE
            context.tags = []
            context.tagGroupSelectionModel = 0
            context.selectedTag = 0

            await getTagGroupList(context, context.selectedProjectId, context.nowModId)
            if (context.tagGroups.length > 0) {
                await getTagList(context, context.selectedProjectId, context.tagGroups[context.selectedTagGroupId].tag_group_id)
            }

            if (context.reloadCount === 0) {
                await getDataList(
                    context,
                    context.selectedProjectId,
                    context.dataPage - 1,
                    0,
                    context.selectionRank
                )
            } else {
                await getDataList(
                    context,
                    context.selectedProjectId,
                    context.dataPage - 1,
                    context.tagGroups[context.selectedTagGroupId].tag_group_id,
                    context.selectionRank
                )
            }
            break
        }
        case 'paragraph': {
            context.makeParagraphStatus = '문단을 지정할 문장을 선택해 주세요'
            context.lineData = []
            context.firstParagraph = -1
            context.childData = []
            context.paragraphData = {}
            context.nowModId = context.DATA_TYPE_PARAGRAPH
            context.tags = []
            context.tagGroupSelectionModel = 0
            context.selectedTag = 0

            await getTagGroupList(context, context.selectedProjectId, context.nowModId)
            if (context.tagGroups.length > 0) {
                await getTagList(context, context.selectedProjectId, context.tagGroups[context.selectedTagGroupId].tag_group_id)
            }

            if (context.reloadCount === 0) {
                await getDataList(
                    context,
                    context.selectedProjectId,
                    context.dataPage - 1
                )

                let startIdx = context.lineData[context.lineData.length - 1].id
                let endIdx = context.lineData[0].id
                await getParagraphDataList(context, context.selectedProjectId, startIdx, endIdx)
            } else {
                await getParagraphDataList(
                    context,
                    context.selectedProjectId,
                    0, 0,
                    context.tagGroups[context.selectedTagGroupId].tag_group_id,
                    context.dataPage - 1,
                    context.selectionRank
                )
            }
            break
        }
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

    await getDataByTagMod(context, context.tagMod)

    // await getTagGroupList(context, id, context.nowModId)
    // if (context.tagGroups.length > 0) {
    //     console.log(context.tagGroups)
    //     await getTagList(context,
    //         id,
    //         context.tagGroups[context.selectedTagGroupId].tag_group_id)
    // }
    // if (context.reloadCount === 0) {
    //     await getDataList(context, id, page)
    // } else {
    //     await getDataList(context, id, page, context.tagGroups[context.selectedTagGroupId].tag_group_id, context.selectionRank)
    // }
    // await getProjectStatus(context, context.tagGroups[context.selectedTagGroupId].tag_group_id)
}