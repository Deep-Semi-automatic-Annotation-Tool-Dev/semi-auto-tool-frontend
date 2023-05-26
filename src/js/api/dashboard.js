import {getRecentTrainResultALL, getTrainList} from "@/js/api/project";
import {getTagGroupList} from "@/js/api/tag";

export const loadHistory = async (context, projectId) => {
    context.tagGroups = []
    context.tagGroupSelectionModel = 0
    context.selectedTagGroupId = 0
    context.trainResultData = null

    await getTagGroupList(context, projectId)
    await getRecentTrainResultALL(context, projectId)
    await getTrainList(context, context.selectedProjectId)
}