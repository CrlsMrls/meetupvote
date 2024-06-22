# Ideas

## Use cases

- Plugin (only focus on VSC)
- StackOverflow/Google-search Questions
- Upgrade techstack to newer versions
- Code reasoning: Explain this code / Document this class
- Prompting
- Improve code and fix known-issues
- One shot coding
- Iterative coding

## Knowledge/StackOverflow Questions

- how to transform an observable to a signal? vs. I am coding an Authirization Angular service, the user can be logged in or logged out, this information is shared with a state using an observable, I want to transform this observable to a signal, how can I do that?
- what is the TypeScript type for an Angular signal?
- I accidentally git committed some files, how can I undo the changes?
- Having a list of CSS classes, how can I apply to an Angular parent component?

## Code reasoning

- explain what this project does and generate a short summary for the README.md file

## Upgrades

- Having this class:

```Typescript
@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private headerSubject = new BehaviorSubject<string>('Meetup Vote');
  header$: Observable<string> = this.headerSubject.asObservable();

  setHeaderText(text: string): void {
    console.log('setHeaderText', text);
    this.headerSubject.next(text);
  }
}
```

I want to transform the `header$` observable to a signal. How can I do that?

## Fix issues

- this SVG does not change the color in dark mode, can you fix it?

```
<svg viewBox="0 0 500 500" xml:space="preserve" aria-hidden="true"
          class="text-gray-600 dark:text-white w-5 h-5">
          <path
            d="M409.59,281.61h-17.41l-51.2,51.2h48.89l45.31,51.2H76.81l45.57-51.2h52.48l-51.2-51.2h-21.25l-76.8,76.8V460.8 c0,28.28,22.92,51.2,51.2,51.2h358.38c28.28,0,51.2-22.92,51.2-51.2V358.41L409.59,281.61 M383.99,152.34L257.28,279.05 l-90.87-90.62L293.37,61.72L383.99,152.34 M275.45,7.46L112.39,170.52c-9.98,9.98-9.98,26.11,0,36.09l126.71,126.2 c9.98,10.5,26.11,10.5,36.09,0L438,170.52c9.98-9.98,9.98-26.11,0-36.09L311.29,7.71C301.57-2.53,285.44-2.53,275.45,7.46z" />
        </svg>

```

- adapt this component to dark theme too

```HTML
<fieldset>
  <legend class="text-sm font-semibold leading-6 text-gray-900">{{legend()}}</legend>
  @if (description()) {
  <p class="mt-1 text-sm leading-6 text-gray-600">{{description()}}</p>
  }
  <div class="mt-6 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
    @for (option of options(); track $index) {
    <div class="flex items-center">
      <input [id]="option.value" name="option" type="radio"
        class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600">
      <label [for]="option.value" class="ml-3 block text-sm font-medium leading-6 text-gray-900">{{option.text}}</label>
    </div>
    }
  </div>
</fieldset>

```

## Iterative

- can you transform this into a card component?

```HTML

  <div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <img class="w-full h-48 object-cover" src="election-image.jpg" alt="Election Image">
      <div class="p-4">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-2">Election Title</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">Election Description</p>
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Start Date: 2022-01-01</span>
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">End Date: 2022-01-31</span>
        </div>
      </div>
    </div>
  </div>

```

I need to create an Angular Service, that imports environment variables, initializes Firebase, adds Firestore service, Firebase Authentication, and local emulators. Can you do that?

- I need to create an Angular service that imports environment variables and initializes Firebase App
- From this Angular Service, can you add Firestore service?
- Can you to the current Angular Service the Firebase Authentication service?
- Can you Add local emulators to these services?

```Typescript
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Injectable } from '@angular/core';

import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  app: FirebaseApp;

  constructor() {
    this.app = initializeApp(environment.firebaseConfig);

  }
}
```

## Improve code

- I have this code that updates a question in an election, can you improve it?

```Typescript
  async selectQuestion(electionId: string, questionId: string): Promise<void> {
    try {
      const docRef = doc(this.db, 'elections', electionId);

      await updateDoc(docRef, {
        activeQuestionId: questionId,
      });
    } catch (e) {
      console.error('Error selecting question: ', e);
    }
  }

  async unselectQuestion(electionId: string): Promise<void> {
    try {
      const docRef = doc(this.db, 'elections', electionId);

      await updateDoc(docRef, {
        activeQuestionId: null,
      });
    } catch (e) {
      console.error('Error selecting question: ', e);
    }
  }
```

