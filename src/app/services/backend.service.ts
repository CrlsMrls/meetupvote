// class to expose the backend service
// this class is responsible for all the backend operations
// - get Elections by id
// - get Array of Questions for an Election id (because these are static data, we can get all the questions in an array)
// - get Question by id (this dynamically changes, use an observable)
// - add Votes to a Question by id
// - add Comments to a Question by id

import { Injectable, inject, signal } from '@angular/core';
import { Election, Question, Vote } from '../models';
import { FirebaseService } from './firebase.service';
import {
  onSnapshot,
  Unsubscribe,
  doc,
  arrayUnion,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

@Injectable()
export class BackendService {
  db = inject(FirebaseService).firestore;
  election = signal<Election | null>(null); // the election selected by the user
  question = signal<Question | null>(null); // the current question selected by the admin
  prevQuestionSubs: Unsubscribe | null = null;
  prevElectionSubs: Unsubscribe | null = null;

  async loadElectionById(id: string | null): Promise<Election | undefined> {
    if (!id) {
      throw new Error('Election id is required in loadElectionById');
    }

    try {
      return new Promise(async (resolve) => {
        this.prevElectionSubs = onSnapshot(
          doc(this.db, 'elections', id),
          (doc) => {
            const election = doc.data() as Election;
            election.id = doc.id;
            this.election.set(election);
            this.#loadActiveQuestion(election);
            resolve(election);
          }
        );
      });
    } catch (e) {
      console.error('Error fetching election: ', e);
    }
    return undefined;
  }

  async #loadActiveQuestion(election: Election): Promise<void> {
    try {
      const questionId = election.activeQuestionId;
      const state = election.state;
      if (!questionId) {
        this.question.set(null);
        return;
      }

      if (this.prevQuestionSubs) {
        this.prevQuestionSubs();
      }

      const q = doc(this.db, 'questions', questionId);
      this.prevQuestionSubs = onSnapshot(q, (doc) => {
        const question = doc.data() as Question;
        question.id = doc.id;
        this.question.set(question);
      });
    } catch (e) {
      console.error('Error fetching active question: ', e);
    }
  }

  async vote(questionId: string, vote: Vote): Promise<void> {
    try {
      const qRef = doc(this.db, 'questions', questionId);
      await updateDoc(qRef, {
        votes: arrayUnion(vote),
      });
    } catch (e) {
      console.error('Error voting: ', e);
    }
  }

  async loadQuestionsByElectionId(electionId: string): Promise<Question[]> {
    try {
      const questions: Question[] = [];
      const q = query(
        collection(this.db, 'questions'),
        where('electionId', '==', electionId)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const question = doc.data() as Question;
        question.id = doc.id;
        questions.push(question);
      });
      return questions;
    } catch (e) {
      console.error('Error fetching questions: ', e);
    }
    return [];
  }
}
