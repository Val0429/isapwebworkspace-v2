import jsSHA from 'jssha';

class Encrypt {
    sha256Timestamp(): string {
        let result = '';
        let shaObject = new jsSHA('SHA-256', 'TEXT');
        shaObject.update(new Date().getTime().toString());
        result = shaObject.getHash('HEX');
        return result;
    }
}

export default new Encrypt();
