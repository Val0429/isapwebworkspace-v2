<template>
    <iv-route-transition>
        <div key="main">
        <p><iv-language-button /></p>

            <h1>Scrollbar</h1>

            <iv-card style="width: 50vw" label="Scrollbar in Card">
                <iv-scrollbar style="height: 20vh">
    William Shakespeare was born on April 23, 1564, in Stratford-upon-Avon. The son of John Shakespeare and Mary Arden, he was probably educated at the King Edward VI Grammar School in Stratford, where he learned Latin and a little Greek and read the Roman dramatists. At eighteen, he married Anne Hathaway, a woman seven or eight years his senior. Together they raised two daughters: Susanna, who was born in 1583, and Judith (whose twin brother died in boyhood), born in 1585.

    Little is known about Shakespeare's activities between 1585 and 1592. Robert Greene's A Groatsworth of Wit alludes to him as an actor and playwright. Shakespeare may have taught at school during this period, but it seems more probable that shortly after 1585 he went to London to begin his apprenticeship as an actor. Due to the plague, the London theaters were often closed between June 1592 and April 1594. During that period, Shakespeare probably had some income from his patron, Henry Wriothesley, earl of Southampton, to whom he dedicated his first two poems, Venus and Adonis (1593) and The Rape of Lucrece (1594). The former was a long narrative poem depicting the rejection of Venus by Adonis, his death, and the consequent disappearance of beauty from the world. Despite conservative objections to the poem's glorification of sensuality, it was immensely popular and was reprinted six times during the nine years following its publication.

    In 1594, Shakespeare joined the Lord Chamberlain's company of actors, the most popular of the companies acting at Court. In 1599 Shakespeare joined a group of Chamberlain's Men that would form a syndicate to build and operate a new playhouse: the Globe, which became the most famous theater of its time. With his share of the income from the Globe, Shakespeare was able to purchase New Place, his home in Stratford.

    While Shakespeare was regarded as the foremost dramatist of his time, evidence indicates that both he and his contemporaries looked to poetry, not playwriting, for enduring fame. Shakespeare's sonnets were composed between 1593 and 1601, though not published until 1609. That edition, The Sonnets of Shakespeare, consists of 154 sonnets, all written in the form of three quatrains and a couplet that is now recognized as Shakespearean. The sonnets fall into two groups: sonnets 1-126, addressed to a beloved friend, a handsome and noble young man, and sonnets 127-152, to a malignant but fascinating "Dark Lady," who the poet loves in spite of himself. Nearly all of Shakespeare's sonnets examine the inevitable decay of time, and the immortalization of beauty and love in poetry.

    In his poems and plays, Shakespeare invented thousands of words, often combining or contorting Latin, French, and native roots. His impressive expansion of the English language, according to the Oxford English Dictionary, includes such words as: arch-villain, birthplace, bloodsucking, courtship, dewdrop, downstairs, fanged, heartsore, hunchbacked, leapfrog, misquote, pageantry, radiance, schoolboy, stillborn, watchdog, and zany.

    Shakespeare wrote more than thirty plays. These are usually divided into four categories: histories, comedies, tragedies, and romances. His earliest plays were primarily comedies and histories such as Henry VI and The Comedy of Errors, but in 1596, Shakespeare wrote Romeo and Juliet, his second tragedy, and over the next dozen years he would return to the form, writing the plays for which he is now best known: Julius Caesar, Hamlet, Othello, King Lear, Macbeth, and Antony and Cleopatra. In his final years, Shakespeare turned to the romantic with Cymbeline, A Winter's Tale, and The Tempest.

    Only eighteen of Shakespeare's plays were published separately in quarto editions during his lifetime; a complete collection of his works did not appear until the publication of the First Folio in 1623, several years after his death. Nonetheless, his contemporaries recognized Shakespeare's achievements. Francis Meres cited "honey-tongued" Shakespeare for his plays and poems in 1598, and the Chamberlain's Men rose to become the leading dramatic company in London, installed as members of the royal household in 1603.

    Sometime after 1612, Shakespeare retired from the stage and returned to his home in Stratford. He drew up his will in January of 1616, which included his famous bequest to his wife of his "second best bed." He died on April 23, 1616, and was buried two days later at Stratford Church.                    
                </iv-scrollbar>
            </iv-card>

            <h1>Permission</h1>
            <!-- <pre>
                &lt;iv-permission url="/announcements"&gt;
                    Only show content if permitted.
                &lt;/iv-permission&gt;
            </pre> -->
            <iv-card
                label="Role permitted content"
                >
                <iv-permission allow="Administrator">
                    Only 'Administrator' can see this.
                    <template #else>
                        You are not 'Administrator'.
                    </template>
                </iv-permission>

                <iv-permission allow="Visitor">
                    Only 'Visitor' can see this.
                    <template #else>
                        You are not 'Visitor'.
                    </template>
                </iv-permission>

                <iv-permission :allow="['Administrator', 'User']">
                    Both 'Administrator' and 'User' can see this.
                    <template #else>
                        You are not 'Administrator' or 'User'.
                    </template>
                </iv-permission>

                <iv-permission deny="Administrator">
                    You can see this only if you are not 'Administrator'.
                    <template #else>
                        You are 'Administrator'.
                    </template>
                </iv-permission>
            </iv-card>

            <iv-card
                label="Url permitted content"
                >
                <iv-permission url="/announcements">
                    You have '/announcements' permission.
                    <template #else>
                        You don't have '/announcements' permission.
                    </template>
                </iv-permission>
            </iv-card>

        </div>
    </iv-route-transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { RegisterRouter } from '@/../core/router';
import { toEnumInterface } from '@/../core';

@Component
export default class Utilities extends Vue {
    private isMounted: boolean = false;
    private doMounted() {
        this.isMounted = true;
    }
}
</script>