- I would like to load the children route asyncronously, can you help me?

```Typescript
export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [adminGuardFunction],
    // resolve: { data: () => inject(AdminBackendService).loading },
    children: [
      {
        path: 'elections',
        component: ElectionListComponent,
      },
      { path: 'elections/:id', component: ElectionComponent },
    ],
  },
  {
    path: ':id',
    component: VotersComponent,
  },
  { path: '', redirectTo: '/admin/elections', pathMatch: 'full' },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }, // The wildcard '**' matches any path
];
```

- could you refactor this code to have less lines of code?

```Typescript
import { Component, OnInit, computed, input, signal } from '@angular/core';
import { Question } from '../../models';

@Component({
  selector: 'app-weights',
  standalone: true,
  templateUrl: './weights.component.html',
})
export class WeightsComponent {
  question = input.required<Question>();

  copilot: number = 0;
  gemini: number = 0;
  copilotVotes: number = 0;
  geminiVotes: number = 0;
  bothVotes: number = 0;
  noneVotes: number = 0;

  ngOnInit() {
    this.computeWeights();
  }

  computeWeights(): void {
    this.copilotVotes = this.question().votes.reduce((acc, vote) => {
      if (vote.votedOption === 0) {
        return acc + 1;
      }
      return acc;
    }, 0);
    this.geminiVotes = this.question().votes.reduce((acc, vote) => {
      if (vote.votedOption === 1) {
        return acc + 1;
      }
      return acc;
    }, 0);
    this.bothVotes = this.question().votes.reduce((acc, vote) => {
      if (vote.votedOption === 2) {
        return acc + 1;
      }
      return acc;
    }, 0);
    this.noneVotes = this.question().votes.reduce((acc, vote) => {
      if (vote.votedOption === 3) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }
}

```

## Exciting times

- All this did not exist 5 years ago, in 5 years all this can be false (the past is the best predictor of the future)
- I am not an expert, is there any expert?
- All the following presentation is as of today, it may be outdated tomorrow
- Generative AI, and more concretly the LLMs models, are constantly evolving

## Developer principles

- LLMs and hallucinations

  - Large Language Models (LLMs) are trained with a massive amount of data, they work by calculating the probability of different words and phrases following each other. When you ask a question, they predict the most likely response, essentially "guessing" the most plausible answer.
  - LLMs sometimes generate code that looks plausible but is not actually correct, these are called "fabricated ideas" or "hallucinations".

- Principle 1: Use the model as a tool
  - The model is a tool to help you, not to replace you.
  - Always review the generated code carefully.
  - [Is Stack Overflow Obsolete? An Empirical Study of the Characteristics of ChatGPT Answers to Stack Overflow Questions, Kabir et al. (2023)](https://arxiv.org/abs/2308.02312)
    - 52% of ChatGPT answers contain incorrect information and 77% are verbose.
    - participants overlooked the misinformation in the ChatGPT answers 39% of the time.
- Principle 2: Write clear and specific instructions
  - Don't confuse writing a clear prompt with writing a short prompt.
  - Prompting is an art, the more specific you are, the better the results.
    - Ask for the output in a structured format
    - Ask for validations and conditions that must be met
    - Give a desired role for the LLM to play "You are an expert developer and ..."
  - [A Systematic Survey of Prompt Engineering in Large Language Models: Techniques and Applications, Sahoo et al. (2024)](https://arxiv.org/abs/2402.07927)
    - Structured Chain-of-Thought (SCoT) prompting improves performance by up to 13.79%
- Principle 3: Iterate over questions
  - Rephrase the prompt if the model is not giving the desired output
  - Use the responses to get new ideas and identify new questions
  - Zero-shot vs iterative
  - [Self-Refine: Iterative Refinement with Self-Feedback, Madaan et al. (2023)](https://arxiv.org/abs/2303.17651)
    - Improvements of ~20% when using the iterative feedback and refinement over the conventional one-step generation, using the same LLM model
  - [Reflexion: Language Agents with Verbal Reinforcement Learning, Shinn et al. (2023)](https://arxiv.org/abs/2303.11366)
    - Linguistic feedback achieves a 91% accuracy on the HumanEval coding benchmark, surpassing the state-of-the-art GPT-4 that achieves 80%
- Principle 4: Give the model time to “think”
  - Specify the steps to complete the task
  - Ask to evaluate if the solution is correct or not. "Don't decide if the solution is correct until you have resolved the problem yourself."
