import {getRecentTrainResult, getTrainList} from "@/js/api/project";

export const loadHistory = async (context, projectId) => {
    await getRecentTrainResult(context, projectId)
    await getTrainList(context, context.selectedProjectId)
}