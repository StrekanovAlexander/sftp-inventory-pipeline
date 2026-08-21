export const sourceConfig = {
    host: process.env.SOURCE_SFTP_HOST,
    port: Number(process.env.SOURCE_SFTP_PORT),
    username: process.env.SOURCE_SFTP_USERNAME,
    password: process.env.SOURCE_SFTP_PASSWORD
};
