import { firestore } from '../firebase';
import { sessionConverter } from './converter';
import { SESSIONS_COLLECTION_NAME } from './constants';

export function sessionsCollection(userId: string) {
  return firestore
    .collection(`users/${userId}/${SESSIONS_COLLECTION_NAME}`)
    .withConverter(sessionConverter);
}
