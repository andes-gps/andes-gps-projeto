Documentação ANDES-Projeto

ANDES (Andes LEDS Tools) é uma extensão do VS Code e uma Linguagem de Domínio Específico (DSL) para engenharia de requisitos e design de arquitetura de software. Ela permite que desenvolvedores descrevam requisitos de software, casos de uso, regras de negócio, entidades e elementos arquiteturais de forma estruturada, gerando diversos artefatos como documentação, arquivos MADE (gestão de projetos) e arquivos SPARK (modelos de domínio).


Link de acesso ao repositório no GITHUB: https://github.com/leds-org/leds-tools-andes.git

    Stack de Tecnologia
        Framework Principal
            Langium (v3.0.0): Ferramenta para criação de DSLs com suporte a LSP
            TypeScript (v5.1.6): Linguagem principal de implementação
            Node.js (>=18.0.0): Ambiente de execução

        Integração com VS Code
            vscode-languageclient (v9.0.1): Cliente de linguagem do VS Code
            vscode-languageserver (v9.0.1): Implementação do protocolo de servidor de linguagem
            Monaco Editor (v1.83.16): Editor de código baseado em web

        Ferramentas de Build
            esbuild (v0.19.2): Empacotador rápido de JavaScript
            Vite (v4.5.5): Ferramenta de build para assets web
            Compilador TypeScript: Compilação multiconfiguração

        Testes
            Vitest (v3.2.1): Framework de testes unitários
            c8 (v10.1.3): Ferramenta de cobertura de código

        Dependências Externas
            andes-lib (v0.1.49): Biblioteca principal com tipos e utilitários de ANDES
            made-cli (v1.0.3): Geração de arquivos MADE
            spark-leds-beta (v0.2.6): Geração de arquivos SPARK
            commander (v11.0.0): Framework para CLI
            chalk (v5.3.0): Estilização de terminal
            axios (v1.7.2): Cliente HTTP

    Estrutura do Projeto
        andes-leds-tools/
        ├── src/
        │   ├── language/          - Gramática DSL e servidor de linguagem
        │   ├── extension/         - Implementação da extensão VS Code
        │   └── cli/               - Interface de linha de comando
        ├── static/                - Assets web do editor Monaco
        ├── scripts/               - Scripts de build e preparação
        ├── tests/                 - Arquivos de teste
        ├── syntaxes/              - Gramática TextMate gerada
        └── out/                   - Saída compilada

    Definição da Linguagem (DSL)
    Arquivos de Gramática
    A linguagem ANDES é definida em múltiplos arquivos de gramática Langium:

1. andes.langium (Entrada Principal)
Define a estrutura raiz Model:
    Project: Visão geral com nome, descrição, propósito, miniworld, arquitetura
    ProjectModule: Organização modular do projeto
    UseCase: Definições de casos de uso
    Actor: Definições de atores
    AbstractElement: Módulos e enums
    ModuleImport: Importação de entidades externas
    Requirements: Contêiner de requisitos

2. requirement.langium
Define tipos de requisitos:
    FunctionalRequirement: Requisitos funcionais com dependências
    NonFunctionalRequirement: Requisitos não funcionais
    BussinesRule: Regras de negócio
    Requirements: Contêiner de requisitos

3. usecase.langium
    Define elementos de casos de uso:
    UseCase: Casos de uso com eventos, requisitos, dependências e performers
    Actor: Atores vinculados a entidades com suporte a herança
    Event: Eventos com ações e dependências

4. entities.langium
    Define entidades de domínio:
    LocalEntity: Entidades com atributos, relações e funções
    ImportedEntity: Entidades externas
    Attribute: Atributos com validações (unique, blank, min, max)
    EnumX: Tipos enumerados
    Relation: Relações (OneToOne, OneToMany, ManyToOne, ManyToMany)
    FunctionEntity: Métodos das entidades

5. helpers.langium
    Fragmentos comuns:
    QualifiedName: Identificadores com pontos
    Description, Name, Priority
    Architecture: Arquiteturas suportadas
    DATATYPE: Tipos nativos

