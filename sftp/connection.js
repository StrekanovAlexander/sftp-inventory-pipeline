import SftpClient from 'ssh2-sftp-client';

export async function checkSftpConnection(config) {
    const sftp = new SftpClient();

    try {
        await sftp.connect(config);
        await sftp.end();

        return true;
    } catch {
        try {
            await sftp.end();
        } catch {}

        return false;
    }
}