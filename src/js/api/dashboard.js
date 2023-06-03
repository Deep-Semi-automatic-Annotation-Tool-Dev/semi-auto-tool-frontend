import {getRecentTrainResultALL, getTrainList} from "@/js/api/project";
import {getTagGroupListDashboard} from "@/js/api/tag";

export const loadHistory = async (context, projectId) => {
    // context.tagGroups = []
    // context.tagGroupSelectionModel = 0
    // context.selectedTagGroupId = 0
    // context.trainResultData = null

    context.sentenceTagGroups = []
    context.selectedSentenceTagGroupId = 0
    context.sentenceTagGroupSelectionModel = 0
    context.sentenceTagGroups = await getTagGroupListDashboard(context, projectId, context.DATA_TYPE_SENTENCE)

    context.wordTagGroups = []
    context.selectedWordTagGroupId = 0
    context.wordTagGroupSelectionModel = 0
    context.wordTagGroups = await getTagGroupListDashboard(context, projectId, context.DATA_TYPE_WORD)

    context.paragraphTagGroups = []
    context.selectedParagraphTagGroupId = 0
    context.paragraphTagGroupSelectionModel = 0
    context.paragraphTagGroups = await getTagGroupListDashboard(context, projectId, context.DATA_TYPE_PARAGRAPH)

    await getRecentTrainResultALL(context, projectId)
    await getTrainList(context, context.selectedProjectId, true)
}