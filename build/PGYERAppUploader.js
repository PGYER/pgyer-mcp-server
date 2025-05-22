/*
 * 此 Demo 用演示如何使用 PGYER API 上传 App
 * 详细文档参照 https://www.pgyer.com/doc/view/api#fastUploadApp
 * 适用于 nodejs 项目
 * 本代码需要 npm 包 form-data 支持 运行 npm install --save form-data 即可
 */

/*
 * 以下代码为示例代码，可以在生产环境中使用。使用方法如下:
 * 
 * 先实例化上传器
 * 
 * const uploader = new PGYERAppUploader(<your api key>);
 * 
 * 在上传器实例化以后, 通过调用 upload 方法即可完成 App 上传。
 * 
 * upload 方法有两种调用方式
 * 
 * 1. 回调方式调用
 * 
 *  uploader.upload(uploadOptions: Object, callbackFn(error: Error, result: Object): any): void
 * 
 *  示例: 
 *  const uploader = new PGYERAppUploader('apikey');
 *  uploader.upload({ filePath: './app.ipa' }, function (error, data) {
 *    // code here
 *  })
 * 
 * 2. 使用 promise 方式调用
 * 
 * uploader.upload(uploadOptions: Object): Promise
 * 
 * 示例: 
 * const uploader = new PGYERAppUploader('apikey');
 * uploader.upload({ filePath: './app.ipa' }).then(function (data) {
 *   // code here
 * }).catch(fucntion (error) {
 *   // code here
 * })
 * 
 * uploadOptions 参数说明: (https://www.pgyer.com/doc/view/api#fastUploadApp)
 * 
 * 对象成员名                是否必选    含义
 * filePath                Y          App 文件的路径，可以是相对路径
 * log                     N          Bool 类型，是否打印 log
 * buildInstallType        N          应用安装方式，值为(1,2,3，默认为1 公开安装)。1：公开安装，2：密码安装，3：邀请安装
 * buildPassword           N          设置App安装密码，密码为空时默认公开安装
 * buildUpdateDescription  N          版本更新描述，请传空字符串，或不传。
 * buildInstallDate        N          是否设置安装有效期，值为：1 设置有效时间， 2 长期有效，如果不填写不修改上一次的设置
 * buildInstallStartDate   N          安装有效期开始时间，字符串型，如：2018-01-01
 * buildInstallEndDate     N          安装有效期结束时间，字符串型，如：2018-12-31
 * buildChannelShortcut    N          所需更新的指定渠道的下载短链接，只可指定一个渠道，字符串型，如：abcd
 * 
 * 
 * 返回结果
 * 
 * 返回结果是一个对象, 主要返回 API 调用的结果, 示例如下:
 * 
 * {
 *   code: 0,
 *   message: '',
 *   data: {
 *     buildKey: 'xxx',
 *     buildType: '1',
 *     buildIsFirst: '0',
 *     buildIsLastest: '1',
 *     buildFileKey: 'xxx.ipa',
 *     buildFileName: '',
 *     buildFileSize: '40095060',
 *     buildName: 'xxx',
 *     buildVersion: '2.2.0',
 *     buildVersionNo: '1.0.1',
 *     buildBuildVersion: '9',
 *     buildIdentifier: 'xxx.xxx.xxx',
 *     buildIcon: 'xxx',
 *     buildDescription: '',
 *     buildUpdateDescription: '',
 *     buildScreenshots: '',
 *     buildShortcutUrl: 'xxxx',
 *     buildCreated: 'xxxx-xx-xx xx:xx:xx',
 *     buildUpdated: 'xxxx-xx-xx xx:xx:xx',
 *     buildQRCodeURL: 'https://www.pgyer.com/app/qrcodeHistory/xxxx'
 *   }
 * }
 * 
 */

import https from 'https';
import fs from 'fs';
import querystring from 'querystring';
import FormData from 'form-data';

export default class PGYERAppUploader {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.LOG_TAG = '[PGYER APP UPLOADER]';
    }

    async upload({ filePath, ...options }) {
        if (!filePath || typeof filePath !== 'string') {
            throw new Error('filePath must be a string');
        }

        // step 1: get app upload token
        const uploadTokenRequestData = querystring.stringify({
            ...options,
            _api_key: this.apiKey,
            buildType: filePath.split('.').pop()
        });

        const uploadData = await this.getUploadToken(uploadTokenRequestData);
        
        // step 2: upload app to bucket
        await this.uploadApp(uploadData, filePath);
        
        // step 3: get uploaded app data
        return await this.getUploadResult(uploadData);
    }

    getUploadToken(uploadTokenRequestData) {
        return new Promise((resolve, reject) => {
            const uploadTokenRequest = https.request({
                hostname: 'api.pgyer.com',
                path: '/apiv2/app/getCOSToken',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': uploadTokenRequestData.length
                }
            }, response => {
                if (response.statusCode !== 200) {
                    reject(new Error(this.LOG_TAG + 'Service down: cannot get upload token.'));
                    return;
                }

                let responseData = '';
                response.on('data', data => {
                    responseData += data.toString();
                });

                response.on('end', () => {
                    try {
                        const responseInfo = JSON.parse(responseData.toString());
                        if (responseInfo.code) {
                            reject(new Error(this.LOG_TAG + 'Service down: ' + responseInfo.code + ': ' + responseInfo.message));
                            return;
                        }
                        resolve(responseInfo);
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            uploadTokenRequest.write(uploadTokenRequestData);
            uploadTokenRequest.end();
        });
    }

    uploadApp(uploadData, filePath) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(filePath)) {
                reject(new Error(this.LOG_TAG + ' filePath: file not exist'));
                return;
            }

            const statResult = fs.statSync(filePath);
            if (!statResult || !statResult.isFile()) {
                reject(new Error(this.LOG_TAG + ' filePath: path not a file'));
                return;
            }

            const uploadAppRequestData = new FormData();
            uploadAppRequestData.append('signature', uploadData.data.params.signature);
            uploadAppRequestData.append('x-cos-security-token', uploadData.data.params['x-cos-security-token']);
            uploadAppRequestData.append('key', uploadData.data.params.key);
            uploadAppRequestData.append('x-cos-meta-file-name', filePath.replace(/^.*[\\\/]/, ''));
            uploadAppRequestData.append('file', fs.createReadStream(filePath));

            uploadAppRequestData.submit(uploadData.data.endpoint, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (response.statusCode === 204) {
                    resolve();
                } else {
                    reject(new Error(this.LOG_TAG + ' Upload Error!'));
                }
            });
        });
    }

    getUploadResult(uploadData) {
        return new Promise((resolve, reject) => {
            const uploadResultRequest = https.request({
                hostname: 'api.pgyer.com',
                path: '/apiv2/app/buildInfo?_api_key=' + this.apiKey + '&buildKey=' + uploadData.data.key,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': 0
                }
            }, response => {
                if (response.statusCode !== 200) {
                    reject(new Error(this.LOG_TAG + ' Service is down.'));
                    return;
                }

                let responseData = '';
                response.on('data', data => {
                    responseData += data.toString();
                });

                response.on('end', () => {
                    try {
                        const responseInfo = JSON.parse(responseData.toString());
                        if (responseInfo.code === 1247) {
                            setTimeout(() => {
                                this.getUploadResult(uploadData).then(resolve).catch(reject);
                            }, 1000);
                            return;
                        } else if (responseInfo.code) {
                            reject(new Error(this.LOG_TAG + 'Service down: ' + responseInfo.code + ': ' + responseInfo.message));
                            return;
                        }
                        resolve(responseInfo);
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            uploadResultRequest.end();
        });
    }
}