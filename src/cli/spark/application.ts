import {  EnumX, LocalEntity, Model, isModule } from "../../language/generated/ast.js"
import fs from "fs";
import path from 'path'
import { createPath } from "../generator-utils.js";
import {  expandToStringWithNL } from "langium/generate";

export class SparkApplication {
    model: Model
    target_folder:string
    SPARK_PATH: string
   
    constructor (model: Model, target_folder:string){
        this.model = model
        this.target_folder = target_folder  
        
        fs.mkdirSync(this.target_folder, {recursive:true})        
        this.SPARK_PATH = createPath(this.target_folder,'spark') 
    }

    public create(){
        
        const project = this.model.project?.id.toLocaleLowerCase() ?? "file"
        fs.writeFileSync(path.join(this.SPARK_PATH , `${project}.spark`), this.createspark())
    
    }

    private createspark(): string {
    const project = this.model.project;
    const modules = this.model.AbstractElement.filter(isModule);

    return expandToStringWithNL`
        Configuration {
            software_name: "${project?.name_fragment ?? "Name"}"
            about: "${project?.description}"
            language: ${project?.architcture ?? "java"}
        }

        ${modules.map(module => expandToStringWithNL`
            sparkModule ${module.name} {
                ${module.localEntities.map(localEntity => this.createEntity(localEntity)).join('\n\n')}
                ${module.enumXs.map(enumX => this.createEnum(enumX)).join('\n\n')}
            }
        `).join('\n\n')}
    `;
}

    private createEntity(entity: LocalEntity): string {
    return expandToStringWithNL`
        ${entity.is_abstract ? "abstract " : ""}entity ${entity.name}${entity.superType ? ` extends ${entity.superType.ref?.name}` : ""} {
            ${entity.attributes.map(attr => `${attr.name}: ${attr.type}`).join('\n')}
            ${entity.enumentityatributes.map(attr => `${attr.name} uses ${attr.type.ref?.name}`).join('\n')}
            ${entity.functions.map(fn => `fun ${fn.name} (${fn.paramters.map(p => p.element).join(', ')}): ${fn.response}`).join('\n')}
            ${entity.relations.map(rel => `${rel.name} ${rel.$type} ${rel.type.ref?.name}`).join('\n')}
        }
    `;
}

private createEnum(enumx: EnumX): string {
    return expandToStringWithNL`
        enum ${enumx.name} {
            ${enumx.attributes.map(attr => attr.name).join('\n')}
        }
    `;
}

}