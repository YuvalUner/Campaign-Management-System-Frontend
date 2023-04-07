import config from "../app-config.json";
import axios, {AxiosResponse} from "axios";

/**
 * ImageBbApiRequestMaker is a class that makes requests to the imagebb api.
 * It is used to make the code more readable and to avoid code duplication, as well as to make it easier to
 * change the request method in the future, and to make sure that all requests are made in the same way and to the
 * same server.
 * Use this class for all the cases where image uploading is needed.
 * See https://api.imgbb.com/ for more information.
 */
class ImageBbApiRequestMaker {


    /**
     * uploadImage is a method that makes a post request to the imagebb api.
     * @param imageFile - the image file to upload.
     * @returns a promise of the response.
     */
    public static async uploadImage(imageFile: File): Promise<AxiosResponse> {
        const formData = new FormData();
        formData.append("image", imageFile);

        return axios({
            method: "POST",
            url: `${config.ImgBbConfig.UploadUrl}${config.ImgBbConfig.ApiKey}`,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            data: formData,
        });
    }
}

export default ImageBbApiRequestMaker;
