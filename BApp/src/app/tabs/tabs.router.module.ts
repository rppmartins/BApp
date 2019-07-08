import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'logout',
        children: [
          {
            path: '',
            loadChildren: '../pages/logout/logout.module#LogoutPageModule'
          }
        ]
      },
      {
        path: 'trophies',
        children: [
          {
            path: '',
            loadChildren: '../pages/trophies/trophies.module#TrophiesPageModule'
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: '../pages/profile/profile.module#ProfilePageModule'
          }
        ]
      },
      {
        path: 'scan',
        children: [
          {
            path: '',
            loadChildren: '../pages/scan/scan.module#ScanPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
