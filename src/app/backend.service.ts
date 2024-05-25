// class to expose the backend service
// this class is responsible for all the backend operations
// - get Elections by id
// - get Array of Questions for an Election id (because these are static data, we can get all the questions in an array)
// - get Question by id (this dynamically changes, use an observable)
// - add Votes to a Question by id
// - add Comments to a Question by id

import { Injectable, Signal, signal } from '@angular/core';
import { Election, Question, Vote, Comment } from './models';
import { Observable, of } from 'rxjs';

@Injectable()
export class BackendService {
  private elections: Election[] = [
    {
      id: '1',
      title: 'First election',
      shortTitle: 'Election 1',
      description: 'This is the first election',
      state: 'visible',
    },
    {
      id: '2',
      title: 'Second election',
      shortTitle: 'Election 2',
      description: 'This is the second election',
      state: 'hidden',
    },
    {
      id: '3',
      title: 'Third election',
      shortTitle: 'Election 3',
      description: 'This is the third election',
      state: 'visible',
    },
    {
      id: '4',
      title: 'Fourth election',
      shortTitle: 'Election 4',
      description: 'This is the fourth election',
      state: 'hidden',
    },
    {
      id: '5',
      title: 'Fifth election',
      shortTitle: 'Election 5',
      description: 'This is the fifth election',
      state: 'visible',
    },
    {
      id: '6',
      title: 'Sixth election',
      shortTitle: 'Election 6',
      description: 'This is the sixth election',
      state: 'hidden',
    },
    {
      id: '7',
      title: 'Seventh election',
      shortTitle: 'Election 7',
      description: 'This is the seventh election',
      state: 'visible',
    },
    {
      id: '8',
      title: 'Eighth election',
      shortTitle: 'Election 8',
      description: 'This is the eighth election',
      state: 'hidden',
    },
    {
      id: '9',
      title: 'Ninth election',
      shortTitle: 'Election 9',
      description: 'This is the ninth election',
      state: 'visible',
    },
    {
      id: '10',
      title: 'Tenth election',
      shortTitle: 'Election 10',
      description: 'This is the tenth election',
      state: 'hidden',
    },
    {
      id: '11',
      title: 'Eleventh election',
      shortTitle: 'Election 11',
      description: 'This is the eleventh election',
      state: 'visible',
    },
    {
      id: '12',
      title: 'Twelfth election',
      shortTitle: 'Election 12',
      description: 'This is the twelfth election',
      state: 'hidden',
    },
  ];

  private questions: Question[] = [
    {
      id: '1',
      electionId: '1',
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
      electionId: '1',
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
