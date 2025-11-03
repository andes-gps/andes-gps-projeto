grammar Andes
import 'terminals'
import 'helpers'
import 'requirement'
import 'usecase'
import 'entities'

entry Model:    
    
<<<<<<< HEAD
    (   project = Project
        |abstractElement += (AbstractElement | ModuleGroup | UseCaseModel | ModuleImport) 
=======
       (   project = Project
        |UseCase+=UseCase
        |Actor+=Actor
        |AbstractElement+=AbstractElement
        |ModuleGroups+=ModuleGroup
>>>>>>> c56277ba26f1bd16d1d6b538d2c90ca300b4e940
        |Requirements=Requirements
    )*
    (abstractElement +=(AbstractElement | ModuleImport))*
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
    Module | EnumX | ModuleGroup 
;

<<<<<<< HEAD
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
=======
ModuleGroup:
    'modules' name = QualifiedName '{'
        (Description)
        (elements +=(AbstractElement))*
        '}'
;


Module:
    'module' name=QualifiedName '{'
        ( Description 
        | localEntities+=(LocalEntity)
        | enumXs+=(EnumX)
        | modules+= (Module) )*
        (elements +=(AbstractElement | LocalEntity))*
    '}'
; 
>>>>>>> c56277ba26f1bd16d1d6b538d2c90ca300b4e940
