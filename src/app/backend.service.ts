// class to expose the backend service
// this class is responsible for all the backend operations
// - get Elections by id
// - get Array of Questions for an Election id (because these are static data, we can get all the questions in an array)
// - get Question by id (this dynamically changes, use an observable)
// - add Votes to a Question by id
// - add Comments to a Question by id

import { Injectable, Signal, inject, signal } from '@angular/core';
import { Election, Question, Vote, Comment } from './models';
import { Observable, of } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { getDocs, collection, where, query } from 'firebase/firestore';

@Injectable()
export class BackendService {
  db = inject(FirebaseService).firestore;

  private elections: Election[] = [
    {
      id: '1',
      title: 'First election',
      shortTitle: 'Election 1',
      description: 'This is the first election',
      visibility: 'public',
    },
    {
      id: '2',
      title: 'Second election',
      shortTitle: 'Election 2',
      description: 'This is the second election',
      visibility: 'private',
    },
    {
      id: '3',
      title: 'Third election',
      shortTitle: 'Election 3',
      description: 'This is the third election',
      visibility: 'public',
    },
    {
      id: 'KMTOxnqCY8zJCyAcaMTO',
      title: 'Fourth election',
      shortTitle: 'Election 4',
      description: 'This is the fourth election',
      visibility: 'private',
    },
    {
      id: '5',
      title: 'Fifth election',
      shortTitle: 'Election 5',
      description: 'This is the fifth election',
      visibility: 'public',
    },
    {
      id: '6',
      title: 'Sixth election',
      shortTitle: 'Election 6',
      description: 'This is the sixth election',
      visibility: 'private',
    },
    {
      id: '7',
      title: 'Seventh election',
      shortTitle: 'Election 7',
      description: 'This is the seventh election',
      visibility: 'public',
    },
    {
      id: '8',
      title: 'Eighth election',
      shortTitle: 'Election 8',
      description: 'This is the eighth election',
      visibility: 'private',
    },
    {
      id: '9',
      title: 'Ninth election',
      shortTitle: 'Election 9',
      description: 'This is the ninth election',
      visibility: 'public',
    },
    {
      id: '10',
      title: 'Tenth election',
      shortTitle: 'Election 10',
      description: 'This is the tenth election',
      visibility: 'private',
    },
    {
      id: '11',
      title: 'Eleventh election',
      shortTitle: 'Election 11',
      description: 'This is the eleventh election',
      visibility: 'public',
    },
    {
      id: '12',
      title: 'Twelfth election',
      shortTitle: 'Election 12',
      description: 'This is the twelfth election',
      visibility: 'private',
    },
  ];

  private questions: Question[] = [
    {
      id: '1',
      electionId: 'KMTOxnqCY8zJCyAcaMTO',
      title: 'Question 1',
      description: 'What is your favorite color?',
      type: 'single-choice',
      state: 'open',
      answer: ['Red', 'Green', 'Blue'],
      votes: [
        {
          id: '1',
          voter: 'user1',
          votedOption: 0,
          timestamp: 1630486800000,
        },
        {
          id: '2',
          voter: 'user2',
          votedOption: 1,
          timestamp: 1630486800000,
        },
        {
          id: '3',
          voter: 'user3',
          votedOption: 2,
          timestamp: 1630486800000,
        },
      ],
      comments: [],
    },
    {
      id: '2',
      electionId: 'KMTOxnqCY8zJCyAcaMTO',
      title: '2. Extremely long question title that should be truncated',
      description: 'What is your favorite animal?',
      type: 'single-choice',
      state: 'open',
      answer: ['Dog', 'Cat', 'Bird'],
      votes: [
        {
          id: '1',
          voter: 'user1',
          votedOption: 0,
          timestamp: 1630486800000,
        },
        {
          id: '2',
          voter: 'user2',
          votedOption: 1,
          timestamp: 1630486800000,
        },
        {
          id: '3',
          voter: 'user3',
          votedOption: 2,
          timestamp: 1630486800000,
        },
        {
          id: '4',
          voter: 'user4',
          votedOption: 0,
          timestamp: 1630486800000,
        },
        {
          id: '5',
          voter: 'user5',
          votedOption: 1,
          timestamp: 1630486800000,
        },
        {
          id: '6',
          voter: 'user6',
          votedOption: 2,
          timestamp: 1630486800000,
        },
      ],
      comments: [],
    },
    {
      id: '3',
      electionId: '2',
      title: 'Question 1',
      description: 'What is your favorite food?',
      type: 'single-choice',
      state: 'open',
      answer: ['Pizza', 'Burger', 'Pasta'],
      votes: [],
      comments: [],
    },
  ];

  randomQuestions() {
    const randomQuestions: Question[] = [];

    for (let i = 3; i <= 12; i++) {
      for (let j = 1; j <= 20; j++) {
        const question: Question = {
          id: `${i}${j}`,
          electionId: `${i}`,
          title: `Question ${j}`,
          description: `This is question ${j} for election ${i}`,
          type: 'single-choice',
          state: 'open',
          answer: ['Option 1', 'Option 2', 'Option 3'],
          votes: [],
          comments: [],
        };
        randomQuestions.push(question);
      }
    }

    this.questions = [...this.questions, ...randomQuestions];
  }

  constructor() {
    this.randomQuestions();
  }

  getElections(): Election[] {
    return this.elections;
  }

  async getFirestoreElections(): Promise<Election[]> {
    const result: Election[] = [];

    try {
      const q = query(
        collection(this.db, 'elections'),
        where('visibility', '==', 'public')
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const election = doc.data() as Election;
        election.id = doc.id;
        result.push(election);
      });
    } catch (e) {
      console.error('Error fetchint documents: ', e);
    }
    return result;
  }

  getElectionById(id: string): Election {
    const election = this.elections.find((election) => election.id === id);
    if (!election) {
      throw new Error('Election not found in getElectionById');
    }
    return election;
  }

  getQuestionsByElectionId(electionId: string): Signal<Question[]> {
    const questions = this.questions.filter(
      (question) => question.electionId === electionId
    );
    return signal(questions);
  }

  getQuestionById(id: string): Signal<Question> {
    const question = this.questions.find((question) => question.id === id);
    if (!question) {
      throw new Error('Question not found in getQuestionById');
    }
    return signal(question);
  }

  addVoteToQuestion(questionId: string, vote: Vote): void {
    const question = this.questions.find(
      (question) => question.id === questionId
    );
    if (!question) {
      throw new Error('Question not found in addVoteToQuestion');
    }
    question.votes.push(vote);
  }

  addCommentToQuestion(questionId: string, comment: Comment): void {
    const question = this.questions.find(
      (question) => question.id === questionId
    );
    if (!question) {
      throw new Error('Question not found in addCommentToQuestion');
    }
    question.comments.push(comment);
  }
}
