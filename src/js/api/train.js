import axios from "axios";

export const startTrain = async (context, project_id, tag_group_id, train_name) => {
    try {
        await axios.post(`${context.$mlURL}api/v1/model/${project_id}/train/${tag_group_id}?train_name=${train_name}`)
    } catch (error) {
        console.log('train start error', error);
    }
}