import './style.css';
import { initializeHeader } from './scripts/logic/headerController';
import { initializeProfile } from './scripts/logic/profileController';
import { loadGeneralChat } from './scripts/logic/chatController';
import { populateFollowingList, populateChatRoomList } from './scripts/logic/asideController';
import { checkIfTokenIsExpired } from './scripts/utils';

initializeHeader();
initializeProfile();
loadGeneralChat();
populateFollowingList();
populateChatRoomList();
checkIfTokenIsExpired();
