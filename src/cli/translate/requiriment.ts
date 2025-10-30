import { RequirimentAgregationClass, RequirimentsBaseClass } from "andes-lib";
import { BussinesRule, FunctionalRequirement, NonFunctionalRequirement, Requirements } from "../../language/generated/ast.js";


export function translateRequirements(req?: Requirements): RequirimentAgregationClass
{
    if(req == undefined)
        { return new RequirimentAgregationClass("", "")};

    const r = new RequirimentAgregationClass(req.id, req.name_fragment??"", req.description);

    const reqStack: RequirimentsBaseClass[] = [];

    req.fr.forEach(frq => r.fr.push(translateRequirement(frq, r, reqStack)));
    req.nfr.forEach(nfrq => r.nfr.push(translateRequirement(nfrq, r, reqStack)));
    req.br.forEach(br => r.br.push(translateRequirement(br, r, reqStack)));

    return r;
}


const __emptyAgragationClass = new RequirimentAgregationClass("no agragation class defined", "no agragation class defined")
export function translateRequirement(req: FunctionalRequirement | NonFunctionalRequirement | BussinesRule, reqRef?: RequirimentAgregationClass, reqStack:  Array<RequirimentsBaseClass> = []): RequirimentsBaseClass
{
    const v = reqStack.find(obj=>obj.identifier==req.id);
    if(v != undefined)
        { return v; }

    const dependencies = req.depends;
    if(req.depend)
        { dependencies.push(req.depend); }

    const aux = new RequirimentsBaseClass(
        req.id,
        req.name_fragment??"Requisito Sem Nome Definido",
        reqRef??__emptyAgragationClass,
        req.priority??"",
        req.description??"",
        dependencies.map(d => new RequirimentsBaseClass(d.ref?.id??"ERRO", d.ref?.name_fragment??"Requisito Sem Nome Definido", reqRef??__emptyAgragationClass, ""))
    )

    reqStack.push(aux);

    return aux;
}