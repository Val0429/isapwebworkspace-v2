import { RegisterRouter as $ } from '@/../core';

// Home
$({ path: '/', name: 'Home', redirect: '/dashboard' })();

// components
import Components from './components/index.vue';
import User from './components/User.vue';
import UserGroup from './components/UserGroup.vue';
import Person from './components/Person.vue';
import Stranger from './components/Stranger.vue';
import Site from './components/Site.vue';

// components
$({ path: '/dashboard', name: "_('m_Dashboard')", icon: 'fa-sitemap' })(Components);

$({ path: '/persons', name: "_('m_Navagation_Persons')" })();
$({ path: '/persons/person', name: "_('m_Navagation_Persons_Person')", icon: 'fa-user', permission: true })(Person);
$({ path: '/persons/Stranger', name: "_('m_Navagation_Persons_Stranger')", icon: 'fa-user-secret', permission: true })(Stranger);

$({ path: '/users', name: "_('m_Navagation_Users')" })();
$({ path: '/users/user', name: "_('m_Navagation_Users_Users')", icon: 'fa-user', permission: true })(User);
$({ path: '/users/userGroup', name: "_('m_Navagation_Users_Groups')", icon: 'fa-users', permission: true })(UserGroup);

$({ path: '/region', name: "_('m_Navagation_Region')" })();
$({ path: '/region/site', name: "_('m_Navagation_Region_Site')", icon: 'fa-gavel' })(Site);
