import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  description?: string;
  isPublic: boolean;
  audioUrl: string;
  coverUrl?: string;
  userId: string;
  username: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  plays: number;
  likes: number;
  comments: number;
  likedBy: string[];
  uniqueId: string;
}

export interface Comment {
  id: string;
  trackId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Timestamp;
  lastActivity: Timestamp;
}

export const uploadTrack = async (
  audioFile: File,
  coverFile: File | null,
  trackData: Omit<Track, 'id' | 'audioUrl' | 'coverUrl' | 'createdAt' | 'updatedAt' | 'plays' | 'likes' | 'comments' | 'likedBy' | 'uniqueId'>
): Promise<Track> => {
  try {
    // Upload audio file
    const audioRef = ref(storage, `tracks/${trackData.userId}/${Date.now()}_${audioFile.name}`);
    const audioSnapshot = await uploadBytes(audioRef, audioFile);
    const audioUrl = await getDownloadURL(audioSnapshot.ref);

    // Upload cover if provided
    let coverUrl = '';
    if (coverFile) {
      const coverRef = ref(storage, `covers/${trackData.userId}/${Date.now()}_${coverFile.name}`);
      const coverSnapshot = await uploadBytes(coverRef, coverFile);
      coverUrl = await getDownloadURL(coverSnapshot.ref);
    }

    // Generate unique ID for sharing
    const uniqueId = `${trackData.username}-${Date.now()}`;

    // Save track data to Firestore
    const track = {
      ...trackData,
      audioUrl,
      coverUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      plays: 0,
      likes: 0,
      comments: 0,
      likedBy: [],
      uniqueId
    };

    const docRef = await addDoc(collection(db, 'tracks'), track);
    return { id: docRef.id, ...track, createdAt: Timestamp.now(), updatedAt: Timestamp.now() };
  } catch (error) {
    console.error('Error uploading track:', error);
    throw error;
  }
};

export const getUserTracks = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'tracks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Track[];
  } catch (error) {
    console.error('Error getting user tracks:', error);
    throw error;
  }
};

export const getPublicTracks = async (limitCount = 20) => {
  try {
    const q = query(
      collection(db, 'tracks'),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Track[];
  } catch (error) {
    console.error('Error getting public tracks:', error);
    throw error;
  }
};

export const searchTracks = async (searchTerm: string) => {
  try {
    const q = query(
      collection(db, 'tracks'),
      where('isPublic', '==', true),
      orderBy('title')
    );
    const snapshot = await getDocs(q);
    const tracks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Track[];
    
    return tracks.filter(track => 
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching tracks:', error);
    throw error;
  }
};

export const likeTrack = async (trackId: string, userId: string) => {
  try {
    const trackRef = doc(db, 'tracks', trackId);
    const trackDoc = await getDoc(trackRef);
    
    if (trackDoc.exists()) {
      const track = trackDoc.data() as Track;
      const isLiked = track.likedBy?.includes(userId);
      
      if (isLiked) {
        await updateDoc(trackRef, {
          likes: increment(-1),
          likedBy: arrayRemove(userId)
        });
      } else {
        await updateDoc(trackRef, {
          likes: increment(1),
          likedBy: arrayUnion(userId)
        });
      }
    }
  } catch (error) {
    console.error('Error liking track:', error);
    throw error;
  }
};

export const incrementPlays = async (trackId: string) => {
  try {
    const trackRef = doc(db, 'tracks', trackId);
    await updateDoc(trackRef, {
      plays: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing plays:', error);
  }
};

export const addComment = async (trackId: string, userId: string, username: string, content: string) => {
  try {
    // Rate limiting check - max 5 comments per minute per user
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const recentCommentsQuery = query(
      collection(db, 'comments'),
      where('userId', '==', userId),
      where('lastActivity', '>', Timestamp.fromDate(oneMinuteAgo))
    );
    const recentComments = await getDocs(recentCommentsQuery);
    
    if (recentComments.size >= 5) {
      throw new Error('Rate limit exceeded. Please wait before commenting again.');
    }

    const comment = {
      trackId,
      userId,
      username,
      content: content.trim(),
      createdAt: serverTimestamp(),
      lastActivity: serverTimestamp()
    };

    await addDoc(collection(db, 'comments'), comment);
    
    // Increment comment count on track
    const trackRef = doc(db, 'tracks', trackId);
    await updateDoc(trackRef, {
      comments: increment(1)
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const getTrackComments = async (trackId: string) => {
  try {
    const q = query(
      collection(db, 'comments'),
      where('trackId', '==', trackId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Comment[];
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};