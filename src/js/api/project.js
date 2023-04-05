import axios from "axios";

export const getProjectList = (context) => {
    axios.get(`${context.$baseURL}api/v1/project?size=100`)
        .then(response => {
            context.projectList = response.data._embedded.projectResponseControllerDtoList;
            // console.log(projectList);
        })
        .catch(error => {
            console.log('get project error', error);
        });
}

export const createProject = (context, title) => {
    // console.log(title.length)
    axios.post(`${context.$baseURL}api/v1/project`, {
        project_name: title
    })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
            getProjectList(context)
        })
        .catch(error => {
            console.log('post project error', error);
        });
}

export const renameProject = (context, title, id) => {
    // console.log(title.length)
    axios.put(`${context.$baseURL}api/v1/project/${id}`, {
        project_name: title
    })
        // eslint-disable-next-line no-unused-vars
        .then(response => {
            getProjectList(context)
        })
        .catch(error => {
            console.log('put project error', error);
        });
}

export const deleteProject = (context, id) => {
    axios.delete(`${context.$baseURL}api/v1/project/${id}`)
        // eslint-disable-next-line no-unused-vars
        .then(response => {
            getProjectList(context)
        })
        .catch(error => {
            console.log('delete project error', error);
        });
}
