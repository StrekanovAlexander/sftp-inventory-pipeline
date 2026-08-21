import SftpClient from 'ssh2-sftp-client';

export async function downloadFile(config, remoteFile, localFile) {
    const sftp = new SftpClient();

    try {
        await sftp.connect(config);
        await sftp.fastGet(remoteFile, localFile);
        await sftp.end();

        return true;
    } catch (error) {
        try {
            await sftp.end();
        } catch {}

        console.error('SFTP download error:', error.message);

        return false;
    }
}