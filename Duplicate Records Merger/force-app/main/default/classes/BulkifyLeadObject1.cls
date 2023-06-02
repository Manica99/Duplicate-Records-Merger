public class BulkifyLeadObject1 {
    
    @AuraEnabled
    public static List<sObject> getDupLeadRecAsPerSelectedName(String selectedName){
        List<sObject> leadList =  [SELECT id, Name, Title, Company, Email, Phone FROM Lead WHERE Name=: selectedName];
        return leadList;
    }
    @AuraEnabled
    public static void handleMerge(List<string> records){
        System.debug('rec==>'+records);
        BulkifyLeadBatch BLB = new BulkifyLeadBatch(new List<String>(),records);
        Database.executeBatch(BLB);
        //BLB.BulkifyLeadBatch();
        /*Id PrimaryId;
        List<sObject> childList;
        List<SObject> toUpsert;
        List<Id> restId = new List<Id>();
        Set<String> SobjectFields = Schema.getGlobalDescribe().get('Lead').getDescribe().fields.getMap().keySet();    
        List<String> fieldsInList = new List<String>(SobjectFields);
        List<sObject> leadList =  Database.query('SELECT ' + String.join(fieldsInList, ',') + ' FROM Lead where Id IN:records order by createdDate desc');
        System.debug('leadList==>'+leadList);
        PrimaryId = leadList[0].id;
        System.debug('Primary Id===>'+PrimaryId);
        for(sObject sObj:leadList){
            if(sObj.id!=PrimaryId){
                restId.add(sObj.id);
            }
        }    
        List<sObject> leadPList =  Database.query('SELECT ' + String.join(fieldsInList, ',') + ' FROM Lead where Id =:PrimaryId order by createdDate desc');
        List<sObject> leadNonPList =  Database.query('SELECT ' + String.join(fieldsInList, ',') + ' FROM Lead where Id IN:restId order by createdDate desc');
        for(Sobject obj1 :leadPList){
            for(Sobject obj2 :leadNonPList){
                //if(obj1.id!=PrimaryId){
                for(String field:fieldsInList){
                    if(Schema.SObjectType.Lead.fields.getMap().get(field).getDescribe().isUpdateable()) {
                        System.debug('Primary Id===>'+leadPList[0].id);
                        if(obj1.get(field)==null){
                            leadPList[0].put(field,obj2.get(field));
                        }
                    }
                }
            }
            
        }
        System.debug('ShowMerge'+leadPList);
        
        
        Map<String, Schema.SobjectType> keys = new Map<String, Schema.SobjectType>();
        Map<String, Schema.SobjectType> describe = Schema.getGlobalDescribe();
        for(String s : describe.keyset()){
            keys.put(describe.get(s).getDescribe().getKeyPrefix(),describe.get(s));
        }
        String objectSelectted = 'Lead';
        String recordId = (String)PrimaryId;
        Schema.SObjectType sobjectTypeObj = keys.get(recordId.substring(0,3)); 
        Schema.DescribeSObjectResult obj11 = sobjectTypeObj.getDescribe();   
        String query = 'select Id, ';
        for (Schema.ChildRelationship cr: obj11.getChildRelationships()){
            if (cr.getRelationshipName() == null) continue;
            if(String.valueOf(cr.getChildSObject())!=objectSelectted){
                Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
                Map<String, Schema.SObjectField> fieldMap = schemaMap.get(String.valueOf(cr.getChildSObject())).getDescribe().fields.getMap();
                String childQuery = 'Select ';
                String childObjField ='';
                String apiNames1 = '';
                Set<String> fieldRelationName  = new Set<String>();
                
                for(String fieldName : fieldMap.keyset() )
                {
                    childObjField = childObjField+fieldName+', ';
                    string datatypeval = String.valueOf(fieldMap.get(fieldName).getDescribe().getType());
                    if(datatypeval == 'REFERENCE' || datatypeval == 'reference'){
                        Schema.DescribeFieldResult f = fieldMap.get(fieldName).getDescribe();
                        string vv = f.getRelationshipName(); 
                        if(vv!=null){
                            if(vv!='MasterRecord')
                            {
                                if(vv.contains(objectSelectted) && vv.contains('Parent')){
                                    vv= fieldName;
                                    apiNames1=apiNames1+vv+', ';
                                    break;
                                }
                                else if(vv.contains(objectSelectted)){
                                    vv= fieldName;
                                    apiNames1=apiNames1+vv+', ';
                                    break;
                                }
                                else if(vv.contains('Parent')){
                                    vv= vv+'.Id';
                                    apiNames1=apiNames1+vv+', ';
                                    break;
                                }
                            }
                        }
                    }
                }
                apiNames1 = apiNames1.removeEnd(', ');
                childObjField = childObjField.removeEnd(', ');                
                if(apiNames1!=''){
                    if (Schema.getGlobalDescribe().get(String.valueOf(cr.getChildSObject())).getDescribe().isCreateable() || Schema.getGlobalDescribe().get(String.valueOf(cr.getChildSObject())).getDescribe().isUpdateable()) {
                        // Create account record
                        List<sObject> sLi = new List<sObject>();
                        childQuery = 'Select '+childObjField+ '  from '+ cr.getChildSObject()+' Where '+apiNames1+' IN: rest';
                        //system.debug('childQuery AccountId ===>:'+childQuery);
                        try{ 
                            sLi = Database.query(childQuery);
                        }
                        catch( QueryException e ) {
                            System.debug( e.getMessage() );
                        }	
                        catch(UnexpectedException e){
                            System.debug( e.getMessage() );
                        }
                        catch(NullPointerException e){
                            System.debug( e.getMessage() );
                        }
                        if(!sLi.isEmpty()){
                            //system.debug('sLi===>:'+sLi);
                            childList = (List<SObject>)Type.ForName('List<' + cr.getChildSObject()  + '>').newInstance();
                            SObjectType objectType = Schema.getGlobalDescribe().get(String.valueOf(cr.getChildSObject())); 
                            Schema.DescribeFieldResult fi = objectType.getDescribe().fields.getMap().get(apiNames1).getDescribe();
                            for(sObject sObj:sLi){
                                if(objectType.getDescribe().fields.getMap().get(apiNames1).getDescribe().isUpdateable()){
                                    sObj.put(apiNames1,PrimaryId);
                                    childList.add(sObj);
                                }
                            }
                        }
                        else{
                            continue;
                        }
                        if(childList.size()>0){
                            //system.debug('toUpserttttt Child Recordddd:'+childList);
                            update childList;
                        }
                    }
                } 
            }
        }
        
        update leadPList;
        delete leadNonPList;*/
        //return 'Success';
    }
    
    
    @AuraEnabled
    public static String handleAllMerge(List<String> listName,Integer pageSize){
        System.debug('rec==>ALL MERGE');
        System.debug('rec==>ALL MERGE=='+listName.size());
        BulkifyLeadBatch BLB = new BulkifyLeadBatch(listName,new List<String>());
        Database.executeBatch(BLB);
        /*String PrimaryIds = '';
        Set<Id> restId = new Set<Id>();
        Set<Id> PrimaryIdSet = new Set<Id>();
        List<sObject> leadAllPrimeList = new List<sObject>();
        List<sObject> leadAllList = new List<sObject>();
        Set<String> SobjectFields = Schema.getGlobalDescribe().get('Lead').getDescribe().fields.getMap().keySet();    
        List<String> fieldsInList = new List<String>(SobjectFields);
        String queryPrime='';
        String query ='SELECT ' + String.join(fieldsInList, ',') + ' FROM Lead where Name IN: listName';
        System.debug('query==>'+query);
        leadAllList = Database.query(query);
        System.debug('rec==>'+leadAllList.size());
        System.debug('rec==>'+leadAllList);
        for(Integer i=0;i<pageSize;i++){
            String stringName = listName[i];
            //system.debug('String Name==>'+stringName);
            queryPrime = 'SELECT ' + String.join(fieldsInList, ',') + ' FROM Lead where Name =:stringName order by createdDate desc Limit 1';
            leadAllPrimeList.add(Database.query(queryPrime));
        } 
        
        for(sObject sObj:leadAllPrimeList){
            PrimaryIds+=sObj.Id+', ';
            PrimaryIdSet.add(sObj.Id);
        }
        PrimaryIds.removeEnd(', ');
        for(sObject sObj:leadAllList){
            if(!PrimaryIds.contains(sObj.id)){
                restId.add(sObj.id);
            }
        }
        
        List<sObject> leadPList =  Database.query('SELECT ' + String.join(fieldsInList, ',') + ' FROM Lead where Id =:PrimaryIdSet order by createdDate desc');
        List<sObject> leadNonPList =  Database.query('SELECT ' + String.join(fieldsInList, ',') + ' FROM Lead where Id IN:restId order by createdDate desc');
        for(Integer i=0;i<leadPList.size();i++){
            for(Sobject obj2 :leadNonPList){
                //System.debug('obj1.get Name===>'+leadPList[i].get('Name'));
                if(leadPList[i].get('Name')==obj2.get('Name')){
                //if(obj1.id!=PrimaryId){
                //System.debug('Found');
                    for(String field:fieldsInList){
                        if(Schema.SObjectType.Lead.fields.getMap().get(field).getDescribe().isUpdateable()) {
                            //System.debug('Primary Id===>'+leadPList[i].id);
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
        update leadPList;
		delete leadNonPList;*/
        
        //List<sObject> leadList =  Database.query('SELECT ' + String.join(fieldsInList, ',') + ' FROM Lead where Id NOT IN:PrimaryIds and Name IN: listName');
        //System.debug('leadList==>'+leadList);
        //System.debug('leadList Size==>'+leadList.size());
        
        /* Id PrimaryId;
List<sObject> childList;
List<SObject> toUpsert;
List<Id> restId = new List<Id>();
Set<String> SobjectFields = Schema.getGlobalDescribe().get('Lead').getDescribe().fields.getMap().keySet();    
List<String> fieldsInList = new List<String>(SobjectFields);
List<sObject> leadList =  Database.query('SELECT ' + String.join(fieldsInList, ',') + ' FROM Lead where Id IN:records order by createdDate desc');
System.debug('leadList==>'+leadList);
PrimaryId = leadList[0].id;
System.debug('Primary Id===>'+PrimaryId);
for(sObject sObj:leadList){
if(sObj.id!=PrimaryId){
restId.add(sObj.id);
}
}    
List<sObject> leadPList =  Database.query('SELECT ' + String.join(fieldsInList, ',') + ' FROM Lead where Id =:PrimaryId order by createdDate desc');
List<sObject> leadNonPList =  Database.query('SELECT ' + String.join(fieldsInList, ',') + ' FROM Lead where Id IN:restId order by createdDate desc');
for(Sobject obj1 :leadPList){
for(Sobject obj2 :leadNonPList){
//if(obj1.id!=PrimaryId){
for(String field:fieldsInList){
if(Schema.SObjectType.Lead.fields.getMap().get(field).getDescribe().isUpdateable()) {
System.debug('Primary Id===>'+leadPList[0].id);
if(obj1.get(field)==null){
leadPList[0].put(field,obj2.get(field));
}
}
}
}

}
System.debug('ShowMerge'+leadPList);


Map<String, Schema.SobjectType> keys = new Map<String, Schema.SobjectType>();
Map<String, Schema.SobjectType> describe = Schema.getGlobalDescribe();
for(String s : describe.keyset()){
keys.put(describe.get(s).getDescribe().getKeyPrefix(),describe.get(s));
}
String objectSelectted = 'Lead';
String recordId = (String)PrimaryId;
Schema.SObjectType sobjectTypeObj = keys.get(recordId.substring(0,3)); 
Schema.DescribeSObjectResult obj11 = sobjectTypeObj.getDescribe();   
String query = 'select Id, ';
for (Schema.ChildRelationship cr: obj11.getChildRelationships()){
if (cr.getRelationshipName() == null) continue;
if(String.valueOf(cr.getChildSObject())!=objectSelectted){
Map<String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
Map<String, Schema.SObjectField> fieldMap = schemaMap.get(String.valueOf(cr.getChildSObject())).getDescribe().fields.getMap();
String childQuery = 'Select ';
String childObjField ='';
String apiNames1 = '';
Set<String> fieldRelationName  = new Set<String>();

for(String fieldName : fieldMap.keyset() )
{
childObjField = childObjField+fieldName+', ';
string datatypeval = String.valueOf(fieldMap.get(fieldName).getDescribe().getType());
if(datatypeval == 'REFERENCE' || datatypeval == 'reference'){
Schema.DescribeFieldResult f = fieldMap.get(fieldName).getDescribe();
string vv = f.getRelationshipName(); 
if(vv!=null){
if(vv!='MasterRecord')
{
if(vv.contains(objectSelectted) && vv.contains('Parent')){
vv= fieldName;
apiNames1=apiNames1+vv+', ';
break;
}
else if(vv.contains(objectSelectted)){
vv= fieldName;
apiNames1=apiNames1+vv+', ';
break;
}
else if(vv.contains('Parent')){
vv= vv+'.Id';
apiNames1=apiNames1+vv+', ';
break;
}
}
}
}
}
apiNames1 = apiNames1.removeEnd(', ');
childObjField = childObjField.removeEnd(', ');                
if( apiNames1!=''){
if (Schema.getGlobalDescribe().get(String.valueOf(cr.getChildSObject())).getDescribe().isCreateable() || Schema.getGlobalDescribe().get(String.valueOf(cr.getChildSObject())).getDescribe().isUpdateable()) {
// Create account record
List<sObject> sLi = new List<sObject>();
childQuery = 'Select '+childObjField+ '  from '+ cr.getChildSObject()+' Where '+apiNames1+' IN: rest';
//system.debug('childQuery AccountId ===>:'+childQuery);
try{ 
sLi = Database.query(childQuery);
}
catch( QueryException e ) {
System.debug( e.getMessage() );
}	
catch(UnexpectedException e){
System.debug( e.getMessage() );
}
catch(NullPointerException e){
System.debug( e.getMessage() );
}
if(!sLi.isEmpty()){
//system.debug('sLi===>:'+sLi);
childList = (List<SObject>)Type.ForName('List<' + cr.getChildSObject()  + '>').newInstance();
SObjectType objectType = Schema.getGlobalDescribe().get(String.valueOf(cr.getChildSObject())); 
Schema.DescribeFieldResult fi = objectType.getDescribe().fields.getMap().get(apiNames1).getDescribe();
for(sObject sObj:sLi){
if(objectType.getDescribe().fields.getMap().get(apiNames1).getDescribe().isUpdateable()){
sObj.put(apiNames1,PrimaryId);
childList.add(sObj);
}
}
}
else{
continue;
}
if(childList.size()>0){
//system.debug('toUpserttttt Child Recordddd:'+childList);
update childList;
}
}
} 
}
}

update leadPList;
delete leadNonPList;*/
        return 'Success';
    }
    
    
    @AuraEnabled
    public static productWrapper getFieldValues(){
        String displayQuery = 'Select ';
        Map<String, String> fieldMap = new map<String, String>();
        String displayFields;
        for(BulkList_Product_Settings__mdt l_mdt : BulkList_Product_Settings__mdt.getAll().values()){
            Map<String, Schema.SObjectField> MapofField = Schema.getGlobalDescribe().get(l_mdt.Object_API_Name__c).getDescribe().fields.getMap();
            System.debug('MapofField-->'+ MapofField);
            if(l_mdt.DeveloperName == 'Lead'){
                displayQuery += l_mdt.Display_Fields__c + ',';
                displayFields = l_mdt.Display_Fields__c;
                for(String fieldName : MapofField.keyset()){
                    if(l_mdt.Display_Fields__c.contains(',')){
                        for(string s : l_mdt.Display_Fields__c.split(',')){
                            if(s.trim() == fieldName){
                                fieldMap.put(s.trim(),MapofField.get(fieldName).getDescribe().getLabel() + ',' + MapofField.get(fieldName).getDescribe().getType());
                            }
                        }
                    }
                    else{
                        if(l_mdt.Display_Fields__c.trim() == fieldName){
                            fieldMap.put(l_mdt.Display_Fields__c.trim(),MapofField.get(fieldName).getDescribe().getLabel() + ',' + MapofField.get(fieldName).getDescribe().getType());
                        }
                    }
                }
            }
        }
        //String displayQuery2 = displayQuery + ' Id From Lead Where Name In :lstRecords';
        displayQuery += ' COUNT(Id) From Lead WHERE Name!= null GROUP BY '+ displayFields +' HAVING COUNT(Id) > 1';
        
        //System.debug('displayQuery-->'+ displayQuery2);
        System.debug('Query-->'+ displayQuery);
        System.debug('fieldMap-->'+ fieldMap);
        List<sObject> lstRecords = Database.query(displayQuery);
        System.debug('lstRecords-->'+ lstRecords);
        //List<sobject> listofRecords = Database.query(displayQuery2);
        //System.debug('List of records-->'+ listofRecords);
        
        productWrapper pw = new productWrapper();
        pw.fieldMap = fieldMap;
        pw.recordList = lstRecords;
        System.debug('pw-->'+ pw);
        return pw;
    }
}