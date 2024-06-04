export const limitStringByteLength = (str, limit) => {
    let bytes = 0;
    let i = str.length;
    for (; i > 0; i--) {
        const charBytes = Buffer.byteLength(str[i - 1], 'utf8');
        if (bytes + charBytes > limit) break;
        bytes += charBytes;
    };
    return str.substring(i);
};