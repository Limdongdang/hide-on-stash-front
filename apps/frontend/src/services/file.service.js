import instance from '../interceptors/response.interceptor';
import axios from 'axios';

const URL_GET_PRESIGNEDURL = '/file/presigned-url';
const getPresignedUrl = (name) => {
    return instance.get(URL_GET_PRESIGNEDURL, {
        params: {
            name,
        },
    });
}

// 파일 리스트 조회
const URL_GET_FILES = '/file/get';
const getFiles = () => {
    return instance.get(URL_GET_FILES);
}

// 파일 정보 저장
const URL_SAVE_FILE_INFO = '/file/upload';
const saveFileInfo = (fileInfo) => {
    return instance.post(URL_SAVE_FILE_INFO, fileInfo);
}

// 파일 삭제
const URL_DELETE_FILE = '/file/remove';
const removeFile = (data) => {
    return instance.delete(URL_DELETE_FILE, {
        params: {
            name: data.originalname,
            id: data.id,
        },
    });
}

//minio 업로드
const uploadToMinio = (file, url) => {
    return axios.put(url, file, {
        headers: {
            'Content-Type': file.type,
        },
    });
}

const uploadFileAndSaveInfo = async (file) => {
    try {
        const response = await getPresignedUrl(file.name);
        await uploadToMinio(file, response.data);
        const filePath = `uploads/${file.name}`;
        const fileInfo = {
            originalname: file.name,
            mimetype: file.type,
            size: file.size,
            path: filePath,
        };
        await saveFileInfo(fileInfo);
        return { success: true, message: `${file.name} 업로드 및 정보 저장 완료` };
    } catch (error) {
        return { success: false, message: `파일 업로드 중 오류 발생: ${error.message}` };
    }
}

const getPresignedUrlGetObject = (name) => {
    return instance.get('/file/download', {
        params: {
            name,
        },
    });
}
 
export default {
    getPresignedUrl,
    getFiles,
    uploadFileAndSaveInfo,
    getPresignedUrlGetObject,
    removeFile,
};