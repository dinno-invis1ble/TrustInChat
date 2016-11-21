export class Session {
	public toEmail: string;    
	public fromName: string;   
	public fromEmail: string;  
	public securityQuestion: string;    
	public securityAnswer: string;
	public initialMessage: string;
	public notifications: string;

	public user: string;

	public serverSessionId: string;
	public serverSessionIdValidation: string;
	public serverSessionSalt: string;
	public serverSessionSecret: string;

	public messageSalt: string;
	public messageSecretValidation: string;
	public messageIntegrity: string;

	constructor (toEmail?: string, 
				 fromName?: string,
				 fromEmail?: string,
				 securityQuestion?: string,
				 securityAnswer?: string,
				 initialMessage?: string,
				 notifications?: string,
				 user?: string,
				 serverSessionId?: string,
				 serverSessionIdValidation?: string,
				 serverSessionSalt?: string,
				 serverSessionSecret?: string,
				 messageSalt?: string,
				 messageSecretValidation?: string,
				 messageIntegrity?: string
				 ) 
	{
		this.toEmail = toEmail;
		this.fromName = fromName;
		this.fromEmail = fromEmail;
		this.securityQuestion = securityQuestion;
		this.securityAnswer = securityAnswer;
		this.initialMessage = initialMessage;  
		this.notifications = notifications;
		this.user = user;
		this.serverSessionId = serverSessionId;
		this.serverSessionIdValidation = serverSessionIdValidation;
		this.serverSessionSalt = serverSessionSalt;
		this.serverSessionSecret = serverSessionSecret;
		this.messageSalt = messageSalt;
		this.messageSecretValidation = messageSecretValidation;
		this.messageIntegrity = messageIntegrity;
	}
}

