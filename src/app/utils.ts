type WebSocketUser = {
  username: string;
  image_url: string;
};

type WebSocketMessage = {
  id: string;
  user: WebSocketUser;
  message: string;
  timestamp: number;
};

export const isWebSocketMessage = (data: unknown): data is WebSocketMessage => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'user' in data &&
    'message' in data &&
    'timestamp' in data &&
    typeof data.id === 'string' &&
    typeof data.message === 'string' &&
    typeof data.timestamp === 'number' &&
    typeof data.user === 'object' &&
    data.user !== null &&
    'username' in data.user &&
    'image_url' in data.user &&
    typeof data.user.username === 'string' &&
    typeof data.user.image_url === 'string'
  );
};

export type MessageType = {
  id: string;
  username: string;
  message: string;
  timestamp: number;
  profilePicture: string;
};

export const getConnectionStatus = (readyState?: number) => {
  switch (readyState) {
    case WebSocket.OPEN:
      return 'Connected';
    case WebSocket.CONNECTING:
      return 'Connecting...';
    case WebSocket.CLOSING:
      return 'Disconnecting';
    case WebSocket.CLOSED:
      return 'Disconnected';
    default:
      return 'Unknown';
  }
};

export type StatusState = {
  status: ConnectionStatus;
  showModal: boolean;
};
export const initialStatus: StatusState = {
  status: 'Connecting...',
  showModal: true,
};

export const statusReducer = (state: typeof initialStatus, action: { type: ConnectionStatus | 'close modal' }) => {
  switch (action.type) {
    case 'Connected':
      return { status: action.type, showModal: false };
    case 'Connecting...':
      return { status: action.type, showModal: true };
    case 'Disconnected':
      return { status: action.type, showModal: true };
    case 'Disconnecting':
      return { status: action.type, showModal: true };
    case 'close modal':
      return { ...state, showModal: false };
    default:
      return state;
  }
};

export type ConnectionStatus = 'Connected' | 'Connecting...' | 'Disconnected' | 'Disconnecting' | 'Unknown';
export const MAX_RECONNECT_ATTEMPTS = 5;
export const INITIAL_RECONNECT_DELAY = 1000;

export function preloadImage(url: string) {
  new Image().src = url;
}
