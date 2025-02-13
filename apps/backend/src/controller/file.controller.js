import fileService from '../service/file.service.js';

export const uploadFile = async (req, res) => {
    try {
        await fileService.uploadFile(req.body);
        res.status(200).send('파일 업로드 성공');
    }
    catch (error) {
        res.status(500).send(error.message);
    }
};

export const getFiles = async (req, res) => {
    try {
        const result = await fileService.getFiles();
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}