import { Routes, CanActivate } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { ClientComponent } from '../client/client.component';
import { ClienttransactionsComponent } from '../clienttransactions/clienttransactions.component';
import { BrokertransactionsComponent } from '../brokertransactions/brokertransactions.component';

export const routes: Routes = [
  { path: 'home',  component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'client',  component: ClientComponent },
  { path: 'mytransactions',  component: ClienttransactionsComponent },
  { path: 'requestedtransactions',  component: BrokertransactionsComponent }
];