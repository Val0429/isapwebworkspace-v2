import { RegisterRouter as $ } from '@/../core';

// Home
$({ path: '/', name: 'Home', redirect: '/components' })();

// components
import Components from './components/index.vue';
import User from './components/User.vue';
import UserGroup from './components/UserGroup.vue';
import Person from './components/Person.vue';
import Stranger from './components/Stranger.vue';
import Site from './components/Site.vue';

// components
$({ path: '/components', name: 'Dashboard', icon: 'fa-sitemap' })(Components);
$({ path: '/users/user', name: 'User', icon: 'fa-user', permission: true })(User);
$({ path: '/users/userGroup', name: 'UserGroup', icon: 'fa-users', permission: true })(UserGroup);
$({ path: '/persons/person', name: 'Person', icon: 'fa-user', permission: true })(Person);
$({ path: '/persons/Stranger', name: 'Stranger', icon: 'fa-user-secret', permission: true })(Stranger);
$({ path: '/region/site', name: 'Site', icon: 'fa-gavel' })(Site);
