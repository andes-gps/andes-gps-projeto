import path from "path";
import url from "url";
import { AndesServices, createAndesServices } from "../src/language/andes-module.js";
import { EmptyFileSystem, URI } from "langium";
import { Model } from "../src/language/generated/ast.js";
import { beforeAll, describe, expect, test } from "vitest";
import { readFileSync } from "fs";


export class TestFactory
{
    private readonly test_name: string;
    private readonly test_description: string;
    private readonly test_file_content: string;
    private readonly service: AndesServices;
    models?: Model;

    public constructor(test_name: string, test_description: string, test_file_name: string = 'teste.andes')
    {
        this.test_name = test_name;
        this.test_description = test_description;

        const filename = url.fileURLToPath(import.meta.url);
        const dirname = path.dirname(filename);
        const test_file_path = path.join(dirname, '..', '..', test_file_name);

        this.test_file_content = readFileSync(test_file_path).toString();

        this.service = createAndesServices(EmptyFileSystem).Andes;
    }

    private async parseDocument(): Promise<Model>
    {
        const document = (
            this.service.
            shared.
            workspace.
            LangiumDocumentFactory.
            fromString<Model>(
                        this.test_file_content,
                        URI.parse('file:test.andes')
            )
        )

        await this.service.shared.workspace.DocumentBuilder.build([document], { validation: true });

        return document.parseResult.value as Model;
    }

    private loadAllModels()
    {
        beforeAll(
            async () =>
            {
                this.models = await this.parseDocument();
                expect(this.models).toBeDefined();
            }
        )
    }

    build(test_function: (arg: Model)=>void): { run: ()=>void }
    {
        return {
            run: () => {
                describe(
                this.test_name,
                    () =>
                    {
                        this.loadAllModels();
                        test(this.test_description, ()=> { test_function(this.models as Model) })
                    }
                )
            }
        }
    }
}

