// class to expose the backend service
// this class is responsible for all the backend operations
// - get Elections by id
// - get Array of Questions for an Election id (because these are static data, we can get all the questions in an array)
// - get Question by id (this dynamically changes, use an observable)
// - add Votes to a Question by id
// - add Comments to a Question by id

import { Injectable, inject, signal } from '@angular/core';
import { Election, Question } from '../models';
import { FirebaseService } from './firebase.service';
import {
  collection,
  where,
  query,
  onSnapshot,
  Unsubscribe,
  doc,
  setDoc,
  addDoc,
  updateDoc,
} from 'firebase/firestore';

@Injectable()
export class AdminBackendService {
  db = inject(FirebaseService).firestore;
  elections = signal<Election[]>([]);

  election = signal<Election | null>(null);
  questions = signal<Question[]>([]);

  prevQuestionsSubs: Unsubscribe | null = null;
  prevElectionSubs: Unsubscribe | null = null;

  unsubscribe() {
    // helper function to unsubscribe from the previous subscription
    const unsubs = (fn: Unsubscribe | null) => {
      if (fn && typeof fn === 'function') {
        fn();
      }
      fn = null;
    };

    unsubs(this.prevElectionSubs);
    unsubs(this.prevQuestionsSubs);
  }

  async updateActiveQuestion(
    electionId: string,
    questionId: string | null
  ): Promise<void> {
    try {
      const docRef = doc(this.db, 'elections', electionId);

      await updateDoc(docRef, {
        activeQuestionId: questionId,
      });
    } catch (e) {
      console.error('Error updating active question: ', e);
    }
  }

  async updateElectionState(
    electionId: string,
    state: 'closed' | 'voting'
  ): Promise<void> {
    try {
      const docRef = doc(this.db, 'elections', electionId);

      await updateDoc(docRef, {
        state: state,
      });
    } catch (e) {
      console.error('Error closing election: ', e);
    }
  }

  async loadElections(): Promise<void> {
    if (this.prevElectionSubs) {
      this.prevElectionSubs();
    }

    const q = query(
      collection(this.db, 'elections'),
      where('visibility', '==', 'public')
    );

    this.prevElectionSubs = onSnapshot(q, (querySnapshot) => {
      const elections: Election[] = [];
      querySnapshot.forEach((doc) => {
        const election = doc.data() as Election;
        election.id = doc.id;
        elections.push(election);
      });
      this.elections.set(elections);
    });
  }

  async addQuestion(question: Question): Promise<void> {
    try {
      await addDoc(collection(this.db, 'questions'), question);
    } catch (e) {
      console.error('Error adding question: ', e);
    }
  }

  async createElection(election: Election): Promise<void> {
    try {
      if (election.id) {
        const electionRef = doc(this.db, 'elections', election.id);
        await setDoc(electionRef, election);
      } else {
        await addDoc(collection(this.db, 'elections'), election);
      }
    } catch (e) {
      console.error('Error creating election: ', e);
    }
  }

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
            this.#loadQuestionsFromElection(id);
            resolve(election);
          }
        );
      });
    } catch (e) {
      console.error('Error fetching election: ', e);
    }
    return undefined;
  }

  async #loadQuestionsFromElection(electionId: string): Promise<void> {
    try {
      return new Promise((resolve) => {
        if (this.prevQuestionsSubs) {
          this.prevQuestionsSubs();
        }

        const q = query(
          collection(this.db, 'questions'),
          where('electionId', '==', electionId)
        );
        // Firestore onSnapshot will keep the questions updated in real-time
        this.prevQuestionsSubs = onSnapshot(q, (querySnapshot) => {
          const questions: Question[] = [];
          querySnapshot.forEach((doc) => {
            const question = doc.data() as Question;
            question.id = doc.id;
            questions.push(question);
          });
          this.questions.set(questions);
          resolve();
        });
      });
    } catch (e) {
      console.error('Error fetching questions: ', e);
    }
  }
}
