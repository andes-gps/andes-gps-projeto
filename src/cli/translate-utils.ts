import { BussinesRule, FunctionalRequirement, isFunctionalRequirement, NonFunctionalRequirement, LocalEntity, Attribute, EnumX, EnumEntityAtribute, Relation, isOneToOne, isManyToOne, isOneToMany, Module, ProjectModule, isEnumX, isLocalEntity, isModule } from "../language/generated/ast.js";
import { AttributeType, EntityType, EnumAttributeType, EnumEntityType, PackageType, RelationType } from "andes-lib";


export function translateEnumx(enumX: EnumX): EnumEntityType
{
    return {
        identifier: enumX.name,
        description: enumX.comment,
        options: enumX.attributes.map(option => option.name),
    }
}


export function translateLocalEntity(entity: LocalEntity): EntityType
{
    return {
        identifier: entity.name,
        attributes: entity.attributes.map(attr => translateAttribute(attr)),
        enums: entity.enumentityatributes.map(e => translateEnumEntityAttribute(e)),
        relationsAttr: entity.relations.map(r => translateRelation(r)),
        description: entity.comment,
    }
}


export function translateAttribute(attr: Attribute): AttributeType
{
    return {
        type: attr.type,
        blank: false,
        identifier: attr.name,
        unique: attr.unique,
        max: attr.max,
        min: attr.min
    }
}

export function translateEnumEntityAttribute(eea: EnumEntityAtribute): EnumAttributeType
{
    return {
        identifier: eea.name,
        type: {identifier: eea.type.$refText, options: []},
        description: eea.comment,
    }
}

export function translateRelation(rel: Relation): RelationType
{
    let relationType = "";

    if (isOneToOne(rel))
        { relationType = "OneToOne" }
    else if (isOneToMany(rel))
        { relationType = "OneToMany"; }
    else if (isManyToOne(rel))
        { relationType = "ManyToOne"; }
    else
        { relationType = "ManyToMany" } 

    return {
        identifier: rel.name,
        description: rel.comment,
        relationType: relationType,
        targetObject: { identifier: rel.type.$refText }
    }
}

export function translateModule(module: Module): PackageType
{
    return {
        identifier: module.name,
        description: module.description??"",
        entities: module.localEntities.map(translateLocalEntity),
        enums: module.enumXs.map(translateEnumx),
    }
}


export function translateFR(fr: FunctionalRequirement): FunctionalRequirement {
        // @ts-ignore
    const id = fr.id
        // @ts-ignore
    const priority = fr.priority ?? ""
        // @ts-ignore
    const description = fr.description ?? ""

    //@ts-ignore
    fr.depend = {name: fr.depend?.$refText??""};

    //@ts-ignore
    fr.depends = [fr.depend];

    return fr
}

export function translateNFR(nfr: NonFunctionalRequirement): NonFunctionalRequirement {
        // @ts-ignore
    const id = nfr.id
        // @ts-ignore
    const priority = nfr.priority ?? ""
        // @ts-ignore
    const description = nfr.description ?? ""

        // @ts-ignore
    var depend: FunctionalRequirement | NonFunctionalRequirement | undefined = undefined
    if (nfr.depend?.ref) {
        if (isFunctionalRequirement(nfr.depend.ref)) depend = translateFR(nfr.depend.ref)
        else depend = translateNFR(nfr.depend.ref);
    }

    const depends = []
    for (const dep of nfr.depends) {
        const ref_temp = dep.ref
        if (ref_temp) {
            if (isFunctionalRequirement(ref_temp)) depends.push(translateFR(ref_temp));
            else depends.push(translateNFR(ref_temp));
        }
    }

    return nfr
}

export function translateBR(br: BussinesRule): BussinesRule {
        // @ts-ignore
    const id = br.id
        // @ts-ignore
    const priority = br.priority ?? ""
        // @ts-ignore
    const description = br.description ?? ""

        // @ts-ignore
    var depend: FunctionalRequirement | NonFunctionalRequirement | undefined = undefined
    if (br.depend?.ref) {
        if (isFunctionalRequirement(br.depend.ref)) depend = translateFR(br.depend.ref)
        else depend = translateNFR(br.depend.ref);
    }

    const depends = []
    for (const dep of br.depends) {
        const ref_temp = dep.ref
        if (ref_temp) {
            if (isFunctionalRequirement(ref_temp)) depends.push(translateFR(ref_temp));
            else depends.push(translateNFR(ref_temp));
        }
    }

    return br
}

