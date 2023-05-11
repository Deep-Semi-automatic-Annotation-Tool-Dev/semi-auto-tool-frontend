import axios from "axios";

export const startTrain = async (context, project_id, tag_group_id, train_name, epoch, lr) => {
    try {
        const result = await axios.post(
            `/api/v1/model/${project_id}/train/${tag_group_id}`,
            {
                'train_name': train_name,
                'gpt_epochs': epoch,
                'gpt_lr': lr,
                'bert_epochs': epoch,
                'bert_lr': lr,
            },
            // {
            //     headers: {
            //         'Access-Control-Allow-Origin': 'https://autotag-ml.hrabit64.xyz/',
            //         'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            //     }
            // }
        )
        console.log(result.data)
        return result.data.stream_key
    } catch (error) {
        console.error('train start error', error);
        return null
    }
}