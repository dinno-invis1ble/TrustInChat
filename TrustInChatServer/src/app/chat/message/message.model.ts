export class Message {
	public content: string;
	public chatFromEmail: string;
	public chatToEmail: string;
	public messageId: string;
	public sessionId: string;

	public newMessageSalt: string;
	public newMessageSecretValidation: string;
	public newMessageIntegrity: string;

	public user: string;

	constructor (content: string, 
				 chatFromEmail?: string,
				 chatToEmail?: string,
				 messageId?: string,
				 sessionId?: string,
				 newMessageSalt?: string, 
				 newMessageSecretValidation?: string, 
				 newMessageIntegrity?: string,
				 user?: string
				 ) 
	{
		this.content = content;
		this.chatFromEmail = chatFromEmail;
		this.chatToEmail = chatToEmail;
		this.messageId = messageId;
		this.sessionId = sessionId;

		this.newMessageSalt = newMessageSalt;
		this.newMessageSecretValidation = newMessageSecretValidation;
		this.newMessageIntegrity = newMessageIntegrity;

		this.user = user;
	}
}