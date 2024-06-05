import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BackendService } from './services/backend.service';
import { FirebaseService } from './services/firebase.service';
import { AdminBackendService } from './services/admin-backend.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    BackendService,
    AdminBackendService,
    FirebaseService,
  ],
};
