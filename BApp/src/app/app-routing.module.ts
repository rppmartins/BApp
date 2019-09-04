import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'loading', pathMatch: 'full'},
  { path: 'loading', loadChildren: './pages/loading/loading.module#LoadingPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'form', loadChildren: './pages/form/form.module#FormPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'notifications', loadChildren: './pages/notifications/notifications.module#NotificationsPageModule' },
  { path: 'questionnaires/:id', loadChildren: './pages/questionnaires/questionnaires.module#QuestionnairePageModule' },
  { path: 'invitations/:id', loadChildren: './pages/invitations/invitations.module#InvitationPageModule' },
  { path: 'thanks/:id', loadChildren: './pages/thanks/thanks.module#ThanksPageModule' },
  { path: 'edit/:id', loadChildren: './pages/edit/edit.module#EditPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
