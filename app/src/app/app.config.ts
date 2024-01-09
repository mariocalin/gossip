import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withDebugTracing,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Api } from './core/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withDebugTracing()),
    [provideAnimations(), withViewTransitions()],
    provideHttpClient(withFetch()),
    { provide: Api },
  ],
};
