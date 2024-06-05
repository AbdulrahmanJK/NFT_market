import { CometChat } from '@cometchat-pro/chat';
import { getGlobalState, setGlobalState } from '../store';
import { toast } from 'react-toastify';

export const CONSTANTS = {
  APP_ID: '258650a1f23f7ecf',
  REGION: 'eu',
  Auth_Key: '2a1391f5ca6e29933c5a9f906b61c4f4dd617108',
};

const showErrorToast = (identifier, error) => {
  toast.error(`Error in ${identifier}: ${error.message || error}`);
};

const initCometChat = async () => {
  const appID = CONSTANTS.APP_ID;
  const region = CONSTANTS.REGION;

  const appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build();

  await CometChat.init(appID, appSetting)
    .then(() => console.log('Initialization completed successfully'))
    .catch((error) => showErrorToast('initCometChat', error));
};

const loginWithCometChat = async () => {
  const authKey = CONSTANTS.Auth_Key;
  const UID = getGlobalState('connectedAccount');

  return new Promise(async (resolve) => {
    await CometChat.login(UID, authKey)
      .then((user) => resolve(user))
      .catch((error) => showErrorToast('loginWithCometChat', error));
  });
};

const signUpWithCometChat = async () => {
  const authKey = CONSTANTS.Auth_Key;
  const UID = getGlobalState('connectedAccount');
  const user = new CometChat.User(UID);

  user.setName(UID);
  return new Promise(async (resolve) => {
    await CometChat.createUser(user, authKey)
      .then((user) => resolve(user))
      .catch((error) => showErrorToast('signUpWithCometChat', error));
  });
};

const logOutWithCometChat = async () => {
  return CometChat.logout()
    .then(() => setGlobalState('currentUser', null))
    .catch((error) => showErrorToast('logOutWithCometChat', error));
};

const checkAuthState = async () => {
  return new Promise(async (resolve) => {
    await CometChat.getLoggedinUser()
      .then((user) => resolve(user))
      .catch((error) => showErrorToast('checkAuthState', error));
  });
};

const createNewGroup = async (GUID, groupName) => {
  const groupType = CometChat.GROUP_TYPE.PUBLIC;
  const password = '';
  const group = new CometChat.Group(GUID, groupName, groupType, password);

  return new Promise(async (resolve) => {
    await CometChat.createGroup(group)
      .then((group) => resolve(group))
      .catch((error) => showErrorToast('createNewGroup', error));
  });
};

const getGroup = async (GUID) => {
  return new Promise(async (resolve) => {
    await CometChat.getGroup(GUID)
      .then((group) => resolve(group))
      .catch((error) => showErrorToast('getGroup', error));
  });
};

const joinGroup = async (GUID) => {
  const groupType = CometChat.GROUP_TYPE.PUBLIC;
  const password = '';

  return new Promise(async (resolve) => {
    await CometChat.joinGroup(GUID, groupType, password)
      .then((group) => resolve(group))
      .catch((error) => showErrorToast('joinGroup', error));
  });
};

const getMessages = async (UID) => {
  const limit = 30;
  const messagesRequest = new CometChat.MessagesRequestBuilder().setGUID(UID).setLimit(limit).build();

  return new Promise(async (resolve) => {
    await messagesRequest
      .fetchPrevious()
      .then((messages) => resolve(messages.filter((msg) => msg.type == 'text')))
      .catch((error) => showErrorToast('getMessages', error));
  });
};

const sendMessage = async (receiverID, messageText) => {
  const receiverType = CometChat.RECEIVER_TYPE.GROUP;
  const textMessage = new CometChat.TextMessage(receiverID, messageText, receiverType);
  return new Promise(async (resolve) => {
    await CometChat.sendMessage(textMessage)
      .then((message) => resolve(message))
      .catch((error) => showErrorToast('sendMessage', error));
  });
};

const listenForMessage = async (listenerID) => {
  return new Promise(async (resolve) => {
    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: (message) => resolve(message),
      })
    ).catch((error) => showErrorToast('listenForMessage', error));
  });
};

export {
  initCometChat,
  loginWithCometChat,
  signUpWithCometChat,
  logOutWithCometChat,
  getMessages,
  sendMessage,
  checkAuthState,
  createNewGroup,
  getGroup,
  joinGroup,
  listenForMessage,
};
