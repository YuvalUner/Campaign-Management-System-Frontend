import config from "../app-config.json";
import axios, {AxiosResponse} from "axios";

class ImageBbApiRequestMaker {


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
