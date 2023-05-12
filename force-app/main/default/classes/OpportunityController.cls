public with sharing class OpportunityController {
    
    // create a public static method that accepts an Account ID as a parameter and returns a related 
    // list of opportunity records.  also, annotate the method to be available in my LWC.
    @AuraEnabled(cacheable=true)    
    public static List <Opportunity> getOpportunities(String accountId) {


        // create a List to hold the Opp records
        List<Opportunity> opps = new List<Opportunity>();


        //query the database to return the Opp records associated with accountId, and store them in the 
        opps= [SELECT Id,Name, Amount, StageName, CloseDate, IsWon, IsClosed FROM Opportunity
                  WHERE AccountId = :accountId WITH SECURITY_ENFORCED];
    
        // return the list of Opps
        return opps;
   }
}
