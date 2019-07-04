import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'form', loadChildren: './form/form.module#FormPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsPageModule' },
  { path: 'questionnaires/:id', loadChildren: './questionnaires/questionnaires.module#QuestionnairePageModule' },
  { path: 'invitations/:id', loadChildren: './invitations/invitations.module#InvitationPageModule' },
  { path: 'thanks/:id', loadChildren: './thanks/thanks.module#ThanksPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
