grammar Andes
import 'terminals'
import 'helpers'
import 'requirement'
import 'usecase'
import 'entities'
import 'config'

entry Model:    
    
    (   project = Project
        |abstractElement += (AbstractElement | UseCaseModel | ModuleImport) 
        |Requirements=Requirements
    )*
    (configuration = Configuration)?
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
