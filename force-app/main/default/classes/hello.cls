// Use .apex files to store anonymous Apex.
// You can execute anonymous Apex in VS Code by selecting the
//     apex text and running the command:
//     SFDX: Execute Anonymous Apex with Currently Selected Text
// You can also execute the entire file by running the command:
//     SFDX: Execute Anonymous Apex with Editor Contents

string tempvar = 'Enter_your_name_here';
System.debug('Hello World!');
System.debug('My name is ' + tempvar);

Account acct = [SELECT Id FROM Account WHERE Name LIKE 'Edg%' LIMIT 1];
CreditCheckContinuation.creditCheckApi(acct.Id);
system.debug(ContactController.getContactList(acct.Id));

PushTopic pushTopic = new PushTopic();
pushTopic.Name = 'Account';
pushTopic.Query = 'SELECT Id, Name FROM Account';
pushTopic.ApiVersion = 56.0;
pushTopic.NotifyForOperationCreate = true;
pushTopic.NotifyForOperationUpdate = true;
pushTopic.NotifyForOperationUndelete = true;
pushTopic.NotifyForOperationDelete = true;
pushTopic.NotifyForFields = 'Referenced';
insert pushTopic;

system.debug(AccountController.getTopAccounts());
