import { EventType, UseCaseClass } from "andes-lib";
import { Event, isEvent } from "../../language/generated/ast.js";


export function translateEvent(event: Event, ucRef: UseCaseClass, eventStack: EventType[] = []): EventType
{
    const e = eventStack.find(_e => _e.identifier == event.id);
    if(e != undefined)
        { return e; }

    const depends: Event[] = [event.depend?.ref, ...event.depends.map(obj => obj.ref)].filter(obj => (obj!=undefined && isEvent(obj))) as Event[];

    let action: string[] = [];
    if(event.action && event.action instanceof Array)
        { action = event.action; }

    const aux: EventType = {
        identifier: event.id,
        name: event.name_fragment??"Evento Sem Nome",
        ucRef: ucRef,
        action: action,
        description: event.description,
        depends: []
    }
    eventStack.push(aux);
    depends.forEach( dependencie => { aux.depends?.push(translateEvent(dependencie, ucRef, eventStack))} );
    return aux;
}

