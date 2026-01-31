import type { DocumentReference } from '../firestoreDemo/queryTypes';
import { sessionsCollection } from './collection';
import type { SessionDocRaw } from './types';

export function sessionDocRef(
  userId: string,
  id: string,
): DocumentReference<SessionDocRaw> {
  return sessionsCollection(userId).doc(id) as DocumentReference<SessionDocRaw>;
}

export function newSessionDocRef(
  userId: string,
): DocumentReference<SessionDocRaw> {
  return sessionsCollection(userId).doc() as DocumentReference<SessionDocRaw>;
}
