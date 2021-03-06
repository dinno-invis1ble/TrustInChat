import { Routes, RouterModule } from '@angular/router';

import { ChatComponent } from './chat/chat.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RemoteWelcomeComponent } from './remote/remotewelcome.component';

import { ChatGuard } from './chat/chat.guard';

const CHAT_ROUTES: Routes = [
	{ path: '', component: HomepageComponent },
	{ path: 'chat/:serverSessionId', component: ChatComponent, canActivate: [ChatGuard] },
	{ path: 'chat/remotewelcome/:serverSessionId', component: RemoteWelcomeComponent },
	{ path: '**', redirectTo: '', pathMatch: 'full' }
];

export const routing = RouterModule.forRoot(CHAT_ROUTES);