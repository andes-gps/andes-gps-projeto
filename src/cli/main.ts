import { EnumX, isEnumX, isModule, Module, type Model } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { AndesLanguageMetaData } from '../language/generated/module.js';
import { createAndesServices } from '../language/andes-module.js';
import { extractAstNode } from './cli-util.js';
import { generateJavaScript } from './generator.js';
import { NodeFileSystem } from 'langium/node';

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createAndesServices(NodeFileSystem).Andes;
    const model = await extractAstNode<Model>(fileName, services);
    const generatedFilePath = generateJavaScript(model, fileName, opts.destination, opts);
    console.log(chalk.green(`Andes done: ${generatedFilePath}`));

    const allAbstract = model.AbstractElement ?? [];
    const moduleNames = allAbstract.filter(isModule).map(m => (m as Module).name ?? "<no-name>");
    const enumNames = allAbstract.filter(isEnumX).map(e => (e as EnumX).name ?? "<no-name>");
    const projectModuleNames = (model.projectModule ?? []).map(pm => pm.name ?? "<no-name>");
    const actorNames = (model.Actor ?? []).map(a => (a as any).name ?? "<no-name>");
    const usecaseNames = (model.UseCase ?? []).map(u => (u as any).name_fragment ?? (u as any).name ?? "<no-name>");

    console.log(`Resumo do modelo: AbstractElements=${allAbstract.length} (modules=${moduleNames.length}, enums=${enumNames.length})`);
    console.log(`Modules: ${moduleNames.join(', ') || "<nenhum>"}`);
    console.log(`Enums: ${enumNames.join(', ') || "<nenhum>"}`);
    console.log(`ProjectModules: ${projectModuleNames.join(', ') || "<nenhum>"}`);
    console.log(`Actors: ${actorNames.join(', ') || "<nenhum>"}`);
    console.log(`UseCases: ${usecaseNames.join(', ') || "<nenhum>"}`);

    console.log("=== Debug Model Structure ===");
    console.log("Model:", {
        abstractElementCount: model.AbstractElement?.length || 0,
        projectModuleCount: model.projectModule?.length || 0,
        abstractElements: model.AbstractElement?.map(e => ({
            type: e.$type,
            name: (e as any).name,
            contents: e
        })),
        projectModules: model.projectModule?.map(pm => ({
            name: pm.name,
            abstractElements: pm.abstractElements?.length || 0,
            contents: pm.abstractElements
        }))
    });

};

export type GenerateOptions = {
    destination?: string;
    only_Documentation?:boolean;
    only_spark?:boolean;
    only_made?:boolean;
    all?:boolean;
    vscode?:boolean;
}

export default function(): void {
    const program = new Command();

    // program.version(require('../../package.json').version);

    const fileExtensions = AndesLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates JavaScript code that prints "Hello, {name}!" for each greeting in a source file')
        .action(generateAction);

    program.parse(process.argv);
}

