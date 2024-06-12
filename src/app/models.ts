type id = string;

export interface Election {
  id?: id;
  title: string;
  description: string;
  visibility: 'public' | 'private';
  state: 'open' | 'voting' | 'closed';
  activeQuestionId?: id;
}

export interface Question {
  id?: id;
  electionId: string;
  title: string;
  description: string;
  options: string[];
  votes: Vote[];
}

export interface Vote {
  id?: id;
  voter: string;
  votedOption: number;
  weight: number;
  timestamp?: number;
}

export interface Comment {
  id: id;
  userId: string;
  text: string;
  timestamp: number;
}
