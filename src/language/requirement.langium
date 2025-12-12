import 'helpers'
import 'terminals'

type Requirement=(FunctionalRequirement | NonFunctionalRequirement);

Requirements: 
    'requirements' id=ID '{'
        (Name
        |Description
        |fr+=FunctionalRequirement
        |nfr+=NonFunctionalRequirement
        |br+=BussinesRule)*
    '}' 
;  

FunctionalRequirement:
    'functional_requirement' id=ID '{'
        (Description
        |Name
        |Priority 
        |'depend'':' depend= [Requirement:QualifiedName]*(',' depends+=[Requirement:QualifiedName])?  
        )*
    '}'
;

NonFunctionalRequirement:
    'non_functional_requirement' id=ID '{'
        ( Description
        |Name
        |Priority  
        |'depend'':' depend= [Requirement:QualifiedName]*(',' depends+=[Requirement:QualifiedName])?
        )*
    '}'
;

BussinesRule:
    'bussines_rule' id=ID '{'
        ( Description
        |Name
        | Priority 
        | 'depend'':' depend= [Requirement:QualifiedName]*(',' depends+=[Requirement:QualifiedName])?
        )*
    '}'
;