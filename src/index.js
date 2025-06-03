import './style.css';
import { initializeHeader } from './scripts/logic/headerController';
import { initializeProfile } from './scripts/logic/profileController';
import './scripts/loadGeneralChat';
import './scripts/populateFollowList';
import './scripts/populateRoomList';
import { checkIfTokenIsExpired } from './scripts/utils';

initializeHeader();
initializeProfile();

if (checkIfTokenIsExpired()) localStorage.clear();
