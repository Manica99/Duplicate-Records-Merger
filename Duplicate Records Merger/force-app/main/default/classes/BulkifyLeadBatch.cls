public class BulkifyLeadBatch implements Database.Batchable<sObject>, Database.Stateful{
    public string query='';
    Public String PrimaryIds = '';
    Public Set<Id> restId = new Set<Id>();
    public String leadField;
    Public List<String> listId = new List<String>();
    Public List<String> listName = new List<String>();
    Public Set<Id> PrimaryIdSet = new Set<Id>();
    Public List<sObject> leadAllPrimeList = new List<sObject>();
    Public List<sObject> leadAllList = new List<sObject>();
    public List<String> listRecords;
    
    public BulkifyLeadBatch(List<String> listNames, List<String> listIds){
        System.debug('------------BATCH CALL------------');
        SYSTEM.debug('List Name==='+listIds);
        this.listId = listIds;
        this.listName = listNames;
        Set<String> SobjectFields = Schema.getGlobalDescribe().get('Lead').getDescribe().fields.getMap().keySet();    
        List<String> fieldsInList = new List<String>(SobjectFields);
        this.leadField = String.join(fieldsInList, ',');
        if(listIds!=null && listIds.size()>0){
            query+= 'SELECT ' + String.join(fieldsInList, ',') + ' FROM Lead where Id IN: listId order by createdDate desc';
        }
        if(listName!=null && listName.size()>0){
            query+='SELECT ' + String.join(fieldsInList, ',') + ' FROM Lead where Name IN: listName';
        }
        System.debug('query==>'+query);
    }
    public Database.QueryLocator start(Database.BatchableContext BC)
    {
        System.debug('Start');
        System.debug('Start query--->'+query);
        return Database.getQueryLocator(query); 
    }
    public void execute(Database.BatchableContext BC, List<sObject> scope)
    {
        System.debug('execute Method');
        System.debug('execute Method===>'+scope);
        String queryPrime = '';
        //for(sObject lead:scope){
        for(Integer i=0;i<scope.size();i++){
            Id leadId = scope[i].Id;
            System.debug('leadId===>'+leadId);
            String leadName = JSON.serialize(scope[i].get('Name'));
            leadName = leadName.removeStart('"');
            leadName = leadName.removeEnd('"');
            System.debug('leadName===>'+leadName);
            queryPrime = 'SELECT '+ leadField + ' FROM Lead where Name =: leadName order by createdDate desc Limit 1';
            leadAllPrimeList.add(Database.query(queryPrime));
        }
        for(sObject sObj:leadAllPrimeList){
            PrimaryIds+=sObj.Id+', ';
            PrimaryIdSet.add(sObj.Id);
        }
        System.debug('PrimaryIdSet===>'+PrimaryIdSet);
        System.debug('PrimaryIdSet===>'+PrimaryIdSet.size());
        PrimaryIds.removeEnd(', ');
        for(sObject sObj:scope){
            if(!PrimaryIds.contains(sObj.id)){
                restId.add(sObj.id);
            }
        }
        System.debug('restId===>'+restId);
        System.debug('PrimaryIdSet===>'+PrimaryIdSet.size());
        List<sObject> leadPList =  Database.query('SELECT ' +leadField+ ' FROM Lead where Id IN: PrimaryIdSet order by createdDate desc');
        List<sObject> leadNonPList =  Database.query('SELECT ' +leadField+ ' FROM Lead where Id IN:restId order by createdDate desc');
        Set<String> SobjectFields = Schema.getGlobalDescribe().get('Lead').getDescribe().fields.getMap().keySet();    
        List<String> fieldsInList = new List<String>(SobjectFields);
        for(Integer i=0;i<leadPList.size();i++){
            for(Sobject obj2 :leadNonPList){
                if(leadPList[i].get('Name')==obj2.get('Name')){
                    for(String field:fieldsInList){
                        if(Schema.SObjectType.Lead.fields.getMap().get(field).getDescribe().isUpdateable()) {
                            if(leadPList[i].get(field)==null){
                                leadPList[i].put(field,obj2.get(field));
                            }
                        }
                    }
                }
            }
        }
        System.debug('ShowMerge'+leadPList);
        System.debug('leadNonPList'+leadNonPList);
        //update leadPList;
        //delete leadNonPList;
        
    }
    public void finish(Database.BatchableContext BC) {
    }
}