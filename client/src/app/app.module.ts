import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule} from './app-routing/app-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { HomeComponent } from './home/home.component';
import { ClientComponent } from './client/client.component';
import { ClienttransactionsComponent } from './clienttransactions/clienttransactions.component';
import { BrokertransactionsComponent } from './brokertransactions/brokertransactions.component';
import { baseURL } from './shared/baseurl';
import { BrokerComponent } from './broker/broker.component';
import { BrokerprevioustransactionsComponent } from './brokerprevioustransactions/brokerprevioustransactions.component';
import { AdminComponent } from './admin/admin.component';
import { ViewtransactionComponent } from './viewtransaction/viewtransaction.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ClientComponent,
    ClienttransactionsComponent,
    BrokertransactionsComponent,
    BrokerComponent,
    BrokerprevioustransactionsComponent,
    AdminComponent,
    ViewtransactionComponent,
    DetailsComponent,
    ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    Ng2SearchPipeModule,
    DateInputsModule,
    BrowserAnimationsModule
  ],
  providers: [
    {provide: 'baseURL', useValue: baseURL},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
