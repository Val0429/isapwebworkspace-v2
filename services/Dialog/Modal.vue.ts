import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { BehaviorSubject } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { ICard } from '../../../../isapwebframework-v2_bar/components/cards/card/card.vue';

@Component({
    components: { VuePerfectScrollbar },
})
export class DialogModal extends Vue {
    @Prop({ type: Boolean, required: false })
    visible: boolean;

    @Prop({ type: String })
    label: string;

    @Prop({ type: String })
    content: string;

    @Prop({
        type: Object as () => ICard,
        required: false,
        default: () => ({
            'border-variant': 'light',
            'header-bg-variant': 'light',
            'footer-bg-variant': 'light',
            'hide-collapse-button': true,
        }),
    })
    data!: ICard;

    @Emit('update:visible')
    doUpdateVisible(value: boolean) {
        return value;
    }

    private sjRefs: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    /// private helpers //////////////////////////////
    @Watch('visible', { immediate: true })
    private async onVisibleChanged(newval: boolean, oldval: boolean) {
        if (!newval) return;
        let refs = await this.sjRefs
            .pipe(filter((v) => v))
            .pipe(first())
            .toPromise();
        let max = this.findHighestZIndex('*');
        refs.mask.style.zIndex = max > 10000 ? max + 1 : max + 10000;
    }

    private findHighestZIndex(elem) {
        var elems = document.getElementsByTagName(elem);
        var highest = 0;
        for (var i = 0; i < elems.length; i++) {
            var zindex = document.defaultView.getComputedStyle(elems[i], null).getPropertyValue('z-index');
            if (zindex != 'auto' && +zindex > highest) {
                highest = +zindex;
            }
        }
        return highest;
    }
    //////////////////////////////////////////////////
}
export default DialogModal;
