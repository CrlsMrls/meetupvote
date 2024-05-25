import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../backend.service';
import { NavigationService } from '../../header.service';
import { CardComponent } from '../../components/card/card.component';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-election',
  standalone: true,
  imports: [CardComponent, ButtonComponent],
  providers: [BackendService],
  templateUrl: './election.component.html',
  styleUrl: './election.component.css',
})
export class ElectionComponent {
  backendService: BackendService = inject(BackendService);
  headerService: NavigationService = inject(NavigationService);
  #router: Router = inject(Router);
  elections = this.backendService.getElections();

  // set the header values and the path to empty
  ngOnInit(): void {
    this.headerService.setHeaderText('Elections');
    this.headerService.setNavItems([]);
  }

  // navigate to the election details page
  navigateToElectionDetails(electionId: string): void {
    this.#router.navigate(['/elections', electionId]);
  }
}
