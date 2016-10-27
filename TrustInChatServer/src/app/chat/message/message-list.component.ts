import { Component, OnInit } from '@angular/core';

import { ChatService } from '../chat.service';
import { ErrorService } from '../../errors/error.service';

import { MessageComponent } from './message.component';

import { Message } from './message.model';


@Component({
	selector: 'chat-message-list',
	template: `
		<div class="col-md-8 col-md-offset-2">
			<chat-message 
				[message]="message" 
				(editClicked)="message.content = $event"
				*ngFor="let message of messages">
			</chat-message>
		</div>
	`
})
export class MessageListComponent implements OnInit {

	messages: Message[];

	constructor(private chatService: ChatService) {

	}

	ngOnInit() {
		this.messages = this.chatService.getMessages();
	}
}