import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'registerUser',
        pathMatch: 'full'
    },
    {
        path:'registerUser',
        loadComponent:()=> import('./user-register/user-register').then(m=>m.UserRegister)
    },
    {
        path:'Dashboard',
        loadComponent:()=> import('./dashboard/dashboard').then(m=>m.Dashboard)
    }
];
