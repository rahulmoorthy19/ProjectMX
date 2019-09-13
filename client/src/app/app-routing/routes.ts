import { Routes, CanActivate } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { ClientComponent } from '../client/client.component';
import { ClienttransactionsComponent } from '../clienttransactions/clienttransactions.component';
import { BrokertransactionsComponent } from '../brokertransactions/brokertransactions.component';
import { BrokerComponent } from '../broker/broker.component';
import { BrokerprevioustransactionsComponent } from '../brokerprevioustransactions/brokerprevioustransactions.component';
import { AdminComponent } from '../admin/admin.component';
import { ViewtransactionComponent } from '../viewtransaction/viewtransaction.component';
import { DetailsComponent } from '../details/details.component';
export const routes: Routes = [
  { path: 'home',  component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'client',  component: ClientComponent },
  { path: 'mytransactions',  component: ClienttransactionsComponent },
  { path: 'requestedtransactions',  component: BrokertransactionsComponent },
  { path: 'broker',  component: BrokerComponent },
  { path: 'previoustransactions',  component: BrokerprevioustransactionsComponent },
  { path: 'admin',  component: AdminComponent },
  { path: 'blacklist',  component: ViewtransactionComponent },
  { path: 'detail/:id',  component: DetailsComponent }
];