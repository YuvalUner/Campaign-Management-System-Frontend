import axios from "axios";
import config from "../app-config.json";

/***
 * GenericRequestMaker is a class that contains all the methods to make requests to the server.
 * It is used to make the code more readable and to avoid code duplication, as well as to make it easier to
 * change the request method in the future, and to make sure that all requests are made in the same way and to the
 * same server.
 */
class GenericRequestMaker {

    public static async MakePostRequest(url: string, body: any): Promise<unknown> {
        return await axios.post(config.ServerBaseUrl + url, JSON.stringify(body), {
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    public static async MakeGetRequest<model>(url: string, headers: any): Promise<unknown> {
        return await axios.get<model>(process.env.REACT_APP_SERVER_BASE_URL + url, headers);
    }

    public static async MakePutRequest(url: string, body: JSON, headers: any): Promise<unknown> {
        return await axios.put(process.env.REACT_APP_SERVER_BASE_URL + url, body, headers);
    }

    public static async MakeDeleteRequest(url: string, headers: any): Promise<unknown> {
        return await axios.delete(process.env.REACT_APP_SERVER_BASE_URL + url, headers);
    }
}

export default GenericRequestMaker;
