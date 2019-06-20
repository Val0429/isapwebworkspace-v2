declare namespace UserPasswordUpdate {
    export interface Input {
        objectId: string;
        previous: string;
        current: string;
    }
    export interface Output {
        data: string;
    }
}

export default UserPasswordUpdate;
