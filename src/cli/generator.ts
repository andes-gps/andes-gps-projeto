import { EnumX, isEnumX, isModule, Module, ProjectModule, type Model } from '../language/generated/ast.js';
import { GenerateOptions } from './main.js';
import { ArtifactApplication } from './artifacts/application.js'
import { MadeApplication } from './made/application.js'
import { SparkApplication } from './spark/application.js';
import path from 'path';

import { ApplicationCreator, ProjectModuleType, ProjectOverviewType, ProjectType } from "andes-lib"
import { translateEnumx, translateModule, translateProjectModule } from './translate-utils.js';

import * as vscode from 'vscode';


function printMessage(msg: string, options: GenerateOptions)
{
    if (options.vscode)
        { vscode.window.showInformationMessage(msg); }
    else
        { console.log(msg); }
}

function printError(msg: string, options: GenerateOptions)
{
    if (options.vscode)
        { vscode.window.showErrorMessage(msg); }
    else
        { console.error(msg); }
}



export function generateJavaScript(model: Model, filePath: string, destination: string | undefined,opts: GenerateOptions): string {
    printMessage("Generating...", opts);
    const final_destination  = extractDestination(filePath, destination);
    const artifactApplication = new ArtifactApplication(model,final_destination);
    const madeApplication = new MadeApplication(model,final_destination); 
    const sparkApplication = new SparkApplication(model,final_destination);

    const overview: ProjectOverviewType = {
        architecture: model.project?.architcture ? model.project.architcture : "python",
        description: model.project?.description ? model.project.description : "",
        name: model.project?.name_fragment ? model.project.name_fragment : "Projeto sem Nome",
        miniwolrd: model.project?.miniworld ? model.project?.miniworld : "Sem Minimundo",
        purpose: model.project?.purpose ? model.project?.purpose : "Sem Propósito",
        identifier: model.project?.id??"",
    }
    
    const packages: any[] = [];

    // debug summary
    console.log('DEBUG: model.AbstractElement count=', (model.AbstractElement ?? []).length);
    console.log('DEBUG: model.projectModule count=', (model.projectModule ?? []).length);
    console.log('DEBUG: model.Actor count=', (model.Actor ?? []).length);

    // debug AbstractElement entries
    for (const [i, e] of (model.AbstractElement ?? []).entries()) {
        console.log(`DEBUG AbstractElement[${i}] name=${(e as any).name ?? '<no-name>'} $type=${(e as any).$type ?? '<no-type>'}`);
        console.log('  keys:', Object.keys(e));
        console.log('  isModule=', isModule(e), ' isEnumX=', isEnumX(e));
        if (isModule(e)) {
            console.log('  -> Module details:', {
                name: (e as Module).name,
                localEntities: (e as Module).localEntities?.length ?? 0,
                enumXs: (e as Module).enumXs?.length ?? 0
            });
            packages.push(translateModule(e as Module));
        } else if (isEnumX(e)) {
            console.log('  -> EnumX details:', { name: (e as EnumX).name, attributes: (e as EnumX).attributes?.length ?? 0 });
            packages.push(translateEnumx(e as EnumX));
        } else {
            console.log('  -> Unhandled AbstractElement type', e);
        }
    }

    // debug ProjectModule entries and their inner abstractElements
    for (const [i, pm] of ((model.projectModule ?? []) as any).entries()) {
        console.log(`DEBUG ProjectModule[${i}] name=${pm.name ?? '<no-name>'} abstractElementCount=${(pm?.abstractElement ?? []).length}`);
        for (const [j, elem] of ((pm?.abstractElement ?? []) as any).entries()) {
            console.log(`  -> abstractElement[${j}] name=${(elem as any).name ?? '<no-name>'} $type=${(elem as any).$type ?? '<no-type>'}`);
            console.log('     keys:', Object.keys(elem));
            console.log('     isModule=', isModule(elem), ' isEnumX=', isEnumX(elem));
        }
        packages.push(translateProjectModule(pm as unknown as ProjectModule));
    }

    // const singleModule: ProjectModuleType = {
    //     actors: model.Actor.map(c => translateActor(c)).filter(obj => obj!=null) as ActorType[],
    //     uc: model.UseCase.map(uc => translateUsecase(uc)) as UseCaseClass[],
    //     description: model.project?.description ? model.project.description : "No Description",
    //     identifier: model.project?.id ? model.project.id : "",
    //     miniwolrd: model.project?.miniworld ? model.project?.miniworld : "Sem Minimundo",
    //     name: model.project?.name_fragment ? model.project.name_fragment : "Projeto sem Nome",
    //     purpose: model.project?.purpose ? model.project?.purpose : "Sem Propósito",
    //     requisites: translateRequirements(model.Requirements),
    //     packages: packages
    //     }

    const modules : ProjectModuleType[] = model.projectModule.map(translateProjectModule);    
    console.log('DEBUG: Translated modules count=', modules.length);
    console.log('DEBUG: Translated modules', modules);
    
    console.log('DEBUG: Overview:', overview);

    const project: ProjectType = {  
        modules: modules,
        overview: overview,
    }


    const app = new ApplicationCreator(project, final_destination);
    
    if(opts.destination == undefined)
    {
        // Some error ocurred and it is simple just overwrite it
        opts.all = true;
    }

    if (opts.only_Documentation)
    { 
        artifactApplication;
        printError("Not Implemented yet", opts);
        return final_destination;
    }

    else if (opts.only_spark)
        { sparkApplication.create() }

    else if (opts.only_made)
        { madeApplication.create() }

    else if (opts.all)
        {  app.create(); }

    printMessage("Successfull Created", opts);
    
    return final_destination;
}

function extractDestination(filePath: string, destination?: string) : string {
    const path_ext = new RegExp(path.extname(filePath)+'$', 'g')
    filePath = filePath.replace(path_ext, '')
  
    return destination ?? path.join(path.dirname(filePath))
}

