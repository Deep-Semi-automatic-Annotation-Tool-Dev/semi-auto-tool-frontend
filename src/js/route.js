import router from "@/plugins/routers";

const gotoPage = (targetUrl, query) => {
    let pushParam = {name: targetUrl};
    if (typeof query != 'undefined') {
        pushParam['query'] = query;
    }
    console.log(pushParam)
    router.push(pushParam);
}

const gotoExternalPage = (targetUrl) => {
    window.open(
        targetUrl,
        '_blank'
    )
    // window.location.href = targetUrl
}

export {gotoPage, gotoExternalPage}