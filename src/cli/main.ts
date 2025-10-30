import type { Model } from '../language/generated/ast.js';
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

