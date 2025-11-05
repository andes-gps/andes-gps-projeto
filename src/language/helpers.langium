import 'terminals'

QualifiedName returns string:
    ID ('.' ID)*
;

QualifiedNameWithWildcard returns string:
    QualifiedName '.*'?
;

fragment Description:
    'description' ':' description=STRING
;
fragment Name:
    'name' ':' name_fragment=STRING
;
fragment Priority:
    'priority' ':' priority=STRING
;

fragment Comment:
     comment = (SL_COMMENT |ML_COMMENT)
;

Architecture returns string:
    ('python'|'java'|'csharp-minimal-api'|'csharp-clean-architecture'|'charp-pipeline')
;

DATATYPE returns string:
    ('string'|'integer'|'decimal'|'datetime'|'date'|'boolean'|'uuid'| 'email'| 'cpf'|'cnpj'|'zipcode'|'currency'|'mobilePhoneNumber'|'phoneNumber'| 'file'|'void')
;


LANGUAGETYPE returns string:
    ('python'|'java'|'csharp-minimal-api'|'csharp-clean-architecture')
;


FEATURE_TYPE returns string:
    ('authentication')
;