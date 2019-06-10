declare namespace LicenseCreate {
    export interface Input {
        key?: string;
        mac?: string;
        data?: string;
    }

    export type Output = string;

}

export default LicenseCreate;

