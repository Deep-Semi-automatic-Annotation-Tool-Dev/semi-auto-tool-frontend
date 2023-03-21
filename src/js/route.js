import router from "@/plugins/routers";

const gotoPage = (targetUrl, query) => {
    var pushParam = {name: targetUrl};
    if (typeof query != 'undefined') {
        pushParam['query'] = query;
    }
    console.log(pushParam)
    router.push(pushParam);
}

export {gotoPage}