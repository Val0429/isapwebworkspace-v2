class Utility {

    /**
     * String pad left some char
     * @param str
     * @param char
     * @param length
     */
    PadLeft(str: string, char: string, length: number): string {
        while (str.length < length) {
            str = `${char}${str}`;
        }
        return str;
    }

    /**
     * Convert string array to RegExp
     * @param array
     */
    Array2RegExp(...array: string[][]): RegExp {
        let strs: string[] = [];
        strs = strs.concat(...array);

        let regex: string = '';
        for (let str of strs) {
            regex += `${str}|`;
        }
        regex = regex.replace(/\|$/, '');

        return new RegExp(regex, 'g');
    }

    /**
     * Random color generator
     */
    RandomColor(): string {
        let letters: string = '0123456789ABCDEF';

        let color: string = '#';
        for (let i: number = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;
    }
}

export default new Utility();

