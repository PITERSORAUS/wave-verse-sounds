import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  or,
  and,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  toUsername: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Timestamp;
}

export interface Friendship {
  id: string;
  user1Id: string;
  user1Username: string;
  user2Id: string;
  user2Username: string;
  createdAt: Timestamp;
}

export const sendFriendRequest = async (fromUserId: string, fromUsername: string, toUserId: string, toUsername: string) => {
  try {
    // Check if request already exists
    const existingRequestQuery = query(
      collection(db, 'friendRequests'),
      or(
        and(
          where('fromUserId', '==', fromUserId),
          where('toUserId', '==', toUserId)
        ),
        and(
          where('fromUserId', '==', toUserId),
          where('toUserId', '==', fromUserId)
        )
      )
    );
    const existingRequests = await getDocs(existingRequestQuery);
    
    if (!existingRequests.empty) {
      throw new Error('Friend request already exists');
    }

    // Check if they are already friends
    const existingFriendshipQuery = query(
      collection(db, 'friendships'),
      or(
        and(
          where('user1Id', '==', fromUserId),
          where('user2Id', '==', toUserId)
        ),
        and(
          where('user1Id', '==', toUserId),
          where('user2Id', '==', fromUserId)
        )
      )
    );
    const existingFriendships = await getDocs(existingFriendshipQuery);

    if (!existingFriendships.empty) {
      throw new Error('Users are already friends');
    }

    const request = {
      fromUserId,
      fromUsername,
      toUserId,
      toUsername,
      status: 'pending' as const,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'friendRequests'), request);
    
    // Create notification for recipient
    await addDoc(collection(db, 'notifications'), {
      userId: toUserId,
      type: 'friendRequest',
      fromUserId,
      fromUsername,
      read: false,
      createdAt: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

export const acceptFriendRequest = async (requestId: string) => {
  try {
    const requestRef = doc(db, 'friendRequests', requestId);
    const requestDoc = await getDocs(query(collection(db, 'friendRequests'), where('__name__', '==', requestId)));
    
    if (!requestDoc.empty) {
      const request = requestDoc.docs[0].data() as FriendRequest;
      
      // Update request status
      await updateDoc(requestRef, { status: 'accepted' });

      // Create friendship
      const friendship = {
        user1Id: request.fromUserId,
        user1Username: request.fromUsername,
        user2Id: request.toUserId,
        user2Username: request.toUsername,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'friendships'), friendship);

      // Create notification for sender
      await addDoc(collection(db, 'notifications'), {
        userId: request.fromUserId,
        type: 'friendRequestAccepted',
        fromUserId: request.toUserId,
        fromUsername: request.toUsername,
        read: false,
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
};

export const getFriendRequests = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'friendRequests'),
      where('toUserId', '==', userId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FriendRequest[];
  } catch (error) {
    console.error('Error getting friend requests:', error);
    throw error;
  }
};

export const getFriends = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'friendships'),
      or(
        where('user1Id', '==', userId),
        where('user2Id', '==', userId)
      ),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const friendship = doc.data() as Friendship;
      const friend = friendship.user1Id === userId 
        ? { id: friendship.user2Id, username: friendship.user2Username }
        : { id: friendship.user1Id, username: friendship.user1Username };
      
      return { ...friend, friendshipId: doc.id };
    });
  } catch (error) {
    console.error('Error getting friends:', error);
    throw error;
  }
};