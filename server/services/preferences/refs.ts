import type { DocumentReference } from '../firestore/queryTypes';
import { firestore } from '../firebase';
import { preferencesConverter } from './converter';
import { PREFERENCES_DOC_ID } from './constants';
import type { PreferencesDocRaw } from './types';

export function preferencesDocRef(
  userId: string,
): DocumentReference<PreferencesDocRaw> {
  return firestore
    .collection(`users/${userId}/preferences`)
    .withConverter(preferencesConverter)
    .doc(PREFERENCES_DOC_ID) as DocumentReference<PreferencesDocRaw>;
}
