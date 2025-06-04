import './style.css';
import { initializeHeader } from './scripts/logic/headerController';
import { initializeProfile } from './scripts/logic/profileController';
import './scripts/loadGeneralChat';
import { populateFollowingList, populateChatRoomList } from './scripts/logic/asideController';
import { checkIfTokenIsExpired } from './scripts/utils';

initializeHeader();
initializeProfile();
populateFollowingList();
populateChatRoomList();
checkIfTokenIsExpired();
