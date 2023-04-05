import axios from "axios";

export const getTagGroupList = (context, id) => {
    axios.get(`${context.$baseURL}api/v1/tagGroup?size=100`)
        .then(response => {
            context.lineData = response.data._embedded.dataResponseControllerDtoList;
            console.log(response.data._embedded);
        })
        .catch(error => {
            console.log('get data error', error);
        });
}