public with sharing class ContactController {
    
    @AuraEnabled
    public static List<Contact> getContactList(String accountId) {

        return [SELECT Id, Name, Title, Email FROM Contact WHERE AccountId = :accountId WITH SECURITY_ENFORCED];
    }
}

