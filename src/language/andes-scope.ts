import { AstNode, AstNodeDescription, DefaultScopeComputation, LangiumDocument } from "langium";
import { CancellationToken } from "vscode-languageclient";
import { Model, isModule, isLocalEntity, FunctionalRequirement, NonFunctionalRequirement, BussinesRule, isProjectModule, UseCase, Event } from "./generated/ast.js";



function generateRequirementDescription(requirement: FunctionalRequirement | NonFunctionalRequirement | BussinesRule): string {
    
    if ( isProjectModule(requirement.$container.$container) ) {
        return `${requirement.$container.$container.name}.${requirement.$container.id}.${requirement.id}`;
    }

    return `${requirement.$container.id}.${requirement.id}`;
}

function generateUseCaseDescription(useCase: UseCase): string {
    if ( isProjectModule(useCase.$container) ) {
        return `${useCase.$container.name}.${useCase.id}`;
    }

    return `${useCase.id}`;
}

function generateEventDescription(event : Event): string {
    if ( isProjectModule(event.$container.$container) ) {
        return `${event.$container.$container.name}.${event.$container.id}.${event.id}`;
    }
    return `${event.$container.id}.${event.id}`;
}

function existProjectModule(root: Model){
    if (root.projectModule.length > 0){
        return true;
    }
    return false;
}


/**
 * Gerador customizado para o escopo global do arquivo.
 * Por padrão, o escopo global só contém os filhos do nó raiz,
 * sejam acessíveis globalmente
 */
export class CustomScopeComputation extends DefaultScopeComputation {
    override async computeExports(document: LangiumDocument<AstNode>, cancelToken?: CancellationToken | undefined): Promise<AstNodeDescription[]> {
        // Os nós que normalmente estariam no escopo global
        
        const default_global = await super.computeExports(document, cancelToken)

        const root = document.parseResult.value as Model;

        const array: (FunctionalRequirement | NonFunctionalRequirement | BussinesRule)[] = [];
        const arrayUC: UseCase[] = [];
        
        if (existProjectModule(root)){
            root.projectModule.forEach(pm => {
                pm.Requirements?.fr.forEach(fr => array.push(fr));
                pm.Requirements?.nfr.forEach(nfr => array.push(nfr));
                pm.Requirements?.br.forEach(br => array.push(br));
                pm.UseCase.forEach(uc => arrayUC.push(uc));
            });
        } else{
            root.Requirements?.fr.forEach(fr => array.push(fr));
            root.Requirements?.nfr.forEach(nfr => array.push(nfr));
            root.Requirements?.br.forEach(br => array.push(br));
            root.UseCase.forEach(uc => arrayUC.push(uc));
        }
        
        array.map(requirement => this.exportNode(requirement, default_global, document))    
        
        const requirements = array.map(requirement => this.descriptions.createDescription(requirement, generateRequirementDescription(requirement), document))
        
        const useCases = arrayUC.map(useCase => 
                this.descriptions.createDescription(useCase, generateUseCaseDescription(useCase), document))
        
        const events = arrayUC.flatMap(useCase => 
            useCase.events.map(event => this.descriptions.createDescription(event, generateEventDescription(event), document)))

        root.UseCase.map(
                    useCase => this.exportNode(useCase, default_global, document))
        
        root.Actor.map(
            actor => this.exportNode(actor, default_global, document))

        root.UseCase.map(
                        usecase => usecase.events.map(event=>this.exportNode(event, default_global, document)))
        
        root.AbstractElement.filter(isModule).map(k =>
            [...k.localEntities, ...k.enumXs, ...k.modules].map(e =>
                this.exportNode(e, default_global, document)
            )
        )
        
        const entities = root.AbstractElement.filter(isModule).flatMap(m =>
            [...m.localEntities, ...m.enumXs, ...m.modules].filter(isLocalEntity).map(e =>
                this.descriptions.createDescription(e, `${e.$container.name}.${e.name}`, document)
            )
        )

        return default_global.concat(requirements, useCases, events, entities)
    }
}
