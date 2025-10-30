grammar Andes
import 'terminals'
import 'helpers'
import 'requirement'
import 'usecase'
import 'entities'

entry Model:    
    
       (   project = Project)
       (abtractElement+=( AbstractElement | ModuleImport | UseCaseElements)
       | Requirements= Requirements)*
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

Module:
    'module' name=QualifiedName '{'
        ( Description)
        (elements+=(AbstractElement | LocalEntity))*
    '}'
; 
