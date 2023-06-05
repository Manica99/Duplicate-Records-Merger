public class ConfigurationSettings {
    
    @AuraEnabled
    public static List<String> getObject(String obj){
        system.debug('obj--->'+ obj);
        List<String> stdObjectNames = new List<String>();
        //String objectName = '';
        Map<String, Schema.SObjectType> gd =  Schema.getGlobalDescribe();
        for(Schema.SObjectType stype: gd.values()){
            String sobjName = String.valueOf(stype).toLowerCase();
            //system.debug('sObj-->'+ sobjName);
            if (!sobjName.contains('__c')){
                if(sobjName.contains(obj.toLowerCase()))
                {
                    stdObjectNames.add(sobjName);
                }
            }
        }
        system.debug('stdObjectNames-->'+ stdObjectNames);
        return stdObjectNames;
    }
    
    @AuraEnabled
     public static List<string> getFields(String obj){
        List<String> reqFields = new List<String>();
        Map <String,Schema.SObjectType> gd = Schema.getGlobalDescribe();
        Schema.SObjectType sobjType = gd.get(obj);
        Schema.DescribeSObjectResult r = sobjType.getDescribe();
        Map<String, Schema.SObjectField> MapofField = r.fields.getMap();
        
        for(String fieldName : MapofField.keySet()) {
            Schema.SObjectField field = MapofField.get(fieldName);
            Schema.DescribeFieldResult F = field.getDescribe();
            System.debug('field-->'+field);
            System.debug('F-->'+F.getType()); //type of field
	        reqFields.add(String.valueOf(field));
        }
        System.debug(reqFields);
        return reqFields;
    }
    
}