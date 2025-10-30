import { isUseCase, Model, UseCase } from "../src/language/generated/ast.js";
import { TestFactory } from "./utils.js";


function printUc(usecase: UseCase)
{
    console.log(usecase.id, usecase.depend?.ref?.id, usecase.depends.map(depend => depend.ref?.id));
}

function mytest(model?: Model)
{
    model?.UseCase.filter(isUseCase).forEach(printUc)
}


new TestFactory("simple_test", "simple descrption").build(mytest).run()

