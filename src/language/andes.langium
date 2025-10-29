grammar Andes
import 'terminals'
import 'helpers'
import 'requirement'
import 'usecase'
import 'entities'

entry Model:    
    
    (   project = Project
        |UseCase+=UseCase
        |Actor+=Actor
        |AbstractElement+=AbstractElement
        |ModuleGroups+=ModuleGroup
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

ModuleGroup:
    'modules' name=QualifiedName '{'
    (Description)
    (elements+=(Module))*
    '}'
;

Module:
    'module' name=QualifiedName '{'
        ( Description 
        | localEntities+=(LocalEntity)
        | enumXs+=(EnumX)
        | modules+= (Module)
        )*
    '}'
; 