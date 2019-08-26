export class ImageBase64 {
    constructor() {}
    fileLimit = 7500000;

    async urlToBase64(vue: any, url: string, callback: Function) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
                callback(vue, reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    async fileToBase64(file: any, callback: Function) {
        if (file && file.size && file.size < this.fileLimit) {
            await this.getBase64(file)
                .then((data: any) => {
                    let newImg = new Image();
                    newImg.src = data.result;
                    newImg.onload = () => {
                        callback(data.result);
                    };
                })
                .catch((e: any) => {
                    console.log('getBase64 error', e.message);
                    callback('');
                });
        }
    }

    getBase64(file: any): any {
        var img = new Image();
        if (FileReader) {
            return new Promise((resolve) => {
                var reader = new FileReader();
                if (file) {
                    reader.readAsDataURL(file);
                } else {
                    console.log('file not exist', file);
                }
                reader.onload = function() {
                    resolve(reader);
                };
            });
        }
    }

    get pngEmpty(): string {
        return this._pngEmpty;
    }
    private _pngEmpty: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
}

export default new ImageBase64();
