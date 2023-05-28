export let sseTrain = null;
export let sseStatus = null;

export const disconnectStatusSSE = () => {
    if (sseStatus !== null) {
        sseStatus.disconnect()
        sseStatus = null
    }
}

export const initStatusSSE = (context, project_id) => {
    disconnectStatusSSE()
    sseStatus = context.$sse.create({
        url: `${context.$mlURL}api/v1/model/${project_id}/status`,
        format: 'plain',
        // withCredentials: true,
        // polyfill: true,
    })
    sseStatus.on('status', context.receiveStatus);

    sseStatus.connect()
        .then(sse => {
            console.log('init status connected!');
            console.log(sse)

            // setTimeout(() => {
            //     sseTrain.off('run', context.handleMessage);
            //     console.log('Stopped listening to event-less messages!');
            // }, 2 * 1000);
        })
        .catch((err) => {
            console.error('Failed to connect init status', err);
        });
}



export const disconnectLoggingSSE = () => {
    if (sseTrain !== null) {
        sseTrain.disconnect()
        sseTrain = null
    }
}

export const initLogSSE = (context, streamKey) => {
    disconnectLoggingSSE()
    context.logDatas = []

    sseTrain = context.$sse.create({
        url: `${context.$mlURL}api/v1/stream/${streamKey}`,
        format: 'plain',
        // withCredentials: true,
        // polyfill: true,
    })
    sseTrain.on('run', context.handleMessage);
    sseTrain.on('success', context.handleSuccess);
    sseTrain.on('error', context.handleError);

    sseTrain.connect()
        .then(() => {
            console.log('run log connected!');
            context.showLoadingDialog = false

            // setTimeout(() => {
            //     sseTrain.off('run', context.handleMessage);
            //     console.log('Stopped listening to event-less messages!');
            // }, 2 * 1000);
        })
        .catch((err) => {
            context.showLoadingDialog = false
            console.error('Failed to connect run log', err);
        })
}