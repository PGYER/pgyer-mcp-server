declare class PGYERAppUploader {
    constructor(apiKey: string);
    upload(options: { 
        filePath: string;
        log?: boolean;
        buildInstallType?: 1 | 2 | 3;
        buildPassword?: string;
        buildUpdateDescription?: string;
        buildInstallDate?: 1 | 2;
        buildInstallStartDate?: string;
        buildInstallEndDate?: string;
        buildChannelShortcut?: string;
    }): Promise<{
        code: number;
        message: string;
        data: {
            buildKey: string;
            buildType: string;
            buildIsFirst: string;
            buildIsLastest: string;
            buildFileKey: string;
            buildFileName: string;
            buildFileSize: string;
            buildName: string;
            buildVersion: string;
            buildVersionNo: string;
            buildBuildVersion: string;
            buildIdentifier: string;
            buildIcon: string;
            buildDescription: string;
            buildUpdateDescription: string;
            buildScreenshots: string;
            buildShortcutUrl: string;
            buildCreated: string;
            buildUpdated: string;
            buildQRCodeURL: string;
        };
    }>;
}

export default PGYERAppUploader; 