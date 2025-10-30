import { ActorType, EntityType } from "andes-lib";
import { Actor, Entity } from "../../language/generated/ast.js";
import { Reference } from "langium";


function translateEntity(entity: Reference<Entity>): EntityType
{
    return {
        identifier: entity.$refText,
    }
}

export function translateActor(actor?: Actor): ActorType|null
{
    if(!actor)
        { return null; }
    return {
        identifier: actor.name,
        description: actor.comment,
        targetType: translateEntity(actor.entity),
    }
}

