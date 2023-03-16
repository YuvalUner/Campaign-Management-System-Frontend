import axios, {AxiosResponse} from "axios";
import config from "../app-config.json";

/***
 * GenericRequestMaker is a class that contains all the methods to make requests to the server.
 * It is used to make the code more readable and to avoid code duplication, as well as to make it easier to
 * change the request method in the future, and to make sure that all requests are made in the same way and to the
 * same server.
 */
class GenericRequestMaker {

    /**
     * MakePostRequest is a method that makes a post request to the server.
     * @param url - url of the specific method in the server.
     * @param body - the body of the request. A JSON object (pass it as the object itself, not as a string).
     * @param additionalHeaders - additional headers to add to the request. A JSON string.
     */
    public static async MakePostRequest(url: string, body: unknown,
        additionalHeaders: string | null = null): Promise<AxiosResponse> {
        return await axios.post(config.ServerBaseUrl + url, JSON.stringify(body), {
            headers: {
                "Content-Type": "application/json",
                additionalHeaders
            }
        });
    }

    /**
     * MakeGetRequest is a method that makes a get request to the server. It returns a promise of the response.
     * Also handles the converting of the response to the model.
     * @param url - url of the specific method in the server.
     * @param additionalHeaders - additional headers to add to the request. A JSON string.
     */
    public static async MakeGetRequest<model>(url: string,
        additionalHeaders: string | null = null): Promise<AxiosResponse> {
        return await axios.get<model>(process.env.REACT_APP_SERVER_BASE_URL + url, {
            headers: {
                additionalHeaders
            }
        });
    }

    /**
     * MakePutRequest is a method that makes a put request to the server.
     * @param url - url of the specific method in the server.
     * @param body - the body of the request. A JSON object (pass it as the object itself, not as a string).
     * @param additionalHeaders - additional headers to add to the request. A JSON string.
     */
    public static async MakePutRequest(url: string, body: unknown,
        additionalHeaders: string | null = null): Promise<AxiosResponse> {
        return await axios.put(process.env.REACT_APP_SERVER_BASE_URL + url, body, {
            headers: {
                "Content-Type": "application/json",
                additionalHeaders
            }
        });
    }

    /**
     * MakeDeleteRequest is a method that makes a delete request to the server.
     * @param url - url of the specific method in the server.
     * @param additionalHeaders - additional headers to add to the request. A JSON string.
     */
    public static async MakeDeleteRequest(url: string,
        additionalHeaders: string | null = null): Promise<AxiosResponse> {
        return await axios.delete(process.env.REACT_APP_SERVER_BASE_URL + url, {
            headers: {
                "Content-Type": "application/json",
                additionalHeaders
            }
        });
    }
}

export default GenericRequestMaker;
