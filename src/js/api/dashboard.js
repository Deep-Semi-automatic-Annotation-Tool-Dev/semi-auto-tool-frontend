import {getRecentTrainResultALL, getTrainList} from "@/js/api/project";
import {getTagGroupList} from "@/js/api/tag";

export const loadHistory = async (context, projectId) => {
    await getTagGroupList(context, projectId)
    await getRecentTrainResultALL(context, projectId)
    await getTrainList(context, context.selectedProjectId)
}