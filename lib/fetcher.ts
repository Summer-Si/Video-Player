import axios from "axios";

//defined fether accpets a url which is a type of string. all it does is it trigger 
//axios to get url, and on success, it gets the response and return the res.data
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default fetcher;