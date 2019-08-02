import { ETransitionType } from './ETransition';

class Transition {
    type: ETransitionType = ETransitionType.directionSlide;
}

export default new Transition();

export { ETransitionType } from './ETransition';
export { ITransition } from './ITransition';
