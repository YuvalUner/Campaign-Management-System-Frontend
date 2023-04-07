import axios, {AxiosInstance, AxiosResponse} from "axios";
import config from "../app-config.json";

/***
 * ServerRequestMaker is a class that contains all the methods to make requests to the server.
 * It is used to make the code more readable and to avoid code duplication, as well as to make it easier to
 * change the request method in the future, and to make sure that all requests are made in the same way and to the
 * same server.
 */
class ServerRequestMaker {

    private static readonly instance: AxiosInstance = axios.create({
        withCredentials: true,
    });

    /**
     * MakePostRequest is a method that makes a post request to the server.
     * @param url - url of the specific method in the server.
     * @param body - the body of the request. A JSON object (pass it as the object itself, not as a string).
     * @param additionalHeaders - additional headers to add to the request. A JSON string.
     */
    public static async MakePostRequest(url: string, body: unknown,
        additionalHeaders: string | null = null): Promise<AxiosResponse> {
        return await this.instance.post(config.ServerBaseUrl + url, JSON.stringify(body), {
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
        return await this.instance.get<model>(config.ServerBaseUrl + url, {
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
        return await this.instance.put(config.ServerBaseUrl + url, body, {
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
        return await this.instance.delete(config.ServerBaseUrl + url, {
            headers: {
                "Content-Type": "application/json",
                additionalHeaders
            }
        });
    }
}

export default ServerRequestMaker;
