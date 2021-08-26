const download = require('download-git-repo');
const logger = require('./logger');

module.exports = function (url, dir) {
    return new Promise((res, rej) => {
        download(url, dir, function (err) {
            if (!err) {
                res('ok')
                logger.success('模板下载成功');
            } else {
                rej(err)
                logger.error('模板下载失败');
                logger.error(err);
                process.exit(1);
            }
        })
    })
}