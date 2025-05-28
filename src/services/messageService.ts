
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  and,
  or,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Message {
  id: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  toUsername: string;
  content: string;
  createdAt: Timestamp;
  read: boolean;
}

export const sendMessage = async (
  fromUserId: string, 
  fromUsername: string, 
  toUserId: string, 
  toUsername: string, 
  content: string
) => {
  try {
    const message = {
      fromUserId,
      fromUsername,
      toUserId,
      toUsername,
      content: content.trim(),
      createdAt: Timestamp.now(),
      read: false
    };

    await addDoc(collection(db, 'messages'), message);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getConversation = async (userId1: string, userId2: string) => {
  try {
    const q = query(
      collection(db, 'messages'),
      or(
        and(where('fromUserId', '==', userId1), where('toUserId', '==', userId2)),
        and(where('fromUserId', '==', userId2), where('toUserId', '==', userId1))
      ),
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
  } catch (error) {
    console.error('Error getting conversation:', error);
    throw error;
  }
};

export const getConversations = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'messages'),
      or(
        where('fromUserId', '==', userId),
        where('toUserId', '==', userId)
      ),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    
    const conversations = new Map();
    
    snapshot.docs.forEach(doc => {
      const message = doc.data() as Message;
      const otherUserId = message.fromUserId === userId ? message.toUserId : message.fromUserId;
      const otherUsername = message.fromUserId === userId ? message.toUsername : message.fromUsername;
      
      if (!conversations.has(otherUserId)) {
        conversations.set(otherUserId, {
          userId: otherUserId,
          username: otherUsername,
          lastMessage: message.content,
          lastMessageTime: message.createdAt,
          unread: !message.read && message.toUserId === userId
        });
      }
    });
    
    return Array.from(conversations.values());
  } catch (error) {
    console.error('Error getting conversations:', error);
    throw error;
  }
};
