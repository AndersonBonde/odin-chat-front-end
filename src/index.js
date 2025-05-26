import './style.css';
import './scripts/loadHeaderButtons';
import './scripts/loadUsernameOnHeader';
import './scripts/loadGeneralChat';
import './scripts/profile';
import './scripts/populateFollowList';
import './scripts/populateRoomList';
import { checkIfTokenIsExpired } from './scripts/utils';

if (checkIfTokenIsExpired()) localStorage.clear();
