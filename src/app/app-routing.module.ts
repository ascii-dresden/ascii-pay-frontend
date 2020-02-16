import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Application routes */
const routes: Routes = [
  { path: '', redirectTo: '/checkout', pathMatch: 'full' },
];

/**
 * Registers application routes.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
