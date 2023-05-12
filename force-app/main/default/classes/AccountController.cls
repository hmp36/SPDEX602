public with sharing class AccountController {
    

    @AuraEnabled(cacheable=true)
    public static List<Account> getTopAccounts() {

        return [SELECT Id, Name, AnnualRevenue, Phone FROM Account WITH SECURITY_ENFORCED 
                    ORDER BY AnnualRevenue DESC NULLS LAST LIMIT 5];
    }
}

