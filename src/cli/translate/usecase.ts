import { ActorType, UseCaseClass } from "andes-lib";
import { isRequirement, Requirement, UseCase } from "../../language/generated/ast.js";
import { translateActor } from "./actor.js";
import { translateEvent } from "./event.js";
import { translateRequirement } from "./requiriment.js";


export function translateUsecase(usecase: UseCase, ucStack: UseCaseClass[] = []): UseCaseClass
{
    const uc = ucStack.find(u => u.identifier == usecase.id);
    if(uc != null)
        { return uc; }

    const all_uc_requiriment: Requirement[] = [usecase.requirement?.ref, ...usecase.requirements.map(obj => obj.ref)].filter(obj => (obj!=undefined && obj!=null && isRequirement(obj))) as Requirement[];
    const all_uc_dependencies: UseCase[] = [usecase.depend?.ref, ...usecase.depends.map(obj => obj.ref)].filter(obj => obj != undefined) as UseCase[];

    const aux = new UseCaseClass(
        usecase.id,
        usecase.name_fragment??'',
        usecase.description,
        all_uc_requiriment.map((req)=>translateRequirement(req)),
        usecase.actors.map(obj => translateActor(obj.ref)).filter(obj => obj!=null) as ActorType[],
        [],
        all_uc_dependencies.map((dependencie) => translateUsecase(dependencie, ucStack))
    )

    usecase.events.forEach(e => aux.event?.push(translateEvent(e, aux)))
    ucStack.push(aux);

    return aux;
}

