
declare namespace LicenseMacRead {
    export interface Input {
    }

    export interface Output {
        ifname: string;
        family: string;
        address: string;
        mac: string;
    }

}

export default LicenseMacRead;
