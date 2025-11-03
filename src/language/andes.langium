grammar Andes
import 'terminals'
import 'helpers'
import 'requirement'
import 'usecase'
import 'entities'

entry Model:    
    
    (   project = Project
        |abstractElement += (AbstractElement | ModuleGroup | UseCaseModel | ModuleImport) 
        |Requirements=Requirements
    )*
;

Project:
        'overview' id=ID '{'
            (  Name
               |Description
               |'purpose' ':' purpose= STRING
               |'miniworld' ':' miniworld= STRING
               |'Architecture'':' architcture=Architecture
            )* 
        '}'
;

AbstractElement:
    Module | EnumX  
;

UseCaseElements:
    UseCase | Actor 
;

UseCaseModel:
    'usModel' id =QualifiedName '{'
        (elements += UseCaseElements)*   
    '}'
;
Module:
    'module' name=QualifiedName '{'
        ( Description 
        | elements +=( AbstractElement | LocalEntity)
        )*
    '}'
; 

ModuleGroup:
    'modules' name=QualifiedName '{'
        (Description
        | AbstractElement+= (AbstractElement | ModuleImport)
        | modules += Module)*
        '}'
;