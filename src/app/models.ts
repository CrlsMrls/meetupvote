type id = string;

export interface Election {
  id: id;
  title: string;
  shortTitle: string;
  description: string;
  state: 'visible' | 'hidden';
}

export interface Question {
  id: id;
  electionId: string;
  title: string;
  description: string;
  type: 'open-text' | 'single-choice';
  state: 'open' | 'voting' | 'closed';
  answer: string[];
  votes: Vote[];
  comments: Comment[];
}

export interface Vote {
  id: id;
  voter: string;
  votedOption: number;
  timestamp: number;
}

export interface Comment {
  id: id;
  userId: string;
  text: string;
  timestamp: number;
}
