import { IActivity } from "./../models/activity";
import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = "http://localhost:5000/api";

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) => 
  new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms)); // use of process of currying a function

const requests = {
  get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody), // delay the response from 1 second
  post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody), // delay the response from 1 second
  put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody), // delay the response from 1 second
  del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody), // delay the response from 1 second
};

const Activities = {
  list: (): Promise<IActivity[]> => requests.get("/activities"),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post("/activities", activity),
  update: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del(`/activities/${id}`),
};

export default {
  Activities,
};
