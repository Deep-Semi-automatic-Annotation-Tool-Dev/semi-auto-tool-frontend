import axios from "axios";

export const getDataList = (context, id, page) => {
    console.log(id)
    axios.get(`${context.$baseURL}api/v1/project/${id}/data?size=100&page=${page}`)
        .then(response => {
            context.lineData = response.data._embedded.dataResponseControllerDtoList;
            console.log(response.data._embedded);
        })
        .catch(error => {
            console.log('get data error', error);
        });
}