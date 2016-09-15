import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { routing, appRoutingProviders } from './app.routing';

import { AppComponent }   from './app.component';
import { MessageComponent } from './messages/message.component';
import { MessageListComponent } from './messages/message-list.component';
import { MessageInputComponent } from './messages/message-input.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MessagesComponent } from './messages/messages.component';
import { HeaderComponent } from './header.component';
import { MessageService } from './messages/message.service';

@NgModule({
	imports: [
    	BrowserModule,
    	FormsModule,
    	ReactiveFormsModule,
        routing
  	],
    declarations: [
        AppComponent,
        MessageComponent,
        MessageListComponent,
        HomepageComponent,
        MessageInputComponent,
        MessagesComponent,
        HeaderComponent
    ],
    providers: [
        MessageService,
        appRoutingProviders
    ],  
    bootstrap:  [
	    [AppComponent]
    ]  
})
export class AppModule {}