6. terminals.langium
Tokens léxicos:
    ID, INT, STRING, BOOLEAN, etc.
    EmailAddress
    Comentários (ML_COMMENT, SL_COMMENT)

Tipos de Dados
Tipos nativos incluem:
    Básicos: string, integer, decimal, boolean, void
    Temporais: datetime, date
    Identificadores: uuid
    Específicos do Brasil: cpf, cnpj, cep, currency, mobilePhoneNumber

Arquiteturas Suportadas
    python
    java
    C# - csharp-minimal-api 
    C# - csharp-clean-architecture
    C# - csharp-pipeline

Classes e Serviços Centrais
Serviços de Linguagem
AndesServices
    Contêiner principal de serviços:
        Une serviços nativos do Langium aos serviços customizados ANDES
        Registra validações
        Configura escopo

    Serviços importantes:
        AndesValidator
        CustomScopeComputation
        ServiceRegistry


    CustomScopeComputation
    Gerencia escopos globais e referências cruzadas:
        Exporta requisitos, casos de uso, eventos e entidades
        Permite referências entre arquivos

    AndesValidator
    Validações customizadas (atualmente vazio)

Extensão (VS Code)
main.ts
Ponto de entrada da extensão:

    Funções:
        activate()
        deactivate()
        startLanguageClient()
        registerGenerateCommands()

    Comandos registrados:
        andes.generateAll
        andes.generateSpark
        andes.generateMade
        andes.generateDocs

CLI (Linha de Comando)
main.ts

Comandos:
generate <file>

Opções:
    --destination
    --only_Documentation
    --only_spark
    --only_made
    --all
    --vscode

generator.ts
Orquestrador da geração de artefatos:
    Gera documentação, MADE e SPARK

    Geradores
        ArtifactApplication
        Gera documentação BDD

        MadeApplication
        Gera arquivo .made com backlog, épicos, histórias e dependências

        SparkApplication
        Gera arquivo .spark com modelo de domínio

Utilitários de Tradução
Convertem AST de ANDES para tipos internos:

    translateProjectModule
    translateLocalEntity
    translateRelation
    translateFR, translateNFR, etc.

Sistema de Build
    Scripts:
        npm run build
        npm run langium:generate
        npm run build:web
        npm test, npm run coverage

Configurações:
    tsconfig.json, tsconfig.src.json, tsconfig.monarch.json

Saídas:
    out/, dist/, static/, syntaxes/

Protocolo LSP
    Servidor
        Inicializa serviços
        Inicia servidor LSP

    Cliente
        Conecta via IPC
        Suporta highlight, validação, autocomplete, go-to-definition

    Extensões e Arquivos
        ID da linguagem: andes
        Extensão: .andes
        Configuração no VS Code: TextMate, syntax highlighting

Artefatos Gerados
1. Arquivos MADE
    Backlog
    Tarefas
    Dependências

2. Arquivos SPARK
    Configuração
    Módulos
    Entidades e enums

3. Documentação
    BDD
    Casos de uso
    Rastreabilidade

4. Código Aplicacional
    Gerado com andes-lib
    Modelos, APIs, lógica de negócio


Conceitos-Chave

Explicação de:
    Estrutura do projeto
    Engenharia de requisitos
    Modelagem de casos de uso
    Modelagem de domínio
    Referências cruzadas

    Fluxo de Desenvolvimento
        Definir gramática
        Gerar parser
        Implementar serviços
        Build
        Testar
        Gerar artefatos

    Pontos de Extensão
        Validadores customizados
        Geradores novos
        Regras de escopo customizadas
        Extensão da gramática

Dependências
    Runtime
        langium
        andes-lib
        made-cli, spark-leds-beta
        axios, chalk, commander

    Desenvolvimento
        langium-cli
        esbuild, vite
        vitest, c8
        eslint
        semantic-release

    Exemplos de Uso
        CLI
        andes-cli generate projeto.andes -d output/
        andes-cli generate projeto.andes --only_spark
        andes-cli generate projeto.andes --only_made