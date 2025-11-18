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
        |ModuleImport+=ModuleImport
        |projectModule += ProjectModule
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

ProjectModule:
    'projectModule' name=QualifiedName '{'
        (    project = Project 
            | Requirements=Requirements
            | UseCase += UseCase
            | Actor += Actor
            | Module += Module
            | EnumX += EnumX
        )*
    '}'
;

AbstractElement:
    Module | EnumX  
;

Module:
    'sparkModule' name=QualifiedName '{'
        ( Description 
        | localEntities+=(LocalEntity)
        | enumXs+=(EnumX)
        | modules+= (AbstractElement)
        )*
    '}'
; 