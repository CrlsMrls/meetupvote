import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../backend.service';
import { NavigationService } from '../../header.service';
import { CardComponent } from '../../components/card/card.component';
import { ButtonComponent } from '../../components/button/button.component';
import { FirebaseService } from '../../firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-election',
  standalone: true,
  imports: [CardComponent, ButtonComponent, CommonModule],
  providers: [BackendService],
  templateUrl: './election.component.html',
  styleUrl: './election.component.css',
})
export class ElectionComponent {
  backendService: BackendService = inject(BackendService);
  headerService: NavigationService = inject(NavigationService);
  firebaseService = inject(FirebaseService);
  #router: Router = inject(Router);
  elections = this.backendService.getFirestoreElections();

  // set the header values and the path to empty
  ngOnInit(): void {
    this.headerService.setHeaderText('Elections');
    this.headerService.setNavItems([]);
  }

  // navigate to the election details page
  navigateToElectionDetails(electionId: string): void {
    this.#router.navigate(['/elections', electionId]);
  }

  electionUrlIfLoggedIn(electionId: string): string | null {
    return this.firebaseService.user() ? `/elections/${electionId}` : null;
  }
}