export function translateProjectModule(projectModule: ProjectModule): PackageType {
    const packages: PackageType[] = [];
    const entities: EntityType[] = [];
    const enums: EnumEntityType[] = [];

    for (const elem of projectModule.abstractElements ?? []) {
        if (isModule(elem)) {
            packages.push(translateModule(elem as Module));
        } else if (isLocalEntity(elem)) {
            entities.push(translateLocalEntity(elem as LocalEntity));
        } else if (isEnumX(elem)) {
            enums.push(translateEnumx(elem as EnumX));
        }
    }

    return {
        identifier: projectModule.name,
        description: projectModule.description ?? "",
        packages: packages,
        entities,
        enums,
    } as unknown as PackageType;
}


// export function translateAttrEnum(attrEnum: AttributeEnum): AttributeEnum {
//     const name = attrEnum.name
//     const fullName = attrEnum.fullName ?? ""
//     const comment = attrEnum.comment ?? ""
    
//     return attrEnum
// }

// Entity
// export function translateLocalEntity(localEntity: LocalEntity): LocalEntity {
//         // @ts-ignore
//     const name = localEntity.name

//     const attributes = []
//     for (const attr of localEntity.attributes) attributes.push(translateAttribute(attr))
    
//     const enumEntityAtributes = []
//     for (const eea of localEntity.enumentityatributes) enumEntityAtributes.push(translateEnumEntityAttribute(eea))
    
//     const functions = []
//     for (const func of localEntity.functions) functions.push(translateFunction(func))

//     const relations = []
//     for (const rel of localEntity.relations) relations.push(translateRelation(rel))

//         // @ts-ignore
//     const isAbstract = localEntity.is_abstract

//         // @ts-ignore
//     var superType: LocalEntity | ImportedEntity | undefined
//     const ref_temp = localEntity.superType?.ref
//     if (ref_temp) {
//         if (isLocalEntity(ref_temp)) superType = translateLocalEntity(ref_temp)
//         else if (isImportedEntity(ref_temp)) superType = translateImportedEntity(ref_temp)
//     }
//     else superType = undefined
    
//         // @ts-ignore
//     const comment = localEntity.comment ?? ""

//     return localEntity
// }

// export function translateImportedEntity(importEntity: ImportedEntity): ImportedEntity {
//         // @ts-ignore
//     const name = importEntity.name

//     return importEntity
// }

// export function translateFunction(func: FunctionEntity): FunctionEntity {
//         // @ts-ignore
//     const name = func.name

//     const paramters = []
//     for (const par of func.paramters) {
//         if (isElement(par)) paramters.push(translateElement(par));
//         else if (Array.isArray(par)) for (const elem of par) paramters.push(translateElement(elem));
//     }

//         // @ts-ignore
//     const response = func.response.toString()

//         // @ts-ignore
//     const comment = func.comment ?? ""

//     return func
// }

// export function translateElement(elem: Element): Element {
//         // @ts-ignore
//     const name =  elem.name
//         // @ts-ignore
//     const type = elem.type.toString()
    
//     return elem
// }

// export function translateModuleImport(moduleImport: ModuleImport): ModuleImport {
//         // @ts-ignore
//     const name = moduleImport.name
//         // @ts-ignore
//     const package_path = moduleImport.package_path
//         // @ts-ignore
//     const library = moduleImport.library

//     const entities = []
//     for (const ent of moduleImport.entities) entities.push(translateImportedEntity(ent));

//     return moduleImport
// }

// export function translateBrToBrC(br: BussinesRule): BuisinesRuleClass
// {
//     return new BuisinesRuleClass(br.id, br.description);
// }


// export function translateFrToFrC(fr: FunctionalRequirement): FunctionalRequirementClass
// { 
//     // @ts-ignore
//     const aux = fr.depends?.map(d => translateFrToFrC(d));
//     if(aux)
//     {
//         console.log("FR ID:", fr.id);
//     // @ts-ignore
//     return new FunctionalRequirementClass(fr.id, fr.priority?? "", fr.description, aux);
//     }
//     return new FunctionalRequirementClass(fr.id, fr.priority?? "", fr.description, []);
// }

// export function translateNfrToNfrC(nfr: NonFunctionalRequirement): NonFunctionalRequirementClass
// {
//     return new NonFunctionalRequirementClass(nfr.id, nfr.description);
// }