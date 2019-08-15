import { ETransitionType } from './ETransition';

interface ITransition {
    type: ETransitionType;
    prevStep: number;
    step: number;
}

export { ITransition };
