
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  and,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Repost {
  id: string;
  userId: string;
  username: string;
  trackId: string;
  originalUserId: string;
  originalUsername: string;
  createdAt: Timestamp;
}

export const repostTrack = async (userId: string, username: string, trackId: string, originalUserId: string, originalUsername: string) => {
  try {
    // Check if already reposted
    const existingRepostQuery = query(
      collection(db, 'reposts'),
      and(
        where('userId', '==', userId),
        where('trackId', '==', trackId)
      )
    );
    const existingReposts = await getDocs(existingRepostQuery);
    
    if (!existingReposts.empty) {
      throw new Error('Track already reposted');
    }

    const repost = {
      userId,
      username,
      trackId,
      originalUserId,
      originalUsername,
      createdAt: Timestamp.now()
    };

    await addDoc(collection(db, 'reposts'), repost);
  } catch (error) {
    console.error('Error reposting track:', error);
    throw error;
  }
};

export const removeRepost = async (userId: string, trackId: string) => {
  try {
    const q = query(
      collection(db, 'reposts'),
      and(
        where('userId', '==', userId),
        where('trackId', '==', trackId)
      )
    );
    const snapshot = await getDocs(q);
    
    snapshot.docs.forEach(async (docRef) => {
      await deleteDoc(doc(db, 'reposts', docRef.id));
    });
  } catch (error) {
    console.error('Error removing repost:', error);
    throw error;
  }
};

export const getUserReposts = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'reposts'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Repost[];
  } catch (error) {
    console.error('Error getting user reposts:', error);
    throw error;
  }
};